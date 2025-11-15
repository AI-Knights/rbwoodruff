"use client"
import React, { useState } from 'react';
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
import { Eye, Ban, CheckCircle, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Employer {
  id: string;
  companyName: string;
  industry: string;
  activeJobs: number;
  status: 'Verified' | 'Pending' | 'Suspended';
  email: string;
}

const EmployerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Users');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const itemsPerPage = 8;

  // Dummy data
  const employers: Employer[] = [
    { id: 'E001', companyName: 'TechCorp Industries', industry: 'Software', activeJobs: 12, status: 'Verified', email: 'contact@techcorp.com' },
    { id: 'E002', companyName: 'Google Incorporate', industry: 'Software', activeJobs: 6, status: 'Verified', email: 'hr@google.com' },
    { id: 'E003', companyName: 'Jamuna Incorporate', industry: 'Software', activeJobs: 9, status: 'Verified', email: 'jobs@jamuna.com' },
    { id: 'E004', companyName: 'Techgiant Incorporate', industry: 'Software', activeJobs: 8, status: 'Verified', email: 'recruit@techgiant.com' },
    { id: 'E005', companyName: 'Techonologia', industry: 'Software', activeJobs: 10, status: 'Verified', email: 'careers@techonologia.com' },
    { id: 'E006', companyName: 'Technical Incorporate', industry: 'Software', activeJobs: 17, status: 'Verified', email: 'hr@technical.com' },
    { id: 'E007', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E008', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E009', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E000', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E011', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E012', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E013', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E014', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E015', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E016', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E017', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E018', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E019', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
    { id: 'E020', companyName: 'Microsoft Incorporate', industry: 'Software', activeJobs: 15, status: 'Verified', email: 'jobs@microsoft.com' },
  ];

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = employer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All Users' || employer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredEmployers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployers = filteredEmployers.slice(startIndex, startIndex + itemsPerPage);

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

  const handleSuspendConfirm = () => {
    console.log('Suspending employer:', selectedEmployer);
    setShowSuspendDialog(false);
  };

  const handleApproveConfirm = () => {
    console.log('Approving employer:', selectedEmployer);
    setShowApproveDialog(false);
  };

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)] bg-white p-4 md:p-6 lg:p-8">
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
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table View */}
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
                {paginatedEmployers.map((employer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{employer.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employer.companyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employer.industry}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{employer.activeJobs}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                        {employer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(employer)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedEmployers.map((employer, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">ID: {employer.id}</p>
                    <h3 className="font-semibold text-lg">{employer.companyName}</h3>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                    {employer.status}
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
                    <p className="font-medium">{employer.activeJobs}</p>
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

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
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
                  <p className="font-semibold">{selectedEmployer.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Industry</p>
                  <p className="font-semibold">{selectedEmployer.industry}</p>
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

        {/* Suspend Alert Dialog */}
        <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Suspend Employer</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to suspend {selectedEmployer?.companyName}?
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
                Confirm Suspend
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
                Are you sure you want to Approve {selectedEmployer?.companyName}?
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

export default EmployerTable;