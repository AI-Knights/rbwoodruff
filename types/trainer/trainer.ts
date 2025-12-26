export interface ITrainer {
  total_learners: string;
  active_learners: string;
  completed_learners: string;
  pending_enrollments: string;
  average_completion_rate: string,
  pending_certificate_verifications: string

}

export interface Course {
  id: string;
  name: string;
  description: string;
  category: string; // UUID of the category
  external_link: string;
  duration: number;
  duration_unit: string; // e.g., "hours", "days", etc.
  deadline: string; // ISO date string, e.g., "2025-06-30"
  is_active: boolean;
  created_at: string; // ISO datetime string
  learner_count: number;
}

export interface CourseListResponse {
  count: number;
  next: string | null; // URL to next page, or null if no next page
  previous: string | null; // URL to previous page, or null if no previous page
  results: Course[];
}

// Interface for a single enrollment/learner record
export interface LearnerEnrollmentData {
  id: string;
  user: string; // UUID of the user (likely the trainer or admin reference)
  learner_name: string;
  learner_email: string;
  program: string; // UUID of the program/course
  program_name: string;
  status: "enrolled" | "in_progress" | "completed" | "dropped"; // extend as needed
  progress_percentage: number; // 0 to 100
  start_date: string; // YYYY-MM-DD format
  completion_date: string | null; // YYYY-MM-DD or null
  has_certificate: boolean;
  created_at?: string; // optional, if added later
  updated_at?: string; // optional
}

// Interface for the paginated API response
export interface LearnerEnrollmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LearnerEnrollmentData[];
}

export interface LearnerEnrollment {
  id: string;
  learner_name: string;
  learner_email: string;
  program_name: string;
  start_date: string;
  status: string;
  resume_url? : string ;
  has_certificate: boolean;
  progress_percentage: number;
  completion_date: string | null;
}

// Interface for a single program summary
export interface ProgramLearnerSummary {
  program_name: string;
  total_learners: number;
  active: number;
  completed: number;
}

// Interface for a single completion rate record
export interface ProgramCompletionRate {
  program_name: string;
  completion_rate: number; // Likely a percentage (0–100)
}

// Main response interface
export interface DashboardStatsResponse {
  learners_by_program: ProgramLearnerSummary[];
  completion_rates: ProgramCompletionRate[];
}

// Interface for creating a new training/program (request body)
export interface CreateTrainingRequest {
  name: string;
  description: string;
  category: string; // UUID of the category
  external_link: string;
  deadline: string; // ISO date string, e.g., "2025-06-30"
  duration: number;
  duration_unit: string; // e.g., "hours", "days", "weeks"
  is_active: boolean;
}

// Interface for the full training/program object returned by the API
export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  category: string; // UUID
  external_link: string;
  duration: number;
  duration_unit: string;
  deadline: string; // "YYYY-MM-DD"
  is_active: boolean;
  created_at: string; // ISO datetime string
  learner_count: number;
}

// Interface for a single category
export interface Category {
  id: string; // UUID
  name: string;
  slug: string;
  description: string;
}

// Interface for the paginated list response
export interface CategoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface TrainingProviderProfile {
  specialization: string;
  experience: string;
  status: "verified" | "pending" | "rejected";
  total_learners: number;
}

export interface User {
  id: string; // UUID
  email: string;
  full_name: string;
  user_type: "training_provider" | "learner" | "admin";
  profile_pic: string | null;
  date_joined: string; // ISO date string
  has_paid: boolean | null;
  profile_data: TrainingProviderProfile;
}

