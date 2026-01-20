export interface Trainer {
  id: string;
  companyName: string;
  industry: string;
  activeJobs: number;
  status: 'Verified' | 'Pending' | 'Suspended';
  email: string;
}