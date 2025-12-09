"""Serializers for agency compliance features"""

from rest_framework import serializers
from users.models import (
    CaseAssignment, ComplianceTimeline, ProgressReport, AuditLog,
    ReferredUser, JobApplication, Enrollment, CareerQuiz, Resume
)
from django.contrib.auth import get_user_model

User = get_user_model()


class CaseAssignmentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='referred_user.user.full_name', read_only=True)
    user_email = serializers.CharField(source='referred_user.user.email', read_only=True)
    
    class Meta:
        model = CaseAssignment
        fields = [
            'id', 'referred_user', 'user_name', 'user_email', 'agency',
            'case_id', 'assigned_date', 'court_date', 'compliance_status',
            'notes', 'created_at'
        ]
        read_only_fields = ['id', 'agency', 'assigned_date', 'created_at']


class ComplianceTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceTimeline
        fields = [
            'id', 'case_assignment', 'event_type', 'description',
            'event_date', 'created_by'
        ]
        read_only_fields = ['id', 'event_date']


class ProgressReportSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='case_assignment.referred_user.user.full_name', read_only=True)
    
    class Meta:
        model = ProgressReport
        fields = [
            'id', 'case_assignment', 'user_name', 'report_format',
            'file_url', 'generated_by', 'generated_at', 'start_date', 'end_date'
        ]
        read_only_fields = ['id', 'generated_by', 'generated_at']


class AuditLogSerializer(serializers.ModelSerializer):
    admin_name = serializers.CharField(source='admin_user.full_name', read_only=True)
    target_name = serializers.CharField(source='target_user.full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'admin_user', 'admin_name', 'action', 'target_user',
            'target_name', 'details', 'ip_address', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


class UserRosterSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    email = serializers.CharField()
    case_id = serializers.CharField()
    quiz_status = serializers.BooleanField()
    resume_status = serializers.CharField()
    job_applications_count = serializers.IntegerField()
    training_courses_count = serializers.IntegerField()
    certificate_status = serializers.CharField()
    compliance_status = serializers.CharField()


class AgencyDashboardSerializer(serializers.Serializer):
    total_assigned_users = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    completed = serializers.IntegerField()
    non_compliant = serializers.IntegerField()
    quiz_completed_count = serializers.IntegerField()
    resume_completed_count = serializers.IntegerField()
