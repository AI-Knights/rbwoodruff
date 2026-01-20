export interface TopJob {
  job_id: string;
  job_title: string;
  applicant_count: number;
  job_status: string;
}

export interface EmployerDashboardStats {
  total_jobs_posted: number;
  active_jobs: number;
  total_applicants: number;
  applied_count: number;
  shortlisted_count: number;
  rejected_count: number;
  hired_candidates: number;
  pending_applications: number;
  top_jobs: TopJob[];
}

export type EmployerDashboardResponse = EmployerDashboardStats;