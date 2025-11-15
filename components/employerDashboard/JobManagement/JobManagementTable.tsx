"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit2, Eye, Settings } from "lucide-react";
import { toast } from "sonner";
import { Applicant, Job } from "@/types/job.type";
import { jobs } from "@/data/Job.Data";
import JobEditForm from "./JobEditForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const statusOptions = ["Shortlist", "Interview", "Reject", "Hired"];

export default function JobManagementTable() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [manageApplicant, setManageApplicant] = useState<Applicant | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsEditOpen(true);
  };

  const handleView = (jobId: string) => {
    router.push(`/employer-dashboard/manage-jobs/${jobId}`);
  };

  const handleManage = (applicant: Applicant) => {
    setManageApplicant(applicant);
    setManageOpen(true);
  };

  const handleUpdate = () => {
    toast.success(`Job "${selectedJob?.jobTitle}" updated!`);
    setIsEditOpen(false);
  };

  const handleStatusChange = (value: string) => {
    toast.success(`${manageApplicant?.name} status → ${value}`);
    setManageOpen(false);
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-[1920px] mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Job Listings</h2>

        {/* ---------- Desktop Table ---------- */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Applicants</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.jobTitle}</TableCell>
                  <TableCell>{job.jobCategory}</TableCell>
                  <TableCell>
                    <Badge className="bg-black text-white hover:bg-gray-800">
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-medium">
                      {job.applicantsCount}
                    </span>
                  </TableCell>
                  <TableCell>{job.postedDate}</TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(job.id)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(job)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ---------- Mobile Cards ---------- */}
        <div className="md:hidden space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                    <p className="text-sm text-gray-600">{job.jobCategory}</p>
                  </div>
                  <Badge className="bg-black text-white">{job.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      {job.applicantsCount}
                    </span>
                    <span>Applicants</span>
                  </div>
                  <span className="text-gray-500">{job.postedDate}</span>
                </div>
                <div className="mt-4 flex gap-2">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ---------- Edit Dialog ---------- */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-5xl max-h-[97vh] overflow-y-auto p-0">
            <DialogHeader className="sticky top-0 bg-white z-10 border-b p-6">
              <DialogTitle className="text-2xl font-bold">Edit Job</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              {selectedJob && (
                <JobEditForm
                  initialData={selectedJob}
                  onSuccess={handleUpdate}
                  submitLabel="Update Job"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* ---------- Manage Applicant Dialog ---------- */}
        <Dialog open={manageOpen} onOpenChange={setManageOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Manage Applicant
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Choose an action to update this applicant’s status or schedule next steps.
              </p>
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Shortlist" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end">
                <Button onClick={() => setManageOpen(false)}>Done</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}