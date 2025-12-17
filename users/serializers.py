"""Serializers for job seeker/user features"""

from rest_framework import serializers
from users.models import (
    Job, JobApplication, Interview, TrainingProgram, Enrollment, Certificate,
    CareerQuiz, Resume, WorkExperience, Education, Skill, Document,
    SavedJob, ContactMessage
)
from django.contrib.auth import get_user_model

User = get_user_model()


# Job related serializers
class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'employer', 'employer_name', 'title', 'category', 'description',
            'requirements', 'employment_type', 'location', 'is_remote',
            'salary_min', 'salary_max', 'skills_required', 'deadline',
            'status', 'created_at'
        ]
        read_only_fields = ['id', 'employer', 'created_at']


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.employer.company_name', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'company_name', 'applicant',
            'status', 'cover_letter', 'applied_at', 'employer_notes'
        ]
        read_only_fields = ['id', 'applicant', 'applied_at', 'employer_notes']


class InterviewSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='application.job.title', read_only=True)
    company_name = serializers.CharField(source='application.job.employer.company_name', read_only=True)
    
    class Meta:
        model = Interview
        fields = [
            'id', 'application', 'job_title', 'company_name',
            'scheduled_date', 'scheduled_time', 'duration_minutes',
            'meeting_link', 'location', 'status', 'notes'
        ]
        read_only_fields = ['id', 'application']


# Training related serializers
class TrainingProgramSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source='provider.user.full_name', read_only=True)
    
    class Meta:
        model = TrainingProgram
        fields = [
            'id', 'provider', 'provider_name', 'name', 'description',
            'category', 'external_link', 'duration_hours', 'deadline',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'provider', 'created_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name', read_only=True)
    provider_name = serializers.CharField(source='program.provider.user.full_name', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'program', 'program_name', 'provider_name', 'user',
            'status', 'progress_percentage', 'start_date', 'completion_date',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'start_date', 'created_at']


class CertificateSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='enrollment.program.name', read_only=True)
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'enrollment', 'program_name', 'certificate_file',
            'verification_status', 'uploaded_at', 'verified_at',
            'verified_by', 'rejection_reason'
        ]
        read_only_fields = ['id', 'uploaded_at', 'verified_at', 'verified_by']


# Resume related serializers
class CareerQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerQuiz
        fields = [
            'id', 'user', 'responses', 'recommended_career',
            'recommended_industry', 'work_environment_preference',
            'time_commitment', 'completed_at'
        ]
        read_only_fields = ['id', 'user', 'completed_at']


class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = [
            'id', 'resume', 'job_title', 'company_name', 'location',
            'start_date', 'end_date', 'is_current', 'description'
        ]
        read_only_fields = ['id']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'resume', 'institution_name', 'degree', 'field_of_study',
            'start_date', 'end_date', 'gpa'
        ]
        read_only_fields = ['id']


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'resume', 'skill_name', 'proficiency']
        read_only_fields = ['id']


class ResumeSerializer(serializers.ModelSerializer):
    work_experiences = WorkExperienceSerializer(many=True, read_only=True)
    education_entries = EducationSerializer(many=True, read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    
    class Meta:
        model = Resume
        fields = [
            'id', 'user', 'summary', 'phone', 'linkedin_url',
            'portfolio_url', 'completeness_percentage', 'work_experiences',
            'education_entries', 'skills', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'completeness_percentage', 'created_at', 'updated_at']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            'id', 'user', 'document_type', 'file', 'filename',
            'description', 'uploaded_at', 'uploaded_by'
        ]
        read_only_fields = ['id', 'user', 'uploaded_at']


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'user', 'job', 'saved_at']
        read_only_fields = ['id', 'user', 'saved_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'user', 'name', 'email', 'subject', 'message',
            'status', 'admin_response', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'status', 'admin_response', 'created_at']


# Dashboard serializer
class DashboardStatsSerializer(serializers.Serializer):
    live_jobs = serializers.IntegerField()
    active_trainings = serializers.IntegerField()
    certificates_earned = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    pending_interviews = serializers.IntegerField()
    saved_jobs_count = serializers.IntegerField()
    resume_completeness = serializers.IntegerField()


# AI Career Analysis serializers
class WorkHistoryInputSerializer(serializers.Serializer):
    """Serializer for work history input in career analysis request."""
    job_title = serializers.CharField(max_length=200)
    company_name = serializers.CharField(max_length=200)
    location = serializers.CharField(max_length=200)
    start_date = serializers.DateField()
    end_date = serializers.DateField(required=False, allow_null=True)
    currently_employed = serializers.BooleanField(default=False)
    responsibilities = serializers.CharField(allow_blank=True)


class QuizDataSerializer(serializers.Serializer):
    """Serializer for quiz data input."""
    interests = serializers.CharField(max_length=500)
    work_environment = serializers.CharField(max_length=200)
    training_flexibility = serializers.CharField(max_length=200)
    strengths = serializers.CharField(max_length=500)
    job_priorities = serializers.CharField(max_length=500)
    location = serializers.CharField(max_length=200)


class CareerAnalysisRequestSerializer(serializers.Serializer):
    """Main request serializer for career analysis."""
    quiz_data = QuizDataSerializer()
    work_history = WorkHistoryInputSerializer(many=True)
    public_id = serializers.CharField(max_length=500)
    url = serializers.URLField()


class SectionStatusSerializer(serializers.Serializer):
    """Serializer for resume section status."""
    personal_info = serializers.CharField()
    education = serializers.CharField()
    work_experience = serializers.CharField()
    skills = serializers.CharField()


class ResumeAnalysisSerializer(serializers.Serializer):
    """Serializer for resume analysis results."""
    completeness_score = serializers.IntegerField(min_value=0, max_value=100)
    section_status = SectionStatusSerializer()
    suggestions = serializers.ListField(child=serializers.CharField())


class CareerRecommendationSerializer(serializers.Serializer):
    """Serializer for individual career recommendation."""
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    training_duration = serializers.CharField(max_length=100)
    match_type = serializers.ChoiceField(choices=['primary', 'alternative'])


class CareerAnalysisResponseSerializer(serializers.Serializer):
    """Main response serializer for career analysis."""
    resume_analysis = ResumeAnalysisSerializer()
    career_recommendations = CareerRecommendationSerializer(many=True)

