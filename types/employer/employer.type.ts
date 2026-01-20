export interface CreateJobBody {
  title: string;
  category?: string | null; // category ID (optional if category_name provided)
  category_name?: string; // For bulk upload
  description: string;
  requirements: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  location: string;
  is_remote: boolean;
  salary_min: number;
  salary_max: number;
  skills_required: string[];
  deadline: string; // YYYY-MM-DD
  number_of_openings: number;
  status: 'active' | 'draft' | 'closed'; // assuming active by default
}

export interface CreateJobResponse {
  id: string;
  // ... other fields if returned
  message?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}


export interface PaginatedCategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}


export interface ApplicantForJob {
  id: string;
  job: string;
  job_title: string;
  job_category: string;
  job_location: string;
  applicant: string;
  applicant_name: string;
  applicant_email: string;
  profile_photo_url: string | null;
  status: ApplicationStatus;
  cover_letter: string;
  applied_at: string;
  employer_notes: string;
  resume_completeness: number;
  resume_pdf_url: string | null;
  certifications: null | string;
}
export interface ApplicantsForJobResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApplicantForJob[];
}


export type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "rejected"
  | "hired"
  | "interview_scheduled"
  | "offer_received";

export interface UpdateApplicationStatusBody {
  id: string;
  status: ApplicationStatus;
  employer_notes?: string;
  // Hiring fields (when status='hired')
  start_date?: string; // YYYY-MM-DD
  joining_time?: string; // HH:MM:SS
  hiring_notes?: string;
  // Interview fields (when status='interview_scheduled')
  scheduled_date?: string; // YYYY-MM-DD
  scheduled_time?: string; // HH:MM:SS
  duration_minutes?: number;
  meeting_link?: string;
  location?: string;
  interview_notes?: string;
}

export interface Interview {
  id: string;
  application_id: string;
  applicant_name: string;
  applicant_email: string;
  profile_photo_url: string | null;
  job_id: string;
  job_title: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  meeting_link: string;
  location: string;
  interview_type: 'online' | 'offline';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Interview[];
}

export interface HiredApplicant {
  id: string;
  applicant: string;
  applicant_name: string;
  applicant_email: string;
  profile_photo_url: string | null;
  job: string;
  job_id: string;
  job_title: string;
  job_location: string;
  employer_notes: string;
  hired_at: string;
  applied_at: string;
}

export interface HiredApplicantsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HiredApplicant[];
}