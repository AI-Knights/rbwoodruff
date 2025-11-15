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

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Payment } from "@/types/payment.type";
import { payments } from "@/data/Payment.data";

const PaymentHistoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const itemsPerPage = 10;

  const filteredPayments = payments.filter(
    (payment) =>
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDialog(true);
  };

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white max-w-[219px]"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.transactionId}>
                  <TableCell className="font-medium">
                    {payment.transactionId}
                  </TableCell>
                  <TableCell>{payment.caseId}</TableCell>
                  <TableCell className="font-semibold">
                    ${payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-600 capitalize font-black">
                      {payment.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {payment.date}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        payment.status === "Success"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-yellow-100 text-yellow-800 border-yellow-300"
                      }`}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(payment)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
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
            <Card key={payment.transactionId}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">
                      {payment.transactionId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Case: {payment.caseId}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      payment.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="text-blue-600 capitalize">
                      {payment.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span>{payment.date}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 gap-2"
                  onClick={() => handleViewDetails(payment)}
                >
                  <Eye className="h-4 w-4" />
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
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Transaction Details Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl w-full max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center justify-between">
                Transaction Details
                {selectedPayment && (
                  <Badge
                    className={`${
                      selectedPayment.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedPayment.status}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedPayment && (
              <div className="space-y-8 py-4">
                {/* Transaction ID */}
                <div className="text-sm">
                  <span className="text-gray-600">Transaction ID</span>
                  <p className="font-semibold text-lg">
                    {selectedPayment.transactionId}
                  </p>
                </div>

                {/* User Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{selectedPayment.user.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Case ID</p>
                      <p className="font-medium">
                        {selectedPayment.user.caseId}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">
                        {selectedPayment.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-bold text-xl">
                        ${selectedPayment.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fees</p>
                      <p className="font-bold text-xl">
                        ${selectedPayment.fees.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-bold text-xl">
                        ${selectedPayment.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-medium capitalize">
                        {selectedPayment.paymentMethod}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Date & Time</p>
                      <p className="font-medium">12 March, 2025 14:32:20</p>
                    </div>
                  </div>
                </div>

                {/* Status Log */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Status Log</h3>
                  <ul className="space-y-3">
                    {selectedPayment.statusLog.map((log, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-gray-400 mt-1">•</span>
                        <div>
                          <p className="font-medium">{log.message}</p>
                          <p className="text-xs text-gray-500">
                            {log.timestamp}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Download Button */}
                <Button className="w-full bg-black hover:bg-gray-900 text-white">
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
