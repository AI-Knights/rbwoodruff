import { z } from "zod";

export const applicationStatusSchema = z.object({
  status: z.enum(["shortlisted", "rejected", "hired"]),
});

export type ApplicationStatus = z.infer<
  typeof applicationStatusSchema
>["status"];

export type ApplicationStatusFormValues = z.infer<
  typeof applicationStatusSchema
>;
