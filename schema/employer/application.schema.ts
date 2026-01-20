import { z } from "zod";

export const applicationStatusSchema = z.object({
  status: z.enum(["shortlisted", "rejected", "hired", "interview_scheduled"]),
  employer_notes: z.string().optional(),
  // Hiring fields
  start_date: z.string().optional(),
  joining_time: z.string().optional(),
  hiring_notes: z.string().optional(),
  // Interview fields
  scheduled_date: z.string().optional(),
  scheduled_time: z.string().optional(),
  duration_minutes: z.number().optional(),
  meeting_link: z.string().optional(),
  location: z.string().optional(),
  interview_notes: z.string().optional(),
  interview_type: z.enum(["online", "offline"]).optional(),
}).superRefine((data, ctx) => {
  // Validate hiring fields when status is hired
  if (data.status === "hired" && !data.start_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start date is required when hiring",
      path: ["start_date"],
    });
  }

  // Validate interview fields when status is interview_scheduled
  if (data.status === "interview_scheduled") {
    if (!data.scheduled_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Scheduled date is required for interview",
        path: ["scheduled_date"],
      });
    }
    if (!data.scheduled_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Scheduled time is required for interview",
        path: ["scheduled_time"],
      });
    }
    if (data.interview_type === "online" && !data.meeting_link) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Meeting link is required for online interviews",
        path: ["meeting_link"],
      });
    }
  }
});

export type ApplicationStatus = z.infer<
  typeof applicationStatusSchema
>["status"];

export type ApplicationStatusFormValues = z.infer<
  typeof applicationStatusSchema
>;
