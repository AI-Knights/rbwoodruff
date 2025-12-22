
export type User = {
  id: string;
  name: string;
  caseId: string;
  quiz: "Yes" | "No";
  resume: "Completed" | "In Progress" | "Not Started";
  jobApplications: number;
  courses: number;
  certificate: "Verified" | "Pending" | "None";
  compliance: "On-track" | "Delayed" | "Non-Compliant";
};