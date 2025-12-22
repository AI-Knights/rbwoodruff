export interface Agency {
  id: string;
  agencyId: string;
  name: string;
  representative: string;
  email: string;
  contact: string;
  registrationDate: string;
  status: "Approved" | "Pending";
  address: string;
  documents: {
    name: string;
    uploadedAt: string;
    url: string;
  }[];
}
