export type UserType = "general" | "agency_referred";

export interface JobSeeker {
  id: string;
  email: string;
  full_name: string;
  user_type: UserType;
  is_active: boolean;
  date_joined: string;
  resume_completeness: number;
  resume_pdf_url: string | null;
}

export interface JobSeekersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobSeeker[];
}