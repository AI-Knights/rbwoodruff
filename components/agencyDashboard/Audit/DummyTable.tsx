"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Upload, Plus, Download } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addCaseSchema, AddCaseFormData } from "@/schema/agency/case.schema";
import * as XLSX from "xlsx"; // Install: npm install xlsx

type CaseStatus = "on_track" | "delayed" | "non_compliant" | "closed";

interface Case {
  id: string;
  user_name: string;
  case_id: string;
  date: string;
  status: CaseStatus;
}

const ITEMS_PER_PAGE = 10;

const dummyCases: Case[] = [
  { id: "1", user_name: "Sabbir Molla", case_id: "CASE-2025-001", date: "2025-01-15", status: "on_track" },
  { id: "2", user_name: "John Doe", case_id: "CASE-2025-002", date: "2025-02-20", status: "delayed" },
  { id: "3", user_name: "Jane Smith", case_id: "CASE-2025-003", date: "2025-03-10", status: "on_track" },
  { id: "4", user_name: "Michael Brown", case_id: "CASE-2025-004", date: "2025-04-05", status: "non_compliant" },
  { id: "5", user_name: "Emily Davis", case_id: "CASE-2025-005", date: "2025-05-12", status: "closed" },
  { id: "6", user_name: "Chris Wilson", case_id: "CASE-2025-006", date: "2025-06-18", status: "on_track" },
  { id: "7", user_name: "Sarah Taylor", case_id: "CASE-2025-007", date: "2025-07-22", status: "delayed" },
  { id: "8", user_name: "David Lee", case_id: "CASE-2025-008", date: "2025-08-30", status: "on_track" },
  { id: "9", user_name: "Lisa Anderson", case_id: "CASE-2025-009", date: "2025-09-14", status: "non_compliant" },
  { id: "10", user_name: "Robert Martinez", case_id: "CASE-2025-010", date: "2025-10-01", status: "closed" },
  { id: "11", user_name: "Anna Thomas", case_id: "CASE-2025-011", date: "2025-11-05", status: "on_track" },
  { id: "12", user_name: "James White", case_id: "CASE-2025-012", date: "2025-12-10", status: "delayed" },
];

export default function CaseManagementTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openAddCaseDialog, setOpenAddCaseDialog] = useState(false);
  const [openCsvDialog, setOpenCsvDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<CaseStatus>("on_track");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cases = dummyCases;

  const totalPages = Math.ceil(cases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCases = cases.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AddCaseFormData>({
    resolver: zodResolver(addCaseSchema),
  });

  const selectedDate = watch("date");

  const handleStatusChange = async () => {
    if (!selectedCase) return;
    toast.success(`Status updated to ${newStatus.replace("_", " ").toUpperCase()}`);
    setOpenStatusDialog(false);
  };

  const onAddCaseSubmit = (data: AddCaseFormData) => {
    console.log("New case:", data);
    toast.success("Case added successfully (demo)");
    reset();
    setOpenAddCaseDialog(false);
  };

  // Download Excel template with 2 columns: Case ID and Case Date
  const handleCsvDownload = () => {
    const worksheetData = [
      ["Case ID", "Case Date"], // Header
      ["CASE-2025-XXX", "2025-01-01"], // Example row
      ["", ""], // Empty row for user input
      ["", ""],
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cases");

    // Auto-size columns
    ws["!cols"] = [{ wch: 20 }, { wch: 15 }];

    XLSX.writeFile(wb, "case_template.xlsx");
    toast.success("Excel template downloaded");
  };

  // Trigger file picker
  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection (demo only)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Selected: ${file.name} (demo upload)`);
      // TODO: Parse and process file when backend is ready
    }
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case "on_track":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-yellow-100 text-yellow-800";
      case "non_compliant":
        return "bg-red-100 text-red-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-170px)] p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Case Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage and track all user cases
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={openAddCaseDialog} onOpenChange={setOpenAddCaseDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Case
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Case</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onAddCaseSubmit)} className="space-y-4">
                  <div>
                    <Label>Case ID</Label>
                    <Input {...register("case_id")} placeholder="e.g., CASE-2025-001" />
                    {errors.case_id && <p className="text-sm text-red-600">{errors.case_id.message}</p>}
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => setValue("date", date!)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Case</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={openCsvDialog} onOpenChange={setOpenCsvDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Bulk Upload Cases</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Button onClick={handleCsvDownload} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Excel Template
                  </Button>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Drag & drop your updated Excel/CSV file here
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button variant="outline" className="mt-4" onClick={handleBrowseFiles}>
                      Browse Files
                    </Button>
                  </div>

                  <Button className="w-full" disabled>
                    Upload File
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Upload the filled template to bulk update cases
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Rest of the component remains unchanged */}
        <div className="bg-white rounded-lg shadow">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCases.map((c, index) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}
                    </TableCell>
                    <TableCell className="font-medium">{c.user_name}</TableCell>
                    <TableCell>{c.case_id}</TableCell>
                    <TableCell>{format(new Date(c.date), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(c.status)}>
                        {c.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCase(c);
                          setNewStatus(c.status);
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {paginatedCases.map((c, index) => (
              <Card key={c.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{c.user_name}</h3>
                      <p className="text-sm text-gray-600">Case: {c.case_id}</p>
                    </div>
                    <Badge className={getStatusBadge(c.status)}>
                      {c.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Date: {format(new Date(c.date), "dd MMM yyyy")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedCase(c);
                      setNewStatus(c.status);
                      setOpenStatusDialog(true);
                    }}
                  >
                    Change Status
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
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

        {/* Status Change Dialog */}
        <Dialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Case Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Change status for <strong>{selectedCase?.user_name}</strong> (Case: {selectedCase?.case_id})
              </p>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as CaseStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenStatusDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusChange}>Update Status</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}