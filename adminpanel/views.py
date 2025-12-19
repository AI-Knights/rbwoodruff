"""Views for super admin panel - platform oversight and verification"""

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

from users.models import (
    Agency, Employer, TrainingProvider, Payment, Job,
    TrainingProgram, JobApplication, Resume
)
from authentication.models import UserAccount
from .serializers import (
    AdminDashboardSerializer, AgencyVerificationSerializer,
    EmployerVerificationSerializer, TrainerVerificationSerializer,
    UserListSerializer, PaymentListSerializer
)
from core.permissions import IsAdmin
from core.utils import get_client_ip


class AdminDashboardView(APIView):
    """Super admin dashboard with global metrics"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request):
        # Calculate metrics
        total_users = UserAccount.objects.filter(is_active=True).count()
        active_programs = TrainingProgram.objects.filter(is_active=True).count()
        
        # Revenue
        total_revenue = Payment.objects.filter(status='succeeded').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Monthly revenue
        month_ago = timezone.now() - timedelta(days=30)
        monthly_revenue = Payment.objects.filter(
            status='succeeded',
            created_at__gte=month_ago
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Pending verifications
        pending_agencies = Agency.objects.filter(approval_status='pending').count()
        pending_employers = Employer.objects.filter(is_verified=False).count()
        pending_trainers = TrainingProvider.objects.filter(is_verified=False).count()
        pending_verifications = pending_agencies + pending_employers + pending_trainers
        
        # Placement rate
        total_applications = JobApplication.objects.count()
        hired = JobApplication.objects.filter(status='hired').count()
        placement_rate = (hired / total_applications * 100) if total_applications > 0 else 0
        
        stats = {
            'total_users': total_users,
            'active_programs': active_programs,
            'total_revenue': float(total_revenue),
            'monthly_revenue': float(monthly_revenue),
            'pending_verifications': pending_verifications,
            'placement_rate': round(placement_rate, 2)
        }
        
        serializer = AdminDashboardSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AgencyListView(generics.ListAPIView):
    """List all agencies with optional status filtering"""
    serializer_class = AgencyVerificationSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        status_filter = self.request.query_params.get('status', None)
        queryset = Agency.objects.all()
        
        if status_filter:
            queryset = queryset.filter(approval_status=status_filter)
        
        return queryset.order_by('-created_at')


class PendingAgenciesView(generics.ListAPIView):
    """List pending agency verifications"""
    serializer_class = AgencyVerificationSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        return Agency.objects.filter(approval_status='pending').order_by('-created_at')


class ApproveAgencyView(APIView):
    """Approve or reject agency"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def post(self, request, agency_id):
        agency = get_object_or_404(Agency, id=agency_id)
        
        action = request.data.get('action')  # 'approve' or 'reject'
        
        if action == 'approve':
            agency.approval_status = 'approved'
            agency.is_verified = True
            agency.verification_date = timezone.now()
            agency.save()
            
            return Response({
                'message': 'Agency approved successfully'
            }, status=status.HTTP_200_OK)
            
        elif action == 'reject':
            agency.approval_status = 'rejected'
            agency.save()
            
            return Response({
                'message': 'Agency rejected'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Invalid action'
        }, status=status.HTTP_400_BAD_REQUEST)


class EmployerListView(generics.ListAPIView):
    """List all employers"""
    serializer_class = EmployerVerificationSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        verified = self.request.query_params.get('verified', None)
        queryset = Employer.objects.all()
        
        if verified is not None:
            queryset = queryset.filter(is_verified=verified.lower() == 'true')
        
        return queryset.order_by('-created_at')


class VerifyEmployerView(APIView):
    """Verify or suspend employer"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def post(self, request, employer_id):
        employer = get_object_or_404(Employer, id=employer_id)
        
        action = request.data.get('action')  # 'verify' or 'suspend'
        
        if action == 'verify':
            employer.is_verified = True
            employer.verification_date = timezone.now()
            employer.save()
            
            return Response({
                'message': 'Employer verified successfully'
            }, status=status.HTTP_200_OK)
            
        elif action == 'suspend':
            employer.is_verified = False
            employer.save()
            
            # Optionally deactivate all jobs
            Job.objects.filter(employer=employer, status='active').update(status='closed')
            
            return Response({
                'message': 'Employer suspended'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Invalid action'
        }, status=status.HTTP_400_BAD_REQUEST)


class TrainerListView(generics.ListAPIView):
    """List all training providers"""
    serializer_class = TrainerVerificationSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        verified = self.request.query_params.get('verified', None)
        queryset = TrainingProvider.objects.all()
        
        if verified is not None:
            queryset = queryset.filter(is_verified=verified.lower() == 'true')
        
        return queryset.order_by('-created_at')


class VerifyTrainerView(APIView):
    """Verify or suspend training provider"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def post(self, request, trainer_id):
        trainer = get_object_or_404(TrainingProvider, id=trainer_id)
        
        action = request.data.get('action')  # 'verify' or 'suspend'
        
        if action == 'verify':
            trainer.is_verified = True
            trainer.verification_date = timezone.now()
            trainer.save()
            
            return Response({
                'message': 'Trainer verified successfully'
            }, status=status.HTTP_200_OK)
            
        elif action == 'suspend':
            trainer.is_verified = False
            trainer.save()
            
            # Optionally deactivate all programs
            TrainingProgram.objects.filter(provider=trainer, is_active=True).update(is_active=False)
            
            return Response({
                'message': 'Trainer suspended'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Invalid action'
        }, status=status.HTTP_400_BAD_REQUEST)


class AllUsersListView(generics.ListAPIView):
    """List all job seekers"""
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        user_type = self.request.query_params.get('user_type', None)
        
        queryset = UserAccount.objects.filter(
            user_type__in=['general', 'agency_referred']
        )
        
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        
        return queryset.order_by('-date_joined')


class LockUserAccountView(APIView):
    """Lock or unlock user account"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def post(self, request, user_id):
        user = get_object_or_404(UserAccount, id=user_id)
        
        action = request.data.get('action')  # 'lock' or 'unlock'
        
        if action == 'lock':
            user.is_active = False
            user.save()
            
            return Response({
                'message': 'User account locked'
            }, status=status.HTTP_200_OK)
            
        elif action == 'unlock':
            user.is_active = True
            user.save()
            
            return Response({
                'message': 'User account unlocked'
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Invalid action'
        }, status=status.HTTP_400_BAD_REQUEST)


class PaymentHistoryView(generics.ListAPIView):
    """List all platform payments"""
    serializer_class = PaymentListSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        status_filter = self.request.query_params.get('status', None)
        queryset = Payment.objects.all()
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')


class UserResumeView(APIView):
    """View user's resume"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request, user_id):
        user = get_object_or_404(UserAccount, id=user_id)
        
        try:
            resume = Resume.objects.get(user=user)
            data = {
                'summary': resume.summary,
                'phone': resume.phone,
                'linkedin_url': resume.linkedin_url,
                'portfolio_url': resume.portfolio_url,
                'work_experiences': list(resume.work_experiences.values()),
                'education': list(resume.education_entries.values()),
                'skills': list(resume.skills.values()),
            }
            return Response(data, status=status.HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({
                'message': 'No resume found'
            }, status=status.HTTP_404_NOT_FOUND)


class TrainingEnrollmentListView(generics.ListAPIView):
    """List all training enrollments across all programs"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request):
        from users.models import Enrollment, Certificate, Resume
        
        # Get query parameters for filtering
        program_id = request.query_params.get('program', None)
        status_filter = request.query_params.get('status', None)
        verification_status = request.query_params.get('certificate_status', None)
        
        queryset = Enrollment.objects.all()
        
        if program_id:
            queryset = queryset.filter(program_id=program_id)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Build response data
        enrollments_data = []
        for enrollment in queryset.order_by('-start_date'):
            # Get certificate info
            try:
                certificate = Certificate.objects.get(enrollment=enrollment)
                cert_status = certificate.verification_status
                cert_uploaded_at = certificate.uploaded_at
            except Certificate.DoesNotExist:
                cert_status = "not_uploaded"
                cert_uploaded_at = None
            
            # Filter by certificate status if provided
            if verification_status and cert_status != verification_status:
                continue
            
            # Check if resume exists
            resume_exists = Resume.objects.filter(user=enrollment.user).exists()
            resume_url = f"/admin-panel/users/{enrollment.user.id}/resume/" if resume_exists else None
            
            enrollments_data.append({
                'id': str(enrollment.id),
                'user_id': str(enrollment.user.id),
                'user_name': enrollment.user.full_name,
                'user_email': enrollment.user.email,
                'program_id': str(enrollment.program.id),
                'program_name': enrollment.program.name,
                'program_category': enrollment.program.category,
                'provider_name': enrollment.program.provider.user.full_name,
                'enrollment_status': enrollment.status,
                'progress_percentage': enrollment.progress_percentage,
                'start_date': enrollment.start_date,
                'completion_date': enrollment.completion_date,
                'certificate_status': cert_status,
                'certificate_uploaded_at': cert_uploaded_at,
                'has_resume': resume_exists,
                'resume_url': resume_url
            })
        
        return Response({
            'count': len(enrollments_data),
            'results': enrollments_data
        }, status=status.HTTP_200_OK)



class CategoryViewSet(APIView):
    """Admin category CRUD operations"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request, category_id=None):
        """List all categories or get specific category"""
        from users.models import Category
        from adminpanel.serializers import CategorySerializer
        
        if category_id:
            category = get_object_or_404(Category, id=category_id)
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # List all categories
        categories = Category.objects.all().order_by("name")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Create new category"""
        from users.models import Category
        from adminpanel.serializers import CategorySerializer
        
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, category_id):
        """Update category"""
        from users.models import Category
        from adminpanel.serializers import CategorySerializer
        
        category = get_object_or_404(Category, id=category_id)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, category_id):
        """Delete category - moves jobs/trainings to Other"""
        from users.models import Category, Job, TrainingProgram
        
        category = get_object_or_404(Category, id=category_id)
        
        # Prevent deletion of Other category
        if category.slug == "other":
            return Response({
                "error": "Cannot delete Other category"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create Other category
        other_category, _ = Category.objects.get_or_create(
            slug="other",
            defaults={"name": "Other", "description": "Other categories"}
        )
        
        # Move all jobs and trainings to Other
        Job.objects.filter(category=category).update(category=other_category)
        TrainingProgram.objects.filter(category=category).update(category=other_category)
        
        # Delete the category
        category.delete()
        
        return Response({
            "message": f"Category deleted. {Job.objects.filter(category=other_category).count()} jobs and {TrainingProgram.objects.filter(category=other_category).count()} trainings moved to Other."
        }, status=status.HTTP_200_OK)

