import { z } from "zod";

export const addCourtDateSchema = z.object({
  case_id: z.string().min(1, "Case ID is required"),
  court_date: z.date().min( 1, "Court date is required"),
});

export type AddCourtDateFormData = z.infer<typeof addCourtDateSchema>;