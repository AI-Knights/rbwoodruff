"""Views for employer features - dashboard, job posting, applicant management"""

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count

from users.models import Job, JobApplication, Interview, Resume, Certificate
from .serializers import (
    EmployerJobSerializer, ApplicantSerializer,
    InterviewCreateSerializer, EmployerDashboardSerializer
)
from core.permissions import IsVerifiedEmployer, IsEmployer


class EmployerDashboardView(APIView):
    """Employer dashboard with metrics"""
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def get(self, request):
        employer_profile = request.user.employer_profile
        
        # Calculate stats
        all_jobs = Job.objects.filter(employer=employer_profile)
        all_applications = JobApplication.objects.filter(job__employer=employer_profile)
        
        # Application status counts
        applied_count = all_applications.filter(status='pending').count()
        shortlisted_count = all_applications.filter(status='shortlisted').count()
        rejected_count = all_applications.filter(status='rejected').count()
        
        # Top 10 jobs by applicant count
        top_jobs = all_jobs.annotate(
            applicant_count=Count('applications')
        ).order_by('-applicant_count')[:10]
        
        top_jobs_data = [
            {
                'job_id': str(job.id),
                'job_title': job.title,
                'applicant_count': job.applicant_count,
                'job_status': job.status
            }
            for job in top_jobs
        ]
        
        stats = {
            'total_jobs_posted': all_jobs.count(),
            'active_jobs': all_jobs.filter(status='active').count(),
            'total_applicants': all_applications.count(),
            'applied_count': applied_count,
            'shortlisted_count': shortlisted_count,
            'rejected_count': rejected_count,
            'hired_candidates': all_applications.filter(status='hired').count(),
            'pending_applications': applied_count,  # Same as applied_count for backward compatibility
            'top_jobs': top_jobs_data
        }
        
        serializer = EmployerDashboardSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)


class JobCreateView(generics.CreateAPIView):
    """Post a new job"""
    serializer_class = EmployerJobSerializer
    permission_classes = [IsAuthenticated, IsVerifiedEmployer]
    
    def perform_create(self, serializer):
        serializer.save(employer=self.request.user.employer_profile)


class JobListView(generics.ListAPIView):
    """List employer's jobs"""
    serializer_class = EmployerJobSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        status_filter = self.request.query_params.get('status', None)
        queryset = Job.objects.filter(employer=self.request.user.employer_profile)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')


class JobUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Update or delete a job"""
    serializer_class = EmployerJobSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        return Job.objects.filter(employer=self.request.user.employer_profile)


class ApplicantListView(generics.ListAPIView):
    """List applicants for a specific job"""
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        
        # Verify job belongs to employer
        job = get_object_or_404(
            Job,
            id=job_id,
            employer=self.request.user.employer_profile
        )
        
        # Filter by status if provided
        status_filter = self.request.query_params.get('status', None)
        queryset = JobApplication.objects.filter(job=job)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-applied_at')


class AllApplicantsView(generics.ListAPIView):
    """List all applicants across all employer's jobs"""
    serializer_class = ApplicantSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        employer = self.request.user.employer_profile
        status_filter = self.request.query_params.get('status', None)
        
        # Get all applications for all jobs posted by this employer
        queryset = JobApplication.objects.filter(job__employer=employer)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-applied_at')


class ApplicantDetailView(APIView):
    """Get single applicant details including resume"""
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def get(self, request, application_id):
        # Get application and verify it belongs to employer's job
        application = get_object_or_404(
            JobApplication,
            id=application_id,
            job__employer=request.user.employer_profile
        )
        
        # Get applicant resume
        try:
            resume = Resume.objects.get(user=application.applicant)
            resume_data = {
                'summary': resume.summary,
                'phone': resume.phone,
                'linkedin_url': resume.linkedin_url,
                'portfolio_url': resume.portfolio_url,
                'work_experiences': list(resume.work_experiences.values()),
                'education': list(resume.education_entries.values()),
                'skills': list(resume.skills.values()),
            }
        except Resume.DoesNotExist:
            resume_data = None
        
        # Get certificates
        certificates = Certificate.objects.filter(
            enrollment__user=application.applicant,
            verification_status='verified'
        ).values('id', 'enrollment__program__name', 'verified_at')
        
        serializer = ApplicantSerializer(application)
        
        return Response({
            'application': serializer.data,
            'resume': resume_data,
            'certificates': list(certificates)
        }, status=status.HTTP_200_OK)


class UpdateApplicationStatusView(APIView):
    """Update application status (shortlist, hire, reject)"""
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def patch(self, request, application_id):
        application = get_object_or_404(
            JobApplication,
            id=application_id,
            job__employer=request.user.employer_profile
        )
        
        new_status = request.data.get('status')
        employer_notes = request.data.get('employer_notes', '')
        
        if new_status not in ['shortlisted', 'rejected', 'hired', 'interview_scheduled', 'offer_received']:
            return Response({
                'error': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        application.status = new_status
        if employer_notes:
            application.employer_notes = employer_notes
        application.save()
        
        serializer = ApplicantSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ScheduleInterviewView(generics.CreateAPIView):
    """Schedule an interview"""
    serializer_class = InterviewCreateSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def create(self, request, *args, **kwargs):
        application_id = request.data.get('application')
        
        # Verify application belongs to employer
        application = get_object_or_404(
            JobApplication,
            id=application_id,
            job__employer=request.user.employer_profile
        )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Update application status
        application.status = 'interview_scheduled'
        application.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class InterviewListView(generics.ListAPIView):
    """List all interviews for employer's jobs"""
    serializer_class = InterviewCreateSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    
    def get_queryset(self):
        return Interview.objects.filter(
            application__job__employer=self.request.user.employer_profile
        ).order_by('scheduled_date', 'scheduled_time')
