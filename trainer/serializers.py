"""Serializers for training provider features"""

from rest_framework import serializers
from users.models import TrainingProgram, Enrollment, Certificate, EmployerTrainingLinkage
from django.contrib.auth import get_user_model

User = get_user_model()


class TrainerProgramSerializer(serializers.ModelSerializer):
    learner_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TrainingProgram
        fields = [
            'id', 'name', 'description', 'category', 'external_link',
            'duration_hours', 'deadline', 'is_active', 'created_at',
            'learner_count'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_learner_count(self, obj):
        return obj.enrollments.count()


class LearnerSerializer(serializers.ModelSerializer):
    learner_name = serializers.CharField(source='user.full_name', read_only=True)
    learner_email = serializers.CharField(source='user.email', read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    has_certificate = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = [
            'id', 'user', 'learner_name', 'learner_email', 'program',
            'program_name', 'status', 'progress_percentage',
            'start_date', 'completion_date', 'has_certificate'
        ]
    
    def get_has_certificate(self, obj):
        return Certificate.objects.filter(enrollment=obj).exists()


class CertificateVerificationSerializer(serializers.ModelSerializer):
    learner_name = serializers.CharField(source='enrollment.user.full_name', read_only=True)
    program_name = serializers.CharField(source='enrollment.program.name', read_only=True)
    
    class Meta:
        model = Certificate
        fields = [
            'id', 'enrollment', 'learner_name', 'program_name',
            'certificate_file', 'verification_status', 'uploaded_at',
            'rejection_reason'
        ]
        read_only_fields = ['id', 'enrollment', 'uploaded_at']


class EmployerLinkageSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.company_name', read_only=True)
    program_name = serializers.CharField(source='training_program.name', read_only=True)
    
    class Meta:
        model = EmployerTrainingLinkage
        fields = [
            'id', 'employer', 'employer_name', 'training_program',
            'program_name', 'roles_hiring', 'salary_range',
            'active_listings', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TrainerDashboardSerializer(serializers.Serializer):
    total_learners = serializers.IntegerField()
    active_learners = serializers.IntegerField()
    completed_learners = serializers.IntegerField()
    pending_enrollments = serializers.IntegerField()
    average_completion_rate = serializers.FloatField()
    pending_certificate_verifications = serializers.IntegerField()
