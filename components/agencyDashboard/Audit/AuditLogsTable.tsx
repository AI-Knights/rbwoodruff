"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Upload, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useGetCourtDatesQuery, useUpdateCourtDateStatusMutation, useUploadCourtDatesCsvMutation } from "@/store/api/agencySlice/courtDateApiSlice";
import type { CourtDate, ComplianceStatus } from "@/types/agency/courtDate.type";

const ITEMS_PER_PAGE = 10;

export default function CourtDatesManagementTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState<CourtDate | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openCsvDialog, setOpenCsvDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplianceStatus>("on_track");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: courtDates = [], isLoading, isError, refetch } = useGetCourtDatesQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateCourtDateStatusMutation();
  const [uploadCsv, { isLoading: isUploading }] = useUploadCourtDatesCsvMutation();

  const totalPages = Math.ceil(courtDates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDates = courtDates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleStatusChange = async () => {
    if (!selectedCase) return;
    try {
      await updateStatus({ id: selectedCase.id, status: newStatus }).unwrap();
      toast.success("Compliance status updated");
      setOpenStatusDialog(false);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Download CSV Template
  const handleCsvDownload = () => {
    const csvContent = [
      "case_id,court_date", 
      ",",
      ",",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "court_dates_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV template downloaded");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadCsv(formData).unwrap();
      toast.success(
        `${response.successful_matches} cases uploaded successfully${
          response.failed_matches > 0 ? ` (${response.failed_matches} failed)` : ""
        }`
      );
      refetch();
      setOpenCsvDialog(false);
    } catch (err: any) {
      toast.error(err?.data?.detail || "Upload failed");
    }
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case "on_track":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-yellow-100 text-yellow-800";
      case "non_compliant":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading court dates...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Failed to load court dates</div>;

  return (
    <div className="w-full min-h-[calc(100vh-170px)] p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Court Dates Management</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage all agency court dates
            </p>
          </div>

          <Dialog open={openCsvDialog} onOpenChange={setOpenCsvDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Upload Court Dates</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button onClick={handleCsvDownload} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag & drop your updated CSV file here
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Browse Files"}
                  </Button>
                </div>

                <Button
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Processing..." : "Upload File"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Only CSV files with Case ID and Court Date columns are accepted
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Rest of the table remains the same */}
        <div className="bg-white rounded-lg shadow">
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Court Name</TableHead>
                  <TableHead>Court Date</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDates.map((c, index) => (
                  <TableRow key={c.id}>
                    <TableCell>{index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</TableCell>
                    <TableCell className="font-medium">{c.user_name}</TableCell>
                    <TableCell>{c.user_email}</TableCell>
                    <TableCell>{c.case_id}</TableCell>
                    <TableCell>{c.court_name}</TableCell>
                    <TableCell>{format(new Date(c.court_date), "dd MMM yyyy")}</TableCell>
                    <TableCell>{format(new Date(c.assigned_date), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(c.compliance_status)}>
                        {c.compliance_status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCase(c);
                          setNewStatus(c.compliance_status);
                          setOpenStatusDialog(true);
                        }}
                      >
                        Change Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4 p-4">
            {paginatedDates.map((c, index) => (
              <Card key={c.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{c.user_name}</h3>
                      <p className="text-sm text-gray-600">{c.user_email}</p>
                      <p className="text-sm text-gray-500">Case: {c.case_id}</p>
                    </div>
                    <Badge className={getStatusBadge(c.compliance_status)}>
                      {c.compliance_status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Court</span>
                    <span>{c.court_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Court Date</span>
                    <span>{format(new Date(c.court_date), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned</span>
                    <span>{format(new Date(c.assigned_date), "dd MMM yyyy")}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => {
                      setSelectedCase(c);
                      setNewStatus(c.compliance_status);
                      setOpenStatusDialog(true);
                    }}
                  >
                    Change Status
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 py-4 border-t">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Dialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Compliance Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Update status for <strong>{selectedCase?.user_name}</strong> ({selectedCase?.case_id})
              </p>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ComplianceStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenStatusDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusChange} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}