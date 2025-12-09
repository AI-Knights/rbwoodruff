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
    """List all assigned users with compliance details"""
    permission_classes = [IsAuthenticated, IsAgency]
    
    def get(self, request):
        agency = request.user.agency_profile
        cases = CaseAssignment.objects.filter(agency=agency)
        
        roster_data = []
        for case in cases:
            user = case.referred_user.user
            
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
            
            roster_data.append({
                'id': str(user.id),
                'name': user.full_name,
                'email': user.email,
                'case_id': case.case_id if case.case_id else 'Not Assigned',
                'quiz_status': quiz_status,
                'resume_status': resume_status,
                'job_applications_count': job_applications,
                'training_courses_count': enrollments,
                'certificate_status': certificate_status,
                'compliance_status': case.compliance_status
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
        agency = request.user.agency_profile
        
        # Get case assignment
        try:
            case = CaseAssignment.objects.get(
                referred_user__user__id=user_id,
                agency=agency
            )
        except CaseAssignment.DoesNotExist:
            return Response({
                'error': 'User not assigned to this agency'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get timeline
        timeline = ComplianceTimeline.objects.filter(case_assignment=case).order_by('-event_date')
        timeline_serializer = ComplianceTimelineSerializer(timeline, many=True)
        
        # Get resume details
        try:
            resume = Resume.objects.get(user=case.referred_user.user)
            resume_data = {
                'contact_info': resume.phone is not None,
                'work_experience': resume.work_experiences.exists(),
                'skills': resume.skills.exists(),
                'resume_completeness': resume.completeness_percentage,
            }
        except Resume.DoesNotExist:
            resume_data = None
        
        case_serializer = CaseAssignmentSerializer(case)
        
        return Response({
            'case_details': case_serializer.data,
            'timeline': timeline_serializer.data,
            'resume': resume_data,
            'applications_count': JobApplication.objects.filter(applicant=case.referred_user.user).count(),
            'enrollments_count': Enrollment.objects.filter(user=case.referred_user.user).count()
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
            writer.writerow(['Case Name', case.referred_user.case_name])
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
