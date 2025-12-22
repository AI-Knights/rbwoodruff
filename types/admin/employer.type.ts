export interface Employer {
  id: string;
  user: string;
  user_email: string;
  company_name: string;
  industry: string;
  office_location: string;
  is_verified: 'verified' | 'pending' | 'banned';
  total_jobs: number;
  created_at: string;
}

export interface EmployersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Employer[];
}

export interface VerifyEmployerResponse {
  message: string;
}