export interface CreateJobBody {
  title: string;
  category: string; // category ID
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
    status: ApplicationStatus;
    cover_letter: string;
    applied_at: string; 
    employer_notes: string;
    resume_completeness: number; 
    resume_pdf_url: string | null;
    certifications: null| string;
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
  | "hired";

export interface UpdateApplicationStatusBody {
  id: string;
  status: ApplicationStatus;
}