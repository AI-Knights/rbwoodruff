from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField


User = get_user_model()


class GeneralUser(models.Model):
    """Profile for self-enrolled general job seekers"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='general_profile')
    phone_number = models.CharField(max_length=20)
    
    # Payment tracking
    has_paid = models.BooleanField(default=False)
    
    # Resume completeness
    resume_completeness = models.IntegerField(default=0, help_text="Resume completion percentage (0-100)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"General User: {self.user.full_name}"


class ReferredUser(models.Model):
    """Profile for agency-referred court users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referred_profile')
    phone_number = models.CharField(max_length=20)
    
    # Court information
    court_name = models.CharField(max_length=200)
    case_name = models.CharField(max_length=200)
    
    # Payment tracking
    has_paid = models.BooleanField(default=False)
    
    # Resume completeness
    resume_completeness = models.IntegerField(default=0, help_text="Resume completion percentage (0-100)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Referred User: {self.user.full_name} - {self.case_name}"


class Employer(models.Model):
    """Profile for employer accounts"""
    
    INDUSTRY_CHOICES = [
        ('healthcare', 'Healthcare'),
        ('technology', 'Technology'),
        ('construction', 'Construction'),
        ('retail', 'Retail'),
        ('hospitality', 'Hospitality'),
        ('manufacturing', 'Manufacturing'),
        ('education', 'Education'),
        ('finance', 'Finance'),
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    
    company_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, default='other')
    office_location = models.CharField(max_length=200)
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Employer: {self.company_name}"


class TrainingProvider(models.Model):
    """Profile for training provider accounts"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='trainer_profile')
    
    specialization = models.CharField(max_length=200)
    experience = models.CharField(max_length=200, help_text="Years of experience or description")
    skills = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    bio = models.TextField()
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    
    # Performance metrics (calculated fields)
    total_learners = models.IntegerField(default=0)
    average_completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Trainer: {self.user.full_name} - {self.specialization}"


class Agency(models.Model):
    """Profile for rehabilitation agency accounts"""
    
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='agency_profile')
    
    agency_id = models.CharField(max_length=100, unique=True)
    agency_name = models.CharField(max_length=200)
    representative_name = models.CharField(max_length=200, default='')
    address = models.CharField(max_length=300)
    
    # Verification documents (stored as Cloudinary URLs or file paths)
    verification_documents = models.JSONField(default=list, blank=True, help_text="URLs to court authorization and registration docs")
    
    # Approval workflow
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending')
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Agency: {self.agency_name}"


# Import all other models to make them available when importing from users.models
from .job_models import Job, JobApplication, Interview
from .training_models import TrainingProgram, Enrollment, Certificate
from .compliance_models import CaseAssignment, ComplianceTimeline, ProgressReport, AuditLog
from .profile_models import CareerQuiz, Resume, WorkExperience, Education, Skill, Document
from .payment_models import Payment, TransactionLog
from .additional_models import SavedJob, ContactMessage, EmployerTrainingLinkage


__all__ = [
    'GeneralUser', 'ReferredUser', 'Employer', 'TrainingProvider', 'Agency',
    'Job', 'JobApplication', 'Interview',
    'TrainingProgram', 'Enrollment', 'Certificate',
    'CaseAssignment', 'ComplianceTimeline', 'ProgressReport', 'AuditLog',
    'CareerQuiz', 'Resume', 'WorkExperience', 'Education', 'Skill', 'Document',
    'Payment', 'TransactionLog',
    'SavedJob', 'ContactMessage', 'EmployerTrainingLinkage',
]