"""Views for agency compliance monitoring - dashboard, user roster, case management"""

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.utils import timezone
from django.http import HttpResponse
import csv

from users.models import (
    CaseAssignment, ComplianceTimeline, ProgressReport, AuditLog,
    ReferredUser, JobApplication, Enrollment, CareerQuiz, Resume, Document
)
from .serializers import (
    CaseAssignmentSerializer, ComplianceTimelineSerializer,
    ProgressReportSerializer, AuditLogSerializer, UserRosterSerializer,
    AgencyDashboardSerializer
)
from core.permissions import IsVerifiedAgency, IsAgency
from core.utils import get_client_ip


class AgencyDashboardView(APIView):
    """Agency dashboard with compliance metrics"""
    permission_classes = [IsAuthenticated, IsAgency]
    
    def get(self, request):
        agency = request.user.agency_profile
        
        all_cases = CaseAssignment.objects.filter(agency=agency)
        
        stats = {
            'total_assigned_users': all_cases.count(),
            'in_progress': all_cases.filter(compliance_status='on_track').count(),
            'completed': all_cases.filter(compliance_status='completed').count(),
            'non_compliant': all_cases.filter(compliance_status='non_compliant').count(),
            'quiz_completed_count': sum(
                1 for case in all_cases if CareerQuiz.objects.filter(user=case.referred_user.user).exists()
            ),
            'resume_completed_count': sum(
                1 for case in all_cases if Resume.objects.filter(user=case.referred_user.user).exists()
            ),
        }
        
        serializer = AgencyDashboardSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRosterView(APIView):
    """List all referred users with their case assignment status"""
    permission_classes = [IsAuthenticated, IsAgency]
    
    def get(self, request):
        # Get all referred users
        referred_users = ReferredUser.objects.select_related('user').all()
        
        roster_data = []
        for referred_user in referred_users:
            user = referred_user.user
            
            # Check quiz status
            quiz_status = CareerQuiz.objects.filter(user=user).exists()
            
            # Check resume status
            try:
                resume = Resume.objects.get(user=user)
                resume_status = f"{resume.completeness_percentage}% Complete"
            except Resume.DoesNotExist:
                resume_status = "Not Started"
            
            # Count applications and training
            job_applications = JobApplication.objects.filter(applicant=user).count()
            enrollments = Enrollment.objects.filter(user=user).count()
            
            # Certificate status
            verified_certs = Enrollment.objects.filter(
                user=user,
                certificates__verification_status='verified'
            ).count()
            certificate_status = f"{verified_certs} Verified"
            
            # Get case assignment if exists
            try:
                case = CaseAssignment.objects.get(referred_user=referred_user)
                # Agency has assigned a tracking case ID
                case_id = case.case_id if case.case_id else referred_user.case_id
                compliance_status = case.compliance_status
            except CaseAssignment.DoesNotExist:
                # No agency assignment yet, show court case ID from registration
                case_id = referred_user.case_id
                compliance_status = 'on_track'
            
            roster_data.append({

                'id': str(user.id),
                'name': user.full_name,
                'email': user.email,
                'case_id': case_id,
                'quiz_status': quiz_status,
                'resume_status': resume_status,
                'job_applications_count': job_applications,
                'training_courses_count': enrollments,
                'certificate_status': certificate_status,
                'compliance_status': compliance_status
            })
        
        serializer = UserRosterSerializer(roster_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class AssignCaseIDView(APIView):
    """Assign case ID to a referred user"""
    permission_classes = [IsAuthenticated, IsVerifiedAgency]
    
    def post(self, request, user_id):
        agency = request.user.agency_profile
        
        # Get referred user
        try:
            referred_user = ReferredUser.objects.get(user__id=user_id)
        except ReferredUser.DoesNotExist:
            return Response({
                'error': 'Referred user not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        case_id = request.data.get('case_id')
        court_date = request.data.get('court_date', None)
        
        if not case_id:
            return Response({
                'error': 'Case ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or update case assignment
        case, created = CaseAssignment.objects.get_or_create(
            referred_user=referred_user,
            agency=agency,
            defaults={'case_id': case_id, 'court_date': court_date}
        )
        
        if not created:
            case.case_id = case_id
            if court_date:
                case.court_date = court_date
            case.save()
        
        # Log event
        ComplianceTimeline.objects.create(
            case_assignment=case,
            event_type='referral',
            description=f'Case ID {case_id} assigned',
            created_by=request.user
        )
        
        # Audit log
        AuditLog.objects.create(
            admin_user=request.user,
            action='case_assigned',
            target_user=referred_user.user,
            details={'case_id': case_id},
            ip_address=get_client_ip(request)
        )
        
        serializer = CaseAssignmentSerializer(case)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class UserDetailView(APIView):
    """Get detailed user compliance information"""
    permission_classes = [IsAuthenticated, IsAgency]
    
    def get(self, request, user_id):
        # Get referred user
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(id=user_id)
            referred_user = user.referred_profile
        except (User.DoesNotExist, ReferredUser.DoesNotExist):
            return Response({
                'error': 'Referred user not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get case assignment if exists
        case_data = None
        timeline_data = []
        try:
            case = CaseAssignment.objects.get(referred_user=referred_user)
            case_serializer = CaseAssignmentSerializer(case)
            case_data = case_serializer.data
            
            # Get timeline
            timeline = ComplianceTimeline.objects.filter(case_assignment=case).order_by('-event_date')
            timeline_serializer = ComplianceTimelineSerializer(timeline, many=True)
            timeline_data = timeline_serializer.data
        except CaseAssignment.DoesNotExist:
            # No case assignment exists - that's okay, continue without it
            pass
        
        # Get resume details
        try:
            resume = Resume.objects.get(user=user)
            resume_data = {
                'contact_info': resume.phone is not None,
                'work_experience': resume.work_experiences.exists(),
                'skills': resume.skills.exists(),
                'resume_completeness': resume.completeness_percentage,
            }
        except Resume.DoesNotExist:
            resume_data = None
        
        return Response({
            'case_details': case_data,
            'timeline': timeline_data,
            'resume': resume_data,
            'applications_count': JobApplication.objects.filter(applicant=user).count(),
            'enrollments_count': Enrollment.objects.filter(user=user).count()
        }, status=status.HTTP_200_OK)


class UploadUserDocumentView(APIView):
    """Upload document on behalf of user"""
    permission_classes = [IsAuthenticated, IsVerifiedAgency]
    
    def post(self, request, user_id):
        # Verify user is assigned to agency
        try:
            case = CaseAssignment.objects.get(
                referred_user__user__id=user_id,
                agency=request.user.agency_profile
            )
        except CaseAssignment.DoesNotExist:
            return Response({
                'error': 'User not assigned to this agency'
            }, status=status.HTTP_404_NOT_FOUND)
        
        file = request.FILES.get('file')
        document_type = request.data.get('document_type')
        
        if not file or not document_type:
            return Response({
                'error': 'File and document type are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create document
        document = Document.objects.create(
            user=case.referred_user.user,
            document_type=document_type,
            file=file,
            filename=file.name,
            uploaded_by=request.user
        )
        
        # Audit log
        AuditLog.objects.create(
            admin_user=request.user,
            action='document_uploaded',
            target_user=case.referred_user.user,
            details={'document_type': document_type},
            ip_address=get_client_ip(request)
        )
        
        return Response({
            'message': 'Document uploaded successfully',
            'document_id': str(document.id)
        }, status=status.HTTP_201_CREATED)


class GenerateReportView(APIView):
    """Generate progress report for court"""
    permission_classes = [IsAuthenticated, IsVerifiedAgency]
    
    def get(self, request, case_id):
        case = get_object_or_404(
            CaseAssignment,
            case_id=case_id,
            agency=request.user.agency_profile
        )
        
        format_type = request.query_params.get('format', 'csv')
        
        # Generate CSV
        if format_type == 'csv':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="report_{case_id}.csv"'
            
            writer = csv.writer(response)
            writer.writerow(['Case Report', case_id])
            writer.writerow(['User', case.referred_user.user.full_name])
            writer.writerow(['Email', case.referred_user.user.email])
            writer.writerow(['Court Name', case.referred_user.court_name])
            writer.writerow(['Court Case ID', case.referred_user.case_id])
            writer.writerow(['Agency Case ID', case.case_id])
            writer.writerow(['Compliance Status', case.compliance_status])
            writer.writerow(['Court Date', case.court_date])
            writer.writerow([])
            writer.writerow(['Applications', JobApplication.objects.filter(applicant=case.referred_user.user).count()])
            writer.writerow(['Training Courses', Enrollment.objects.filter(user=case.referred_user.user).count()])
            
            # Audit log
            AuditLog.objects.create(
                admin_user=request.user,
                action='report_generated',
                target_user=case.referred_user.user,
                details={'case_id': case_id, 'format': 'csv'},
                ip_address=get_client_ip(request)
            )
            
            return response
        
        return Response({'error': 'Invalid format'}, status=status.HTTP_400_BAD_REQUEST)


class AuditLogListView(generics.ListAPIView):
    """List audit logs"""
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAgency]
    
    def get_queryset(self):
        return AuditLog.objects.filter(
            admin_user__agency_profile=self.request.user.agency_profile
        ).order_by('-timestamp')[:100]


class CourtDateCSVUploadView(APIView):
    """Upload CSV file to bulk-update court dates for referred users"""
    permission_classes = [IsAuthenticated, IsVerifiedAgency]
    
    def post(self, request):
        from datetime import datetime
        
        csv_file = request.FILES.get('file')
        
        if not csv_file:
            return Response({
                'error': 'No file provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not csv_file.name.endswith('.csv'):
            return Response({
                'error': 'File must be a CSV'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        agency = request.user.agency_profile
        
        # Read and process CSV
        try:
            decoded_file = csv_file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            
            # Validate headers
            if 'case_id' not in reader.fieldnames or 'court_date' not in reader.fieldnames:
                return Response({
                    'error': 'CSV must contain "case_id" and "court_date" columns'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            total_rows = 0
            successful_matches = 0
            failed_matches = 0
            failures = []
            
            for row_num, row in enumerate(reader, start=2):  # Start at 2 (header is row 1)
                total_rows += 1
                case_id = row.get('case_id', '').strip()
                court_date_str = row.get('court_date', '').strip()
                
                if not case_id or not court_date_str:
                    failed_matches += 1
                    failures.append({
                        'row': row_num,
                        'case_id': case_id,
                        'error': 'Missing case_id or court_date'
                    })
                    continue
                
                # Parse court date - support both MM/DD/YYYY and YYYY-MM-DD formats
                try:
                    # Try MM/DD/YYYY format first
                    court_date = datetime.strptime(court_date_str, '%m/%d/%Y').date()
                except ValueError:
                    try:
                        # Fall back to YYYY-MM-DD format
                        court_date = datetime.strptime(court_date_str, '%Y-%m-%d').date()
                    except ValueError:
                        failed_matches += 1
                        failures.append({
                            'row': row_num,
                            'case_id': case_id,
                            'error': f'Invalid date format: {court_date_str}. Expected MM/DD/YYYY or YYYY-MM-DD'
                        })
                        continue
                
                # Find referred user(s) by case_id - handle duplicates
                referred_users = ReferredUser.objects.filter(case_id=case_id)
                
                if not referred_users.exists():
                    failed_matches += 1
                    failures.append({
                        'row': row_num,
                        'case_id': case_id,
                        'error': 'User with this case_id not found'
                    })
                    continue
                
                # Process all users with this case_id
                users_updated = 0
                for referred_user in referred_users:
                    # Create or update case assignment
                    case_assignment, created = CaseAssignment.objects.get_or_create(
                        referred_user=referred_user,
                        agency=agency,
                        defaults={
                            'case_id': case_id,
                            'court_date': court_date
                        }
                    )
                    
                    if not created:
                        # Update existing case
                        case_assignment.court_date = court_date
                        case_assignment.save()
                    
                    # Log event
                    ComplianceTimeline.objects.create(
                        case_assignment=case_assignment,
                        event_type='court_appearance',
                        description=f'Court date set to {court_date}',
                        created_by=request.user
                    )
                    
                    users_updated += 1
                
                successful_matches += users_updated
            
            # Create audit log
            AuditLog.objects.create(
                admin_user=request.user,
                action='compliance_updated',
                details={
                    'action': 'csv_upload',
                    'total_rows': total_rows,
                    'successful': successful_matches,
                    'failed': failed_matches
                },
                ip_address=get_client_ip(request)
            )
            
            response_data = {
                'total_rows': total_rows,
                'successful_matches': successful_matches,
                'failed_matches': failed_matches,
                'failures': failures
            }
            
            from .serializers import CSVUploadResponseSerializer
            serializer = CSVUploadResponseSerializer(response_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Error processing CSV: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CourtDateUsersListView(APIView):
    """List all users with court dates set"""
    permission_classes = [IsAuthenticated, IsAgency]
    
    def get(self, request):
        agency = request.user.agency_profile
        
        # Get all case assignments with court dates
        queryset = CaseAssignment.objects.filter(
            agency=agency,
            court_date__isnull=False
        ).select_related('referred_user__user')
        
        # Filter by status if provided
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(compliance_status=status_filter)
        
        # Order by court_date (upcoming first)
        queryset = queryset.order_by('court_date')
        
        from .serializers import CourtDateUserSerializer
        serializer = CourtDateUserSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateComplianceStatusView(APIView):
    """Update compliance status for a case"""
    permission_classes = [IsAuthenticated, IsVerifiedAgency]
    
    def patch(self, request, case_id):
        agency = request.user.agency_profile
        
        # Get case assignment
        try:
            case_assignment = CaseAssignment.objects.get(
                id=case_id,
                agency=agency
            )
        except CaseAssignment.DoesNotExist:
            return Response({
                'error': 'Case not found or not assigned to this agency'
            }, status=status.HTTP_404_NOT_FOUND)
        
        new_status = request.data.get('status')
        
        if not new_status:
            return Response({
                'error': 'Status is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate status
        valid_statuses = ['on_track', 'delayed', 'non_compliant', 'completed', 'closed']
        if new_status not in valid_statuses:
            return Response({
                'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update status
        old_status = case_assignment.compliance_status
        case_assignment.compliance_status = new_status
        case_assignment.save()
        
        # Log event
        ComplianceTimeline.objects.create(
            case_assignment=case_assignment,
            event_type='court_appearance',
            description=f'Compliance status updated from {old_status} to {new_status}',
            created_by=request.user
        )
        
        # Audit log
        AuditLog.objects.create(
            admin_user=request.user,
            action='compliance_updated',
            target_user=case_assignment.referred_user.user,
            details={
                'case_id': str(case_assignment.id),
                'old_status': old_status,
                'new_status': new_status
            },
            ip_address=get_client_ip(request)
        )
        
        from .serializers import CaseAssignmentSerializer
        serializer = CaseAssignmentSerializer(case_assignment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserHistoryReportView(APIView):
    """Get comprehensive user history report for download"""
    permission_classes = [IsAuthenticated, IsAgency]
    
    def get(self, request, user_id):
        agency = request.user.agency_profile
        
        # Get user
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(id=user_id)
            referred_user = user.referred_profile
        except (User.DoesNotExist, ReferredUser.DoesNotExist):
            return Response({
                'error': 'Referred user not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get case assignment
        case_info = None
        try:
            case = CaseAssignment.objects.get(referred_user=referred_user, agency=agency)
            case_info = {
                'case_id': case.case_id,
                'court_date': case.court_date,
                'compliance_status': case.compliance_status,
                'assigned_date': case.assigned_date,
                'notes': case.notes
            }
        except CaseAssignment.DoesNotExist:
            pass
        
        # Get resume data
        resume_data = None
        
        try:
            from users.models import Resume
            resume = Resume.objects.get(user=user)
            resume_data = {
                'summary': resume.summary,
                'phone': resume.phone,
                'linkedin_url': resume.linkedin_url,
                'portfolio_url': resume.portfolio_url,
                'resume_pdf_url': resume.resume_pdf_url,
                'completeness_percentage': resume.completeness_percentage
            }
            
        except Resume.DoesNotExist:
            pass
        
        # Get training enrollments
        enrollments = Enrollment.objects.filter(user=user).select_related('program')
        training_data = [{
            'program_name': e.program.name,
            'category': e.program.category.name if e.program.category else None,
            'status': e.status,
            'progress_percentage': e.progress_percentage,
            'start_date': e.start_date,
            'completion_date': e.completion_date,
            'external_link': e.program.external_link
        } for e in enrollments]
        
        # Get certificates
        from users.models import Certificate
        certificates = Certificate.objects.filter(
            enrollment__user=user
        ).select_related('enrollment__program')
        
        certificates_data = [{
            'training_program': c.enrollment.program.name,
            'verification_status': c.verification_status,
            'certificate_url': c.certificate_file.url if c.certificate_file else None,
            'uploaded_at': c.uploaded_at,
            'verified_at': c.verified_at
        } for c in certificates]
        
        # Get job applications
        applications = JobApplication.objects.filter(applicant=user).select_related('job')
        job_applications_data = [{
            'job_title': app.job.title,
            'company': app.job.employer.company_name if hasattr(app.job, 'employer') else 'N/A',
            'location': app.job.location,
            'employment_type': app.job.employment_type,
            'status': app.status,
            'applied_at': app.applied_at,
            'cover_letter': app.cover_letter
        } for app in applications]
        
        # Get career quiz
        quiz_data = None
        try:
            quiz = CareerQuiz.objects.get(user=user)
            quiz_data = {
                'recommended_career': quiz.recommended_career,
                'recommended_industry': quiz.recommended_industry,
                'work_environment_preference': quiz.work_environment_preference,
                'time_commitment': quiz.time_commitment,
                'completed_at': quiz.completed_at
            }
        except CareerQuiz.DoesNotExist:
            pass
        
        # Compile complete report
        report = {
            'user_info': {
                'id': str(user.id),
                'full_name': user.full_name,
                'email': user.email,
                'user_type': user.user_type,
                'date_joined': user.date_joined
            },
            'referred_user_info': {
                'phone_number': referred_user.phone_number,
                'court_name': referred_user.court_name,
                'case_id': referred_user.case_id,
                'has_paid': referred_user.has_paid,
                'resume_completeness': referred_user.resume_completeness
            },
            'case_assignment': case_info,
            'career_quiz': quiz_data,
            'resume': resume_data,
            'training_enrollments': training_data,
            'certificates': certificates_data,
            'job_applications': job_applications_data,
            'summary_stats': {
                'total_trainings': len(training_data),
                'completed_trainings': sum(1 for t in training_data if t['status'] == 'completed'),
                'total_certificates': len(certificates_data),
                'verified_certificates': sum(1 for c in certificates_data if c['verification_status'] == 'verified'),
                'total_job_applications': len(job_applications_data),
            }
        }
        
        # Audit log
        AuditLog.objects.create(
            admin_user=request.user,
            action='report_downloaded',
            target_user=user,
            details={'report_type': 'user_history'},
            ip_address=get_client_ip(request)
        )
        
        return Response(report, status=status.HTTP_200_OK)


