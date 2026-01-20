
// src/types/Job.type.ts
export interface Job {
  id: string;
  jobTitle: string;
  jobCategory: string;
  status: 'Active' | 'Closed';
  applicantsCount: number;
  postedDate: string;
  locationType: string;
  salaryMin: string;
  salaryMax: string;
  employmentType: string;
  requiredSkills: string;
  requirements: string;
  jobDescription: string;
  applicationDeadline: Date;
  numberOfOpenings: string;
  applicants: Applicant[];
};

export type Applicant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  certification: string;
  skills: string[];
  avatarUrl?: string;
};