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
  ChevronDownIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useGetPaymentsQuery } from "@/store/api/adminSlice/PaymentSlice";
import { Payment } from "@/types/admin/payment.type";
import { generateReceiptPDF } from "@/components/elements/ReceiptPDF";

const itemsPerPage = 10;

const PaymentHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const { data, isLoading, isFetching } = useGetPaymentsQuery();

  const payments = data?.results ?? [];

  // Client-side filtering
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.receipt_number &&
        payment.receipt_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const paymentDate = new Date(payment.created_at);
    const matchesDate =
      !selectedDate ||
      paymentDate.toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDialog(true);
  };

  const formatDate = (iso: string) =>
    format(new Date(iso), "dd MMM, yyyy HH:mm:ss");

  if (isLoading)
    return <div className="text-center py-10">Loading payments...</div>;

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48 justify-between font-normal"
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : "Select date"}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setOpenCalendar(false);
                  setCurrentPage(1);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, ID or receipt"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
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
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{payment.receipt_number || "-"}</TableCell>
                  <TableCell className="font-semibold">
                    ${parseFloat(payment.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {payment.payment_method}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(payment.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        payment.status === "succeeded"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-yellow-100 text-yellow-800 border-yellow-300"
                      }
                    >
                      {payment.status === "succeeded" ? "Success" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(payment)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedPayments.map((payment) => (
            <Card key={payment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">
                      {payment.id.slice(0, 8)}...
                    </p>
                    <p className="text-xs text-gray-500">
                      Case: {payment.case_id || "-"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      payment.status === "succeeded"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {payment.status === "succeeded" ? "Success" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </span>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => handleViewDetails(payment)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages || 1, prev + 1))
            }
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
                  <Badge
                    className={
                      selectedPayment.status === "succeeded"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {selectedPayment.status === "succeeded"
                      ? "Success"
                      : "Pending"}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedPayment && (
              <div className="space-y-8 py-4">
                <div className="text-sm">
                  <span className="text-gray-600">Transaction ID</span>
                  <p className="font-semibold text-lg">{selectedPayment.id}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{selectedPayment.user_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedPayment.user_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Receipt Number</p>
                      <p className="font-medium">
                        {selectedPayment.receipt_number || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-bold text-xl">
                        ${parseFloat(selectedPayment.amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Currency</p>
                      <p className="font-medium uppercase">
                        {selectedPayment.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">
                        {selectedPayment.payment_method}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Receipt Number</p>
                      <p className="font-medium">
                        {selectedPayment.receipt_number || "-"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Date & Time</p>
                      <p className="font-medium">
                        {formatDate(selectedPayment.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    selectedPayment && generateReceiptPDF(selectedPayment)
                  }
                  className="w-full bg-black hover:bg-gray-900 text-white"
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
