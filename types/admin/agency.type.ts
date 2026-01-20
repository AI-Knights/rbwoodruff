export interface Agency {
  id: string;
  user: string;
  user_email: string;
  agency_id: string;
  agency_name: string;
  representative_name: string;
  address: string;
  verification_documents: string[];
  document_public_id: string;
  document_url: string;
  status: 'verified' | 'pending' | 'banned';
  created_at: string;
}