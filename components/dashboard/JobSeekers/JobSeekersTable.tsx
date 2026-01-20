"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Ban, CheckCircle, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { jobSeekers } from '@/data/JobSeekters.data';
import { JobSeeker } from '@/types/JobSeekers.type';
import { toast } from 'sonner';

const JobSeekersTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Users');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobSeeker, setSelectedJobSeeker] = useState<JobSeeker | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const itemsPerPage = 15;

  const filteredJobSeekers = jobSeekers.filter(seeker => {
    const matchesSearch = seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seeker.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All Users' || seeker.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredJobSeekers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobSeekers = filteredJobSeekers.slice(startIndex, startIndex + itemsPerPage);

  const handleViewResume = () => {
    toast.success("Resume Downloaded")
  };

  const handleSuspendClick = (seeker: JobSeeker) => {
    setSelectedJobSeeker(seeker);
    setShowSuspendDialog(true);
  };

  const handleApproveClick = (seeker: JobSeeker) => {
    setSelectedJobSeeker(seeker);
    setShowApproveDialog(true);
  };

  const handleSuspendConfirm = () => {
    console.log('Suspending job seeker:', selectedJobSeeker);
    setShowSuspendDialog(false);
  };

  const handleApproveConfirm = () => {
    console.log('Approving job seeker:', selectedJobSeeker);
    setShowApproveDialog(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Users">All Users</SelectItem>
              <SelectItem value="Normal user">Normal user</SelectItem>
              <SelectItem value="Court referred">Court referred</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobSeekers.map((seeker) => (
                <TableRow key={`${seeker.id}-${seeker.name}`}>
                  <TableCell className="font-medium">{seeker.id}</TableCell>
                  <TableCell>{seeker.name}</TableCell>
                  <TableCell>{seeker.skills}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${seeker.status === 'Court referred'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {seeker.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewResume}
                        className="gap-2 text-xs"
                      >
                        <Download className="h-4 w-4" />
                        View Resume
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSuspendClick(seeker)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Ban className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleApproveClick(seeker)}
                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {paginatedJobSeekers.length === 0 && (
              <TableCaption>No job seekers found.</TableCaption>
            )}
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedJobSeekers.map((seeker) => (
            <Card key={`${seeker.id}-${seeker.name}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">ID: {seeker.id}</p>
                    <h3 className="font-semibold text-lg">{seeker.name}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${seeker.status === 'Court referred'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {seeker.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-500">Skills</p>
                  <p className="font-medium">{seeker.skills}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewResume}
                    className="gap-2 flex-1"
                  >
                    <Download className="h-4 w-4" />
                    View Resume
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSuspendClick(seeker)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleApproveClick(seeker)}
                    className="text-green-500 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 mt-4">
            <p className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredJobSeekers.length)} of {filteredJobSeekers.length}
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

        {/* Resume Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Job Seeker Resume</DialogTitle>
            </DialogHeader>
            {selectedJobSeeker && (
              <div className="space-y-4 pt-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-lg">{selectedJobSeeker.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skills</p>
                  <p className="font-medium">{selectedJobSeeker.skills}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${selectedJobSeeker.status === 'Court referred'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {selectedJobSeeker.status}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Suspend Dialog */}
        <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Suspend Job Seeker</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to suspend <strong>{selectedJobSeeker?.name}</strong>?
                <br />
                They will no longer be able to apply for jobs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSuspendConfirm} className="bg-red-600 hover:bg-red-700">
                Confirm Suspend
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Approve Dialog */}
        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Job Seeker</AlertDialogTitle>
              <AlertDialogDescription>
                Approve <strong>{selectedJobSeeker?.name}</strong> to actively seek jobs?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleApproveConfirm} className="bg-green-600 hover:bg-green-700">
                Confirm Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default JobSeekersTable;