export interface Trainer {
  id: string;
  user: string;
  user_email: string;
  trainer_name: string;
  specialization: string;
  experience: string;
  status: 'pending' | 'verified' | 'banned';
  total_learners: number;
  average_completion_rate: string;
  total_programs: number;
  created_at: string;
}

export interface TrainersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Trainer[];
}

export interface UpdateTrainerStatusResponse {
  message: string; // e.g., "Trainer verified successfully"
}