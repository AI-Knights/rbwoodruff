"""Serializers for employer features"""

from rest_framework import serializers
from users.models import Job, JobApplication, Interview, Employer
from django.contrib.auth import get_user_model

User = get_user_model()


class EmployerJobSerializer(serializers.ModelSerializer):
    applicant_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'category', 'description', 'requirements',
            'employment_type', 'location', 'is_remote', 'salary_min',
            'salary_max', 'skills_required', 'deadline', 'status',
            'created_at', 'applicant_count'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_applicant_count(self, obj):
        return obj.applications.count()


class ApplicantSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.full_name', read_only=True)
    applicant_email = serializers.CharField(source='applicant.email', read_only=True)
    resume_completeness = serializers.SerializerMethodField()
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'applicant', 'applicant_name', 'applicant_email',
            'status', 'cover_letter', 'applied_at', 'employer_notes',
            'resume_completeness'
        ]
        read_only_fields = ['id', 'applicant', 'applied_at']
    
    def get_resume_completeness(self, obj):
        user = obj.applicant
        try:
            if user.user_type == 'general':
                return user.general_profile.resume_completeness
            else:
                return user.referred_profile.resume_completeness
        except:
            return 0


class InterviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = [
            'application', 'scheduled_date', 'scheduled_time',
            'duration_minutes', 'meeting_link', 'location', 'notes'
        ]


class EmployerDashboardSerializer(serializers.Serializer):
    total_jobs_posted = serializers.IntegerField()
    active_jobs = serializers.IntegerField()
    total_applicants = serializers.IntegerField()
    hired_candidates = serializers.IntegerField()
    pending_applications = serializers.IntegerField()
