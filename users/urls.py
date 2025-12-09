from django.urls import path
from .views import (
    # Dashboard
    DashboardView,
    
    # Jobs
    JobListView, JobDetailView, JobApplicationCreateView,
    JobApplicationListView, JobApplicationDetailView, InterviewListView,
    
    # Saved Jobs
    SavedJobCreateView, SavedJobListView, SavedJobDeleteView,
    
    # Training
    TrainingProgramListView, TrainingEnrollView, MyTrainingView,
    CertificateUploadView, CertificateListView,
    
    # Resume
    CareerQuizView, ResumeView, WorkExperienceView, WorkExperienceDetailView,
    EducationView, EducationDetailView, SkillView, SkillDetailView,
    ResumeParseView,
    
    # Documents
    DocumentUploadView, DocumentListView, DocumentDeleteView,
    
    # Contact
    ContactMessageView,
)


urlpatterns = [
    # Dashboard
    path('dashboard/', DashboardView.as_view(), name='user_dashboard'),
    
    # Jobs
    path('jobs/', JobListView.as_view(), name='job_list'),
    path('jobs/<uuid:pk>/', JobDetailView.as_view(), name='job_detail'),
    path('jobs/<uuid:job_id>/apply/', JobApplicationCreateView.as_view(), name='job_apply'),
    path('applications/', JobApplicationListView.as_view(), name='applications_list'),
    path('applications/<uuid:pk>/', JobApplicationDetailView.as_view(), name='application_detail'),
    path('interviews/', InterviewListView.as_view(), name='interviews'),
    
    # Saved Jobs
    path('jobs/<uuid:job_id>/save/', SavedJobCreateView.as_view(), name='save_job'),
    path('saved-jobs/', SavedJobListView.as_view(), name='saved_jobs'),
    path('saved-jobs/<uuid:pk>/delete/', SavedJobDeleteView.as_view(), name='delete_saved_job'),
    
    # Training
    path('training/', TrainingProgramListView.as_view(), name='training_list'),
    path('training/<uuid:program_id>/enroll/', TrainingEnrollView.as_view(), name='enroll'),
    path('my-training/', MyTrainingView.as_view(), name='my_training'),
    path('enrollments/<uuid:enrollment_id>/certificate/', CertificateUploadView.as_view(), name='upload_certificate'),
    path('certificates/', CertificateListView.as_view(), name='certificates'),
    
    # Resume & Profile
    path('career-quiz/', CareerQuizView.as_view(), name='career_quiz'),
    path('resume/', ResumeView.as_view(), name='resume'),
    path('resume/parse/', ResumeParseView.as_view(), name='resume_parse'),
    path('resume/work-experience/', WorkExperienceView.as_view(), name='work_experience'),
    path('resume/work-experience/<uuid:pk>/', WorkExperienceDetailView.as_view(), name='work_experience_detail'),
    path('resume/education/', EducationView.as_view(), name='education'),
    path('resume/education/<uuid:pk>/', EducationDetailView.as_view(), name='education_detail'),
    path('resume/skills/', SkillView.as_view(), name='skills'),
    path('resume/skills/<uuid:pk>/', SkillDetailView.as_view(), name='skill_detail'),
    
    # Documents
    path('documents/upload/', DocumentUploadView.as_view(), name='document_upload'),
    path('documents/', DocumentListView.as_view(), name='documents'),
    path('documents/<uuid:pk>/delete/', DocumentDeleteView.as_view(), name='document_delete'),
    
    # Contact
    path('contact/', ContactMessageView.as_view(), name='contact'),
]
