export type ComplianceStatus = "on_track" | "delayed" | "non_compliant" | "completed" | "closed";

export interface CourtDate {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  case_id: string;
  referred_case_id: string;
  court_date: string; // YYYY-MM-DD
  compliance_status: ComplianceStatus;
  court_name: string;
  assigned_date: string; // YYYY-MM-DD
  notes: string;
}

export type CourtDatesResponse = CourtDate[];

export interface UploadCsvResponse {
  total_rows: number;
  successful_matches: number;
  failed_matches: number;
  failures: string[];
}