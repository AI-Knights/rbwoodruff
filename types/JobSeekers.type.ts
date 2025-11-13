export interface JobSeeker {
  id: string;
  name: string;
  skills: string;
  status: 'Normal user' | 'Court referred';
};