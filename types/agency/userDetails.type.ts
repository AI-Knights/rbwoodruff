export interface UserDetailsResponse {
  case_details: {
    id: string;
    referred_user: string;
    user_name: string;
    user_email: string;
    agency: string;
    case_id: string;
    assigned_date: string;
    court_date: string;
    compliance_status: string;
    notes: string;
    created_at: string;
  };
  timeline: Array<{
    id: string;
    case_assignment: string;
    event_type: string;
    description: string;
    event_date: string;
    created_by: string;
  }>;
  resume: {
    contact_info: boolean;
    work_experience: boolean;
    skills: boolean;
    resume_completeness: number;
  };
  applications_count: number;
  enrollments_count: number;
}