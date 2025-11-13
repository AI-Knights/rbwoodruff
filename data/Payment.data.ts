import { Payment } from "@/types/payment.type";


export const payments: Payment[] = [
  {
    transactionId: "TXN-2025-001",
    caseId: "CR-2596",
    amount: 150.0,
    paymentMethod: "stripe",
    date: "2 March, 2025 10:21 PM",
    status: "Success",
    user: {
      name: "Sarah Johnson",
      email: "sarah.johnson@mail.com",
      caseId: "CR-20153",
    },
    fees: 0.0,
    total: 150.0,
    statusLog: [
      { message: "Payment Attempted", timestamp: "12 March, 2025 14:32:20" },
      { message: "Payment Confirmed", timestamp: "12 March, 2025 14:32:20" },
    ],
  },
  {
    transactionId: "TXN-2025-002",
    caseId: "CR-2596",
    amount: 150.0,
    paymentMethod: "stripe",
    date: "2 March, 2025 10:21 PM",
    status: "Pending",
    user: {
      name: "Michael Chen",
      email: "m.chen@example.com",
      caseId: "CR-20154",
    },
    fees: 0.0,
    total: 150.0,
    statusLog: [
      { message: "Payment Attempted", timestamp: "12 March, 2025 15:10:05" },
    ],
  },
  {
    transactionId: "TXN-2025-003",
    caseId: "CR-2596",
    amount: 150.0,
    paymentMethod: "stripe",
    date: "2 March, 2025 10:21 PM",
    status: "Pending",
    user: {
      name: "Emma Wilson",
      email: "emma.w@example.com",
      caseId: "CR-20155",
    },
    fees: 0.0,
    total: 150.0,
    statusLog: [
      { message: "Payment Attempted", timestamp: "12 March, 2025 16:05:12" },
    ],
  },
];
