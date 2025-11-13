
export interface Payment {
  transactionId: string;
  caseId: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: 'Success' | 'Pending';
  user: {
    name: string;
    email: string;
    caseId: string;
  };
  fees: number;
  total: number;
  statusLog: { message: string; timestamp: string }[];
};