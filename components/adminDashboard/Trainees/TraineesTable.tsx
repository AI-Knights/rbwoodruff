'use client';

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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGetTraineeEnrollmentsQuery } from '@/store/api/adminSlice/TraineeSlice';
import { TraineeEnrollment } from '@/types/admin/trainee.type';

const itemsPerPage = 9;

const TraineesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'enrolled' | 'in_progress' | 'completed'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeEnrollment | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const { data, isLoading, isFetching } = useGetTraineeEnrollmentsQuery();

  const trainees = data?.results ?? [];

  // Client-side filtering
  const filteredTrainees = trainees.filter((trainee) => {
    const matchesSearch =
      trainee.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'All' || trainee.enrollment_status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTrainees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTrainees = filteredTrainees.slice(startIndex, startIndex + itemsPerPage);

  const handleViewProfile = (trainee: TraineeEnrollment) => {
    setSelectedTrainee(trainee);
    setShowProfileDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'enrolled':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCertificateBadge = (status: string) => {
    return status === 'not_uploaded'
      ? 'bg-gray-100 text-gray-800'
      : 'bg-green-100 text-green-800';
  };

  if (isLoading) return <div className="text-center py-10">Loading trainees...</div>;

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, program or ID"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enrolled Program</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Certificate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTrainees.map((trainee) => (
                <TableRow key={trainee.id}>
                  <TableCell className="font-medium">{trainee.id.slice(0, 8)}...</TableCell>
                  <TableCell>{trainee.user_name}</TableCell>
                  <TableCell>{trainee.user_email}</TableCell>
                  <TableCell>{trainee.program_name}</TableCell>
                  <TableCell>{trainee.provider_name}</TableCell>
                  <TableCell>{trainee.progress_percentage}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCertificateBadge(trainee.certificate_status)}>
                      {trainee.certificate_status.replace('_', ' ').charAt(0).toUpperCase() + trainee.certificate_status.slice(1).replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(trainee.enrollment_status)}>
                      {trainee.enrollment_status.charAt(0).toUpperCase() + trainee.enrollment_status.slice(1).replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" onClick={() => handleViewProfile(trainee)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedTrainees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No trainees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedTrainees.map((trainee) => (
            <Card key={trainee.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">ID: {trainee.id.slice(0, 8)}...</p>
                    <h3 className="font-semibold text-lg">{trainee.user_name}</h3>
                    <p className="text-sm text-gray-600">{trainee.user_email}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(trainee.enrollment_status)}>
                    {trainee.enrollment_status.charAt(0).toUpperCase() + trainee.enrollment_status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-500">Program</p>
                  <p className="font-medium">{trainee.program_name}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Provider</p>
                  <p className="font-medium">{trainee.provider_name}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Progress</p>
                  <p className="font-medium">{trainee.progress_percentage}%</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewProfile(trainee)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 pt-4">
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
            onClick={() => setCurrentPage((prev) => Math.min(totalPages || 1, prev + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Detailed Profile Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Trainee Details</DialogTitle>
            </DialogHeader>

            {selectedTrainee && (
              <div className="space-y-8 py-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Full Name</p>
                      <p className="font-medium text-lg">{selectedTrainee.user_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{selectedTrainee.user_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">User ID</p>
                      <p className="font-medium text-sm break-all">{selectedTrainee.user_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Enrollment ID</p>
                      <p className="font-medium text-sm break-all">{selectedTrainee.id}</p>
                    </div>
                  </div>
                </div>

                {/* Program Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Program Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Program Name</p>
                      <p className="font-medium text-lg">{selectedTrainee.program_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-medium">{selectedTrainee.program_category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Provider</p>
                      <p className="font-medium">{selectedTrainee.provider_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Program ID</p>
                      <p className="font-medium text-sm break-all">{selectedTrainee.program_id}</p>
                    </div>
                  </div>
                </div>

                {/* Progress & Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Progress & Certification</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Enrollment Status</p>
                      <Badge variant="outline" className={`text-lg py-2 px-4 ${getStatusColor(selectedTrainee.enrollment_status)}`}>
                        {selectedTrainee.enrollment_status.charAt(0).toUpperCase() + selectedTrainee.enrollment_status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-600">Progress</p>
                      <p className="font-bold text-2xl">{selectedTrainee.progress_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-medium">{selectedTrainee.start_date}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Completion Date</p>
                      <p className="font-medium">{selectedTrainee.completion_date || 'Not completed'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Certificate Status</p>
                      <Badge variant="outline" className={`py-2 px-4 ${getCertificateBadge(selectedTrainee.certificate_status)}`}>
                        {selectedTrainee.certificate_status.replace('_', ' ').charAt(0).toUpperCase() + selectedTrainee.certificate_status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-gray-600">Certificate Uploaded At</p>
                      <p className="font-medium">{selectedTrainee.certificate_uploaded_at || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resume</h3>
                  <div className="text-sm">
                    <p className="text-gray-600">Has Resume</p>
                    <p className="font-medium">{selectedTrainee.has_resume ? 'Yes' : 'No'}</p>
                    {selectedTrainee.has_resume && selectedTrainee.resume_url && (
                      <Button variant="outline" className="mt-3" asChild>
                        <a href={selectedTrainee.resume_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Resume
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TraineesTable;