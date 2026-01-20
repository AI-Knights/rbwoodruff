"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  Ban,
  CheckCircle,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { JobSeeker } from "@/types/admin/jobSeeker.type";
import { useGetJobSeekersQuery } from "@/store/api/adminSlice/jobSeekerApiSlice";

const ITEMS_PER_PAGE = 15;

const JobSeekersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "general" | "agency_referred">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState<JobSeeker | null>(null);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const { data, isLoading, isFetching, error } = useGetJobSeekersQuery();

  const allJobSeekers = data?.results ?? [];

  // Client-side filtering
  const filteredJobSeekers = allJobSeekers.filter((seeker) => {
    const matchesSearch =
      seeker.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = typeFilter === "all" || seeker.user_type === typeFilter;

    return matchesSearch && matchesFilter;
  });

  // Client-side pagination
  const totalPages = Math.ceil(filteredJobSeekers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobSeekers = filteredJobSeekers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleViewResume = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
      toast.success("Resume opened in new tab");
    } else {
      toast.info("No resume uploaded yet");
    }
  };


  const formatJoinDate = (iso: string) => format(new Date(iso), "dd MMM yyyy");

  const getUserTypeConfig = (type: string) => {
    switch (type) {
      case "agency_referred":
        return { color: "bg-purple-100 text-purple-800", label: "Agency Referred" };
      default:
        return { color: "bg-green-100 text-green-800", label: "General User" };
    }
  };

  const resetPage = () => setCurrentPage(1);

  if (isLoading) return <div className="text-center py-10">Loading job seekers...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Failed to load job seekers</div>;

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email or ID"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                resetPage();
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value as typeof typeFilter);
              resetPage();
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="general">General User</SelectItem>
              <SelectItem value="agency_referred">Agency Referred</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-5">Name</TableHead>
                <TableHead className="px-6 py-5">Email</TableHead>
                <TableHead className="px-6 py-5">Join Date</TableHead>
                <TableHead className="px-6 py-5">User Type</TableHead>
                <TableHead className="px-6 py-5 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobSeekers.map((seeker) => {
                const typeConfig = getUserTypeConfig(seeker.user_type);
                return (
                  <TableRow key={seeker.id}>
                    <TableCell className="px-6 py-6 font-medium">{seeker.full_name}</TableCell>
                    <TableCell className="px-6 py-6">{seeker.email}</TableCell>
                    <TableCell className="px-6 py-6">{formatJoinDate(seeker.date_joined)}</TableCell>
                    <TableCell className="px-6 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResume(seeker.resume_pdf_url)}
                          className="gap-2 text-xs"
                          disabled={!seeker.resume_pdf_url}
                        >
                          <Download className="h-4 w-4" />
                          View Resume
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {paginatedJobSeekers.length === 0 && (
              <TableCaption>No job seekers found.</TableCaption>
            )}
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedJobSeekers.map((seeker) => {
            const typeConfig = getUserTypeConfig(seeker.user_type);
            return (
              <Card key={seeker.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{seeker.full_name}</h3>
                      <p className="text-sm text-gray-600">{seeker.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="text-gray-500">Joined</p>
                    <p className="font-medium">{formatJoinDate(seeker.date_joined)}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResume(seeker.resume_pdf_url)}
                      className="gap-2 flex-1"
                      disabled={!seeker.resume_pdf_url}
                    >
                      <Download className="h-4 w-4" />
                      View Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 mt-4">
            <p className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredJobSeekers.length)} of {filteredJobSeekers.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3"
              >
                ← Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3"
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekersTable;