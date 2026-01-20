"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import JobEditForm from "./JobEditForm";
import { Job } from "@/types/employer/job.type";
import {
  useDeleteJobMutation,
  useGetJobsQuery,
} from "@/store/api/employerSlice/JobSlice";

export default function JobManagementTable() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  /* State for sorting configuration */
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  /* State for pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const { data, isLoading } = useGetJobsQuery();
  const [deleteJob, { isLoading: deleting }] = useDeleteJobMutation();

  const jobs = data ?? [];

  const sortedJobs = useMemo(() => {
    if (!sortConfig) return jobs;

    return [...jobs].sort((a, b) => {
      // Current implementation only supports sorting by applicant_count
      const aValue = sortConfig.key === "applicant_count" ? a.applicant_count : 0;
      const bValue = sortConfig.key === "applicant_count" ? b.applicant_count : 0;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [jobs, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedJobs, currentPage]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleView = (jobId: string) => {
    router.push(`/employer-dashboard/manage-jobs/${jobId}`);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsEditOpen(true);
  };

  const handleDeleteOpen = (job: Job) => {
    setSelectedJob(job);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedJob) return;
    try {
      await deleteJob(selectedJob.id).unwrap();
      toast.success("Job deleted successfully");
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete job");
    }
  };

  const handleUpdateSuccess = () => {
    // toast.success(`Job "${selectedJob?.title}" updated successfully`);
    setIsEditOpen(false);
  };

  if (isLoading)
    return <div className="text-center py-10">Loading jobs...</div>;

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-[1920px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Job Listings</h2>
          <Badge variant="secondary" className="text-sm">
            {sortedJobs.length} Total
          </Badge>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("applicant_count")}
                    className="hover:bg-transparent p-0 font-medium"
                  >
                    Applicants
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        job.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-medium">
                      {job.applicant_count}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(job.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(job.id)}
                      title="View Details"
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(job)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteOpen(job)}
                      title="Delete"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                  </div>
                  <Badge
                    className={
                      job.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      {job.applicant_count}
                    </span>
                    <span>Applicants</span>
                  </div>
                  <span className="text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleView(job.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(job)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteOpen(job)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, sortedJobs.length)} of {sortedJobs.length} jobs
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

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-5xl max-h-[97vh] overflow-y-auto p-0">
            <DialogHeader className="sticky top-0 bg-white z-10 border-b p-6">
              <DialogTitle className="text-2xl font-bold">Edit Job</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              {selectedJob && (
                <JobEditForm
                  initialData={selectedJob}
                  onSuccess={handleUpdateSuccess}
                  submitLabel="Update Job"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Job</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedJob?.title}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete Job"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
