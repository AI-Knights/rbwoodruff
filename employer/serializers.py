"""Serializers for employer features"""

from rest_framework import serializers
from users.models import Job, JobApplication, Interview, Employer, Skill, Certificate
from django.contrib.auth import get_user_model

User = get_user_model()


class EmployerJobSerializer(serializers.ModelSerializer):
    applicant_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'category', 'description', 'requirements',
            'employment_type', 'location', 'is_remote', 'salary_min',
            'salary_max', 'skills_required', 'number_of_openings', 'deadline', 'status',
            'created_at', 'applicant_count'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_applicant_count(self, obj):
        return obj.applications.count()


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for applicant skills"""
    class Meta:
        model = Skill
        fields = ['id', 'skill_name', 'proficiency']


class CertificateSerializer(serializers.ModelSerializer):
    """Serializer for applicant training certificates"""
    training_program_name = serializers.CharField(source='enrollment.program.name', read_only=True)
    training_category = serializers.SerializerMethodField()
    certificate_file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'training_program_name', 'training_category', 
            'verification_status', 'certificate_file_url', 
            'uploaded_at', 'verified_at'
        ]
    
    def get_training_category(self, obj):
        """Get category name from the training program"""
        try:
            return obj.enrollment.program.category.name if obj.enrollment.program.category else None
        except:
            return None
    
    def get_certificate_file_url(self, obj):
        """Get Cloudinary URL for the certificate file"""
        try:
            return obj.certificate_file.url if obj.certificate_file else None
        except:
            return None


class ApplicantSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.full_name', read_only=True)
    applicant_email = serializers.CharField(source='applicant.email', read_only=True)
    profile_photo_url = serializers.SerializerMethodField()
    resume_completeness = serializers.SerializerMethodField()
    resume_pdf_url = serializers.SerializerMethodField()
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_category = serializers.CharField(source='job.category', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)
    skills = serializers.SerializerMethodField()
    certifications = serializers.SerializerMethodField()
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'job_category', 'job_location',
            'applicant', 'applicant_name', 'applicant_email', 'profile_photo_url',
            'status', 'cover_letter', 'applied_at', 'employer_notes',
            'resume_completeness', 'resume_pdf_url', 'skills', 'certifications'
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
    
    def get_resume_pdf_url(self, obj):
        """Get resume PDF URL from Resume model"""
        try:
            from users.models import Resume
            resume = Resume.objects.get(user=obj.applicant)
            return resume.resume_pdf_url if resume.resume_pdf_url else None
        except:
            return None
    
    def get_profile_photo_url(self, obj):
        """Get applicant's profile photo URL from Cloudinary"""
        try:
            if obj.applicant.profile_pic:
                return obj.applicant.profile_pic.url
            return None
        except:
            return None
    
    def get_skills(self, obj):
        """Get skills from applicant's resume"""
        try:
            from users.models import Resume
            resume = Resume.objects.get(user=obj.applicant)
            skills = resume.skills.all()
            return SkillSerializer(skills, many=True).data
        except:
            return []
    
    def get_certifications(self, obj):
        """Get certificate URL from applicant's completed training enrollments"""
        try:
            # Get the first completed enrollment with a certificate
            completed_enrollments = obj.applicant.enrollments.filter(status='completed')
            for enrollment in completed_enrollments:
                # Get the first certificate for this enrollment
                certificate = enrollment.certificates.first()
                if certificate and certificate.certificate_file:
                    return certificate.certificate_file.url
            return None
        except:
            return None


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
    applied_count = serializers.IntegerField()
    shortlisted_count = serializers.IntegerField()
    rejected_count = serializers.IntegerField()
    hired_candidates = serializers.IntegerField()
    pending_applications = serializers.IntegerField()
    top_jobs = serializers.ListField(child=serializers.DictField())
