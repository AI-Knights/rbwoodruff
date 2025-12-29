import { UserDetails } from "@/types/UserDetails.type";

export const userDetails: UserDetails[] = [
  {
    id: "1",
    name: "John Doe",
    status: "Active",
    caseId: "CR-2025-1043",
    email: "referred_user@gmail.com",
    phone: "(555) 123-4569",

    complianceCompletion: 85,
    complianceStatus: "On-track",
    quizStatus: "Complete",
    resumeStatus: "Completed",
    jobApplications: 12,
    trainingCourses: 3,

    timeline: [
      { date: "1/15/2025", event: "Referral Received", type: "milestone" },
      { date: "", event: "Quiz Completed", type: "milestone" },
      { date: "", event: "Assessment passed", type: "milestone" },
      { date: "", event: "Resume Completed", type: "milestone" },
      { date: "", event: "Professional resume created", type: "milestone" },
      { date: "11/20/2025", event: "Court Date", type: "court" },
    ],

    resumeSections: [
      { title: "Contact Information", status: "Completed" },
      { title: "Work Experience", status: "Completed" },
      { title: "Skills", status: "Completed" },
    ],

    totalApplications: 0,
    coursesEnrolled: 0,

    certificateStatus: "Verified",
    documents: [
      { name: "Training Certificate", icon: "file-text" },
      { name: "Identification Document", icon: "file-text" },
    ],
  },
  // Add more users if needed...
];