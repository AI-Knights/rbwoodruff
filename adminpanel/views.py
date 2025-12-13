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
