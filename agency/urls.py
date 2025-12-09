from django.urls import path
from .views import (
    AgencyDashboardView, UserRosterView, AssignCaseIDView,
    UserDetailView, UploadUserDocumentView, GenerateReportView,
    AuditLogListView
)


urlpatterns = [
    # Dashboard
    path('dashboard/', AgencyDashboardView.as_view(), name='agency_dashboard'),
    
    # User Roster
    path('users/', UserRosterView.as_view(), name='user_roster'),
    path('users/<uuid:user_id>/', UserDetailView.as_view(), name='user_detail'),
    path('users/<uuid:user_id>/assign-case/', AssignCaseIDView.as_view(), name='assign_case'),
    path('users/<uuid:user_id>/upload-document/', UploadUserDocumentView.as_view(), name='upload_user_document'),
    
    # Reports
    path('reports/generate/<str:case_id>/', GenerateReportView.as_view(), name='generate_report'),
    
    # Audit
    path('audit-logs/', AuditLogListView.as_view(), name='audit_logs'),
]
