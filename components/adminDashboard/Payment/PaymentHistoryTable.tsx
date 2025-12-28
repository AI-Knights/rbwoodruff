"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Payment } from "@/types/admin/payment.type";
import { generateReceiptPDF } from "@/components/elements/ReceiptPDF";
import { useGetPaymentsQuery } from "@/store/api/adminSlice/PaymentSlice";

const ITEMS_PER_PAGE = 10;

const PaymentHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "canceled">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const { data, isLoading, isFetching, error } = useGetPaymentsQuery();

  const allPayments = data?.results ?? [];

  // Client-side filtering
  const filteredPayments = allPayments.filter((payment) => {
    // Search filter
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.receipt_number &&
        payment.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDialog(true);
  };

  const handleDownloadReceipt = (payment: Payment) => {
    try {
      generateReceiptPDF(payment);
      toast.success("Receipt downloaded successfully");
    } catch {
      toast.error("Failed to generate receipt");
    }
  };

  const formatDate = (iso: string) =>
    format(new Date(iso), "dd MMM, yyyy HH:mm:ss");

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "bg-green-100 text-green-800 border-green-300", label: "Success" };
      case "canceled":
        return { color: "bg-red-100 text-red-800 border-red-300", label: "Canceled" };
      default:
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Pending" };
    }
  };

  // Reset page when filters change
  const resetPage = () => setCurrentPage(1);

  if (isLoading) return <div className="text-center py-10">Loading payments...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load payments</div>;

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as typeof statusFilter);
              resetPage();
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, ID or receipt"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                resetPage();
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Receipt Number</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => {
                const statusConfig = getStatusConfig(payment.status);
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{payment.receipt_number || "-"}</TableCell>
                    <TableCell className="font-semibold">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">{payment.payment_method}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(payment.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(payment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {payment.receipt_number && (
                        <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(payment)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedPayments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            return (
              <Card key={payment.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{payment.id.slice(0, 8)}...</p>
                      <p className="text-xs text-gray-500">Case: {payment.case_id || "-"}</p>
                    </div>
                    <Badge variant="outline" className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-semibold">${parseFloat(payment.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method</span>
                      <span className="capitalize">{payment.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span>{formatDate(payment.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(payment)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {payment.receipt_number && (
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(payment)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages || 1} ({filteredPayments.length} filtered)
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Details Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl w-full max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center justify-between">
                Transaction Details
                {selectedPayment && (
                  <Badge className={getStatusConfig(selectedPayment.status).color}>
                    {getStatusConfig(selectedPayment.status).label}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedPayment && (
              <div className="space-y-8 py-4">
                <div className="text-sm">
                  <span className="text-gray-600">Transaction ID</span>
                  <p className="font-semibold text-lg break-all">{selectedPayment.id}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">User Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-600">Name</p><p className="font-medium">{selectedPayment.user_name}</p></div>
                    <div><p className="text-gray-600">Email</p><p className="font-medium">{selectedPayment.user_email}</p></div>
                    <div><p className="text-gray-600">Receipt Number</p><p className="font-medium">{selectedPayment.receipt_number || "-"}</p></div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div><p className="text-gray-600">Amount</p><p className="font-bold text-xl">${parseFloat(selectedPayment.amount).toFixed(2)}</p></div>
                    <div><p className="text-gray-600">Currency</p><p className="font-medium uppercase">{selectedPayment.currency}</p></div>
                    <div><p className="text-gray-600">Payment Method</p><p className="font-medium capitalize">{selectedPayment.payment_method}</p></div>
                    <div><p className="text-gray-600">Date & Time</p><p className="font-medium">{formatDate(selectedPayment.created_at)}</p></div>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                  className="w-full bg-black hover:bg-gray-900 text-white"
                  disabled={!selectedPayment.receipt_number}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;