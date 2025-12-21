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
import { Eye, Ban, CheckCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useGetEmployersQuery, useUpdateEmployerStatusMutation } from '@/store/api/adminSlice/EmployerSlice';
import { Employer } from '@/types/admin/employer.type';

const itemsPerPage = 8;

const EmployerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All Users' | 'verified' | 'pending' | 'banned'>('All Users');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const apiFilter = filterStatus === 'All Users' ? undefined : filterStatus.toLowerCase() as 'verified' | 'pending' | 'banned';

  const { data, isLoading, isFetching } = useGetEmployersQuery({ page: currentPage, filter: apiFilter });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateEmployerStatusMutation();

  const employers = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const filteredEmployers = employers.filter((employer) =>
    employer.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uiEmployers = filteredEmployers.map((emp) => ({
    ...emp,
    companyName: emp.company_name,
    activeJobs: emp.total_jobs,
    status: emp.is_verified === 'verified' ? 'Verified' : emp.is_verified === 'pending' ? 'Pending' : 'Suspended',
    email: emp.user_email,
  }));

  const handleViewProfile = (employer: Employer) => {
    setSelectedEmployer(employer);
    setShowProfileDialog(true);
  };

  const handleSuspendClick = (employer: Employer) => {
    setSelectedEmployer(employer);
    setShowSuspendDialog(true);
  };

  const handleApproveClick = (employer: Employer) => {
    setSelectedEmployer(employer);
    setShowApproveDialog(true);
  };

  const handleSuspendConfirm = async () => {
    if (!selectedEmployer) return;
    try {
      await updateStatus({ id: selectedEmployer.id, action: 'banned' }).unwrap();
      toast.success('Employer suspended successfully');
      setShowSuspendDialog(false);
    } catch (error) {
      const err = error as {data?: {message?: string}};
      toast.error(err?.data?.message || 'Failed to suspend employer');
    }
  };

  const handleApproveConfirm = async () => {
    if (!selectedEmployer) return;
    try {
      await updateStatus({ id: selectedEmployer.id, action: 'verified' }).unwrap();
      toast.success('Employer approved successfully');
      setShowApproveDialog(false);
    } catch (error) {
      const err = error as {data?: {message?: string}};
      toast.error(err?.data?.message || 'Failed to approve employer');
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading employers...</div>;

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="space-y-4">
        {/* Header */}
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
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Company Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Industry</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Active Jobs</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uiEmployers.map((employer: Employer) => (
                  <tr key={employer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{employer.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employer.company_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employer.industry}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employer.total_jobs}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          employer.is_verified === 'verified' ? 'bg-green-100 text-green-800' :
                          employer.is_verified === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {employer.is_verified}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewProfile(employer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {employer.is_verified === 'pending' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApproveClick(employer)}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        ) : employer.is_verified === 'verified' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSuspendClick(employer)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Ban className="h-5 w-5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApproveClick(employer)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {uiEmployers.map((employer: Employer) => (
            <Card key={employer.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">ID: {employer.id.slice(0, 8)}...</p>
                    <h3 className="font-semibold text-lg">{employer.company_name}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      employer.is_verified === 'verified' ? 'bg-green-100 text-green-800' :
                      employer.is_verified === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {employer.is_verified}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Industry</p>
                    <p className="font-medium">{employer.industry}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Active Jobs</p>
                    <p className="font-medium">{employer.total_jobs}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(employer)} className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {employer.is_verified === 'pending' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleApproveClick(employer)}
                      className="text-green-500 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  ) : employer.is_verified === 'verified' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSuspendClick(employer)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleApproveClick(employer)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Profile Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between pb-4">
              <DialogTitle className="text-xl font-semibold">Employer Profile</DialogTitle>
            </DialogHeader>
            {selectedEmployer && (
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Company Name</p>
                  <p className="font-semibold">{selectedEmployer.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Industry</p>
                  <p className="font-semibold">{selectedEmployer.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold">{selectedEmployer.user_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                      selectedEmployer.is_verified === 'verified' ? 'bg-green-100 text-green-800' :
                      selectedEmployer.is_verified === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedEmployer.is_verified}
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
              <AlertDialogTitle className="text-xl font-semibold">Suspend Employer</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to suspend {selectedEmployer?.company_name}?
                <br />
                They will not be able to post jobs or access their account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSuspendConfirm}
                disabled={isUpdating}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isUpdating ? 'Suspending...' : 'Confirm Suspend'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Approve Dialog */}
        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Approve Employer</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to approve {selectedEmployer?.company_name}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApproveConfirm}
                disabled={isUpdating}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isUpdating ? 'Approving...' : 'Confirm Approve'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EmployerTable;