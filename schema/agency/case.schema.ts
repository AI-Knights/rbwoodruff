import { z } from "zod";

export const addCaseSchema = z.object({
  case_id: z.string().min(1, "Case ID is required"),
  date: z.date().min(1, "Date is required"),
});

export type AddCaseFormData = z.infer<typeof addCaseSchema>;