export interface Payment {
  id: string;
  user: string;
  user_email: string;
  user_name: string;
  amount: string; // API returns string like "150.00"
  currency: string;
  status: 'succeeded' | 'pending'; // From your example; add more if needed later
  payment_method: string;
  receipt_number: string | null;
  case_id: string;
  created_at: string; // ISO datetime
}

export interface PaymentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Payment[];
}