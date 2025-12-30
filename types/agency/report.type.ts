import { Applicant } from "../job.type";

interface UserInfo {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  date_joined: string;  
}

interface ReferredUserInfo {
  phone_number: string;
  court_name: string;
  case_id: string;
  has_paid: boolean;
  resume_completeness: number;
}

interface CaseAssignment {
  case_id: string;
  court_date: string;  
  compliance_status: string;
  assigned_date: string;  
  notes: string;
}

interface Resume {
  summary: string;
  phone: string;
  linkedin_url: string;
  portfolio_url: string;
  resume_pdf_url: string;
  completeness_percentage: number;
}

export interface SummaryStats {
  total_trainings: number;
  completed_trainings: number;
  total_certificates: number;
  verified_certificates: number;
  total_job_applications: number;
  total_skills: number;
}

export  interface ReportResponse {
  user_info: UserInfo;
  referred_user_info: ReferredUserInfo;
  case_assignment: CaseAssignment;
  career_quiz: null;  
  resume: Resume;
  skills: string[]; 
  work_experience: [];  
  education: [];  
  training_enrollments: [];  
  certificates: [];  
  job_applications:[];  
  summary_stats: SummaryStats;
}
