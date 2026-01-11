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
import { Eye, Ban, CheckCircle, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Agency } from '@/types/admin/agency.type';
import { useGetAgenciesQuery, useUpdateAgencyStatusMutation } from '@/store/api/adminSlice/AgencyApiSlice';

const itemsPerPage = 10;

const ManageAgenciesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All Agencies' | 'Verified' | 'Pending' | 'Banned'>('All Agencies');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  const { data, isLoading, isFetching } = useGetAgenciesQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAgencyStatusMutation();

  const agencies = data?.results ?? [];

  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch =
      agency.agency_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.agency_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.representative_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'All Agencies' ||
      (filterStatus === 'Verified' && agency.status === 'verified') ||
      (filterStatus === 'Pending' && agency.status === 'pending') ||
      (filterStatus === 'Banned' && agency.status === 'banned');
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgencies = filteredAgencies.slice(startIndex, startIndex + itemsPerPage);

  const uiAgencies = paginatedAgencies.map((agency) => ({
    ...agency,
    name: agency.agency_name,
    representative: agency.representative_name,
    email: agency.user_email,
    registrationDate: new Date(agency.created_at).toLocaleDateString(),
    documents: agency.document_url ? [{ name: 'Verification Document', uploadedAt: new Date(agency.created_at).toLocaleString(), url: agency.document_url }] : [],
    // Keep the original status for logic comparisons
    uiStatus: agency.status === 'verified' ? 'Verified' : agency.status === 'pending' ? 'Pending' : 'Banned',
  }));

  const handleViewProfile = (agency: typeof uiAgencies[0]) => {
    setSelectedAgency(agency);
    setShowProfileDialog(true);
  };

  const handleBanClick = (agency: typeof uiAgencies[0]) => {
    setSelectedAgency(agency);
    setShowBanDialog(true);
  };

  const handleVerifyClick = (agency: typeof uiAgencies[0]) => {
    setSelectedAgency(agency);
    setShowVerifyDialog(true);
  };

  const handleBanConfirm = async () => {
    if (!selectedAgency) return;
    try {
      await updateStatus({ id: selectedAgency.id, action: 'banned' }).unwrap();
      toast.success('Agency banned successfully');
      setShowBanDialog(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to ban agency');
    }
  };

  const handleVerifyConfirm = async () => {
    if (!selectedAgency) return;
    try {
      await updateStatus({ id: selectedAgency.id, action: 'verify' }).unwrap();
      toast.success('Agency verified successfully');
      setShowVerifyDialog(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to verify agency');
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading agencies...</div>;

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
              <SelectValue placeholder="All Agencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Agencies">All Agencies</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Agency Id</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Agency Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Representative</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Registration Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uiAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{agency.agency_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{agency.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{agency.representative === "" ? "No Name given" : agency.representative}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{agency.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{agency.registrationDate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                          agency.status === 'verified' ? 'bg-green-100 text-green-800' :
                          agency.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {agency.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewProfile(agency)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* Use agency.status (lowercase) instead of agency.uiStatus */}
                        {agency.status === 'pending' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVerifyClick(agency)}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        ) : agency.status === 'verified' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBanClick(agency)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Ban className="h-5 w-5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVerifyClick(agency)}
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
          {uiAgencies.map((agency) => (
            <Card key={agency.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{agency.name}</h3>
                    <p className="text-sm text-gray-600">{agency.representative === "" ? "No Name given" : agency.representative}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      agency.uiStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                      agency.uiStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {agency.uiStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{agency.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reg Date</p>
                    <p className="font-medium">{agency.registrationDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(agency)} className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {/* Use agency.status (lowercase) instead of agency.uiStatus */}
                  {agency.status === 'pending' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleVerifyClick(agency)}
                      className="text-green-500 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  ) : agency.status === 'verified' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleBanClick(agency)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleVerifyClick(agency)}
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
          <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                Agency Details
                {selectedAgency && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                      selectedAgency.status === 'verified' ? 'bg-green-100 text-green-800' :
                      selectedAgency.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedAgency.status}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedAgency && (
              <div className="space-y-8 py-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Agency Name</p>
                      <p className="font-medium">{selectedAgency.agency_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Agency ID</p>
                      <p className="font-medium">{selectedAgency.agency_id}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{selectedAgency.user_email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Representative Name</p>
                      <p className="font-medium">{selectedAgency.representative_name === "" ? "No Name given" : selectedAgency.representative_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Registration Date</p>
                      <p className="font-medium">{selectedAgency.created_at}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium">{selectedAgency.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Submitted Documents</h3>
                  {selectedAgency.document_url ? (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Verification Document</p>
                        <p className="text-xs text-gray-500">{new Date(selectedAgency.created_at).toLocaleString()}</p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={selectedAgency.document_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded.</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Ban Dialog */}
        <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Ban Agency</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to ban {selectedAgency?.agency_name}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBanConfirm}
                disabled={isUpdating}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isUpdating ? 'Banning...' : 'Confirm Ban'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Verify Dialog */}
        <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Verify Agency</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to verify {selectedAgency?.agency_name}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleVerifyConfirm}
                disabled={isUpdating}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isUpdating ? 'Verifying...' : 'Confirm Verify'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ManageAgenciesTable;