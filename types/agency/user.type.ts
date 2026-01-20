export interface AgencyUser {
  id: string;
  name: string;
  email: string;
  case_id: string;
  quiz_status: boolean;
  resume_status: string;
  job_applications_count: number;
  training_courses_count: number;
  certificate_status: string;
  compliance_status: string;
}

export type AgencyUsersResponse = AgencyUser[];