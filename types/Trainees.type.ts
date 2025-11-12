export interface Trainee {
  id: string;
  fullName: string;
  enrolledProgram: string;
  progress: number; // percentage (0–100)
  status: 'Applied' | 'Completed';
  certificate: "Issued" | "Not Issued"
  email: string;
}