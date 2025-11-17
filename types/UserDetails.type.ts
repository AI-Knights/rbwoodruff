// src/types/UserDetails.type.ts
export type UserDetails = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  caseId: string;
  email: string;
  phone: string;

  // Overview
  complianceCompletion: number; // 0-100
  complianceStatus: "On-track" | "Delayed" | "Non-Compliant";
  quizStatus: "Complete" | "Pending" | "Not Started";
  resumeStatus: "Completed" | "In Progress" | "Not Started";
  jobApplications: number;
  trainingCourses: number;

  // Timeline
  timeline: {
    date: string;
    event: string;
    type: "milestone" | "court";
  }[];

  // Resume
  resumeSections: {
    title: string;
    status: "Completed";
  }[];

  // Activity
  totalApplications: number;
  coursesEnrolled: number;

  // Certificates
  certificateStatus: "Verified" | "Pending" | "None";
  documents: {
    name: string;
    icon: string;
  }[];
};