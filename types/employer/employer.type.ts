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