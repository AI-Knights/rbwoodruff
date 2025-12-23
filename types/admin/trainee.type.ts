export interface TraineeEnrollment {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  program_id: string;
  program_name: string;
  program_category: string;
  provider_name: string;
  enrollment_status: 'enrolled' | 'in_progress' | 'completed' | 'All';
  progress_percentage: number;
  start_date: string; // YYYY-MM-DD
  completion_date: string | null;
  certificate_status: 'not_uploaded' | 'uploaded' | 'issued'; // inferred
  certificate_uploaded_at: string | null;
  has_resume: boolean;
  resume_url: string | null;
}

export interface TraineeEnrollmentsResponse {
  count: number;
  results: TraineeEnrollment[];
}