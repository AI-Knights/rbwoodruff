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
import { Trainer } from '@/types/admin/trainer.type';
import { useGetTrainersQuery, useUpdateTrainerStatusMutation } from '@/store/api/adminSlice/TrainerSlice';

const itemsPerPage = 8;

const TrainerTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All Users' | 'Verified' | 'Pending' | 'banned'>('All Users');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const { data, isLoading, isFetching } = useGetTrainersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateTrainerStatusMutation();

  const trainers = data?.results ?? [];

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.trainer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'All Users' ||
      (filterStatus === 'Verified' && trainer.status === 'verified') ||
      (filterStatus === 'Pending' && trainer.status === 'pending') ||
      (filterStatus === 'banned' && trainer.status === 'banned');
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTrainers = filteredTrainers.slice(startIndex, startIndex + itemsPerPage);

  const uiTrainers = paginatedTrainers.map((trainer) => ({
    ...trainer,
    name: trainer.trainer_name,
    email: trainer.user_email,
    uiStatus: trainer.status === 'verified' ? 'Verified' : trainer.status === 'pending' ? 'Pending' : 'Banned',
  }));

  const handleViewProfile = (trainer: typeof uiTrainers[0]) => {
    setSelectedTrainer(trainer);
    setShowProfileDialog(true);
  };

  const handleSuspendClick = (trainer: typeof uiTrainers[0]) => {
    setSelectedTrainer(trainer);
    setShowSuspendDialog(true);
  };

  const handleApproveClick = (trainer: typeof uiTrainers[0]) => {
    setSelectedTrainer(trainer);
    setShowApproveDialog(true);
  };

  const handleSuspendConfirm = async () => {
    if (!selectedTrainer) return;
    try {
      await updateStatus({ id: selectedTrainer.id, action: 'banned' }).unwrap();
      toast.success('Trainer banned successfully');
      setShowSuspendDialog(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to suspend trainer');
    }
  };

  const handleApproveConfirm = async () => {
    if (!selectedTrainer) return;
    try {
      await updateStatus({ id: selectedTrainer.id, action: 'verify' }).unwrap();
      toast.success('Trainer approved successfully');
      setShowApproveDialog(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to approve trainer');
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading trainers...</div>;

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
          <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as any)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Users">All Users</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">Trainer Name</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">Specialization</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">Experience</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">Total Programs</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uiTrainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-6 text-sm font-medium text-gray-900">{trainer.user_email}</td>
                    <td className="px-6 py-6 text-sm text-gray-900">{trainer.name}</td>
                    <td className="px-6 py-6 text-sm text-gray-900">{trainer.specialization}</td>
                    <td className="px-6 py-6 text-sm text-gray-900">{trainer.experience}</td>
                    <td className="px-6 py-6 text-sm text-gray-900">{trainer.total_programs}</td>
                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${trainer.status === 'verified' ? 'bg-green-100 text-green-800' :
                          trainer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                      >
                        {trainer.status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewProfile(trainer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {trainer.status === 'pending' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApproveClick(trainer)}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        ) : trainer.status === 'verified' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSuspendClick(trainer)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Ban className="h-5 w-5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApproveClick(trainer)}
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
          {uiTrainers.map((trainer) => (
            <Card key={trainer.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{trainer.name}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${trainer.uiStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                      trainer.uiStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                  >
                    {trainer.uiStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Specialization</p>
                    <p className="font-medium">{trainer.specialization}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Programs</p>
                    <p className="font-medium">{trainer.total_programs}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(trainer)} className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {trainer.status === 'pending' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleApproveClick(trainer)}
                      className="text-green-500 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  ) : trainer.status === 'verified' ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSuspendClick(trainer)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleApproveClick(trainer)}
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="flex flex-row items-center justify-between pb-4">
              <DialogTitle className="text-xl font-semibold">Trainer Profile</DialogTitle>
            </DialogHeader>
            {selectedTrainer && (
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trainer Name</p>
                  <p className="font-semibold">{selectedTrainer.trainer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold">{selectedTrainer.user_email.slice(0, 20)}....</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Specialization</p>
                  <p className="font-semibold">{selectedTrainer.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Experience</p>
                  <p className="font-semibold">{selectedTrainer.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${selectedTrainer.status === 'verified' ? 'bg-green-100 text-green-800' :
                      selectedTrainer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                  >
                    {selectedTrainer.status.charAt(0).toUpperCase() + selectedTrainer.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Programs</p>
                  <p className="font-semibold">{selectedTrainer.total_programs}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Suspend Dialog */}
        <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">Suspend Trainer</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to suspend {selectedTrainer?.trainer_name}?
                <br />
                They will not be able to create or manage training programs.
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
              <AlertDialogTitle className="text-xl font-semibold">Approve Trainer</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to approve {selectedTrainer?.trainer_name}?
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

export default TrainerTable;