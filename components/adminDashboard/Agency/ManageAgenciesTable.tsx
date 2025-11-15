"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Ban, CheckCircle, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Agency } from '@/types/Agency.type';
import { toast } from 'sonner';
import { agencies } from '@/data/Agency.data';

const ManageAgenciesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Users');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const itemsPerPage = 10;

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.agencyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.representative.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All Users' || agency.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const paginatedAgencies = filteredAgencies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleView = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowDetailsDialog(true);
  };

  const handleApprove = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowApproveDialog(true);
  };

  const handleReject = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowRejectDialog(true);
  };

  const confirmApprove = () => {
    toast.success(`Agency "${selectedAgency?.name}" has been approved.`);
    setShowApproveDialog(false);
  };

  const confirmReject = () => {
    toast.error(`Agency "${selectedAgency?.name}" has been rejected.`);
    setShowRejectDialog(false);
  };

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)] bg-white p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Users">All Users</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency Name</TableHead>
                <TableHead>Representative</TableHead>
                <TableHead>Email & Contact</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAgencies.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell className="font-medium">{agency.name}</TableCell>
                  <TableCell>{agency.representative}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{agency.email}</p>
                      <p className="text-gray-500">{agency.contact}</p>
                    </div>
                  </TableCell>
                  <TableCell>{agency.registrationDate}</TableCell>
                  <TableCell>
                    <Badge className={agency.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {agency.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(agency)} className="gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleReject(agency)} className="text-red-500 hover:bg-red-50">
                        <Ban className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleApprove(agency)} className="text-green-500 hover:bg-green-50">
                        <CheckCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {paginatedAgencies.map((agency) => (
            <Card key={agency.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{agency.name}</h3>
                    <p className="text-sm text-gray-600">{agency.representative}</p>
                  </div>
                  <Badge className={agency.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {agency.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p><span className="text-gray-600">Email:</span> {agency.email}</p>
                  <p><span className="text-gray-600">Contact:</span> {agency.contact}</p>
                  <p><span className="text-gray-600">Reg Date:</span> {agency.registrationDate}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleView(agency)} className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleReject(agency)} className="text-red-500">
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleApprove(agency)} className="text-green-500">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {currentPage} of {totalPages || 1}</span>
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages || 1, p + 1))} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Agency Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                Agency Details
                {selectedAgency && (
                  <Badge className={selectedAgency.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {selectedAgency.status}
                  </Badge>
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
                      <p className="font-medium">{selectedAgency.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Agency ID</p>
                      <p className="font-medium">{selectedAgency.agencyId}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{selectedAgency.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-600">Representative Name</p>
                      <p className="font-medium">{selectedAgency.representative}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Registration Date</p>
                      <p className="font-medium">{selectedAgency.registrationDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Contact Number</p>
                      <p className="font-medium">{selectedAgency.contact}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium">{selectedAgency.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Submitted Documents</h3>
                  {selectedAgency.documents.length > 0 ? (
                    <ul className="space-y-3">
                      {selectedAgency.documents.map((doc, i) => (
                        <li key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.uploadedAt}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded.</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button className="flex-1 bg-black hover:bg-gray-900 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approve Confirmation */}
        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Agency</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to Approve this Agency?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmApprove} className="bg-black hover:bg-gray-800">
                Confirm Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Confirmation */}
        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Agency</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to Reject this Agency?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmReject} className="bg-red-600 hover:bg-red-700">
                Confirm Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ManageAgenciesTable;