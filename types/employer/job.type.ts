export interface Job {
  id: string;
  title: string;
  category: string; // category ID
  description: string;
  requirements: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  location: string;
  is_remote: boolean;
  salary_min: string;
  salary_max: string;
  skills_required: string[];
  number_of_openings: number;
  deadline: string; // YYYY-MM-DD
  status: 'active' | 'closed' | 'draft';
  created_at: string;
  applicant_count: number;
}

export interface JobsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Job[];
}