export type CaseStatus = "on_track" | "delayed" | "non_compliant" | "closed";

export interface Case {
  id: string;
  user_name: string;
  case_id: string;
  date: string; // ISO date string
  status: CaseStatus;
}

export type CasesResponse = Case[];