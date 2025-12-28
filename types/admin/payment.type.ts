export type PaymentStatus = "pending" | "completed" | "canceled";

export interface Payment {
  id: string;
  user: string;
  user_email: string;
  user_name: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  receipt_number: string | null;
  case_id: string;
  created_at: string;
}

export interface PaymentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}