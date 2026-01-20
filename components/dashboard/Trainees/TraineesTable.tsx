"use client"
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
import { Eye, Ban, CheckCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Trainee } from '@/types/Trainees.type';
import { trainees } from '@/data/Trainees.data';



const TraineesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Users');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployer, setSelectedEmployer] = useState<Trainee | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const itemsPerPage = 15;

  const filteredEmployers = trainees.filter(trainees => {
    const matchesSearch = trainees.enrolledProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainees.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All Users' || trainees.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredEmployers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployers = filteredEmployers.slice(startIndex, startIndex + itemsPerPage);

  const handleViewProfile = (trainee: Trainee) => {
    setSelectedEmployer(trainee);
    setShowProfileDialog(true);
  };

  const handleSuspendClick = (trainee: Trainee) => {
    setSelectedEmployer(trainee);
    setShowSuspendDialog(true);
  };

  const handleApproveClick = (trainee: Trainee) => {
    setSelectedEmployer(trainee);
    setShowApproveDialog(true);
  };

  const handleSuspendConfirm = () => {
    console.log('Suspending employer:', selectedEmployer);
    setShowSuspendDialog(false);
  };

  const handleApproveConfirm = () => {
    console.log('Approving employer:', selectedEmployer);
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
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Enrolled Program</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedEmployers.map((employer) => (
                <TableRow key={employer.id}>
                  <TableCell className="font-medium">{employer.id}</TableCell>
                  <TableCell>{employer.fullName}</TableCell>
                  <TableCell>{employer.enrolledProgram}</TableCell>
                  <TableCell>{employer.progress}%</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${employer.certificate === "Issued"
                        ? "bg-green-100 text-green-800"
                        : "bg-violet-100 text-violet-800"
                        }`}
                    >
                      {employer.certificate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${employer.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-violet-100 text-violet-800"
                        }`}
                    >
                      {employer.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(employer)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Resume
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSuspendClick(employer)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Ban className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleApproveClick(employer)}
                        className="text-green-500 hover:text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {paginatedEmployers.length === 0 && (
              <TableCaption>No trainees found.</TableCaption>
            )}
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedEmployers.map((employer, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">ID: {employer.id}</p>
                    <h3 className="font-semibold text-lg">{employer.fullName}</h3>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                    {employer.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Enrolled Program</p>
                    <p className="font-medium">{employer.enrolledProgram}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Progress</p>
                    <p className="font-medium">{employer.progress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(employer)}
                    className="gap-2 flex-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSuspendClick(employer)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleApproveClick(employer)}
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployers.length)} of {filteredEmployers.length}
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

        {/* Profile Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between pb-4">
              <DialogTitle className="text-xl font-semibold">Employer Profile</DialogTitle>
            </DialogHeader>
            {selectedEmployer && (
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-semibold">{selectedEmployer.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Enrolled Program</p>
                  <p className="font-semibold">{selectedEmployer.enrolledProgram}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold">{selectedEmployer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    {selectedEmployer.status}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Ban Alert Dialog */}
        <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Ban Employer</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to ban {selectedEmployer?.fullName}?
                <br />
                They will not be able to post jobs or access their account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSuspendConfirm}
                className="bg-black text-white hover:bg-gray-800"
              >
                Confirm Ban
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Approve Alert Dialog */}
        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Approve Employer</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to Approve {selectedEmployer?.fullName}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApproveConfirm}
                className="bg-black text-white hover:bg-gray-800"
              >
                Confirm Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default TraineesTable;