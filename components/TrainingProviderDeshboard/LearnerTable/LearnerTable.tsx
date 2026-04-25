import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Download, Eye, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"; // Fixed: SearchIcon → Search
import LearnerProfile from "../LearnersProfile/LearnerProfile";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/elements/ConfirmationDialog";
import AddTraining from "../AddTraining/AddTraining";
import { useLearnerListQuery, useUpdateLearnerStatusMutation, useVerifyCertificateMutation } from "@/store/api/trainerSlice/trainerSlice";
import { LearnerEnrollment } from "@/types/trainer/trainer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the type based on your API response

export default function LearnerTable() {
  const { data, isLoading, isError } = useLearnerListQuery();
  const [updateStatus] = useUpdateLearnerStatusMutation();
  const [verifyCertificate] = useVerifyCertificateMutation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const [open, setOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<"Accept" | "Reject">("Accept");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LearnerEnrollment | "certificate_status" | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const [selectedLearner, setSelectedLearner] = useState<LearnerEnrollment | null>(null);

  // Filter learners based on search query
  const filteredLearners = useMemo(() => {
    if (!data?.results) return [];

    const query = searchQuery.trim().toLowerCase();

    // First filter
    const filtered = !query
      ? [...data.results]
      : data.results.filter((learner: LearnerEnrollment) => {
        return (
          learner.learner_name.toLowerCase().includes(query) ||
          learner.learner_email.toLowerCase().includes(query) ||
          learner.program_name.toLowerCase().includes(query)
        );
      });

    // Then sort
    if (sortConfig.key) {
      filtered.sort((a: LearnerEnrollment, b: LearnerEnrollment) => {
        const aValue = a[sortConfig.key as keyof LearnerEnrollment] || "";
        const bValue = b[sortConfig.key as keyof LearnerEnrollment] || "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data?.results, searchQuery, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredLearners.length / ITEMS_PER_PAGE);
  const paginatedLearners = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLearners.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLearners, currentPage]);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSort = (key: keyof LearnerEnrollment | "certificate_status") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1 text-black" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1 text-black" />
    );
  };


  const handleView = (learner: LearnerEnrollment) => {
    setSelectedLearner(learner);
    setOpen(true);
  };

  const handleVerifyDialog = (type: "Accept" | "Reject") => {
    setDialogType(type);
    setOpenAlert(true);
  };

  const onConfirmVerification = async () => {
    if (!selectedLearner?.certificate_id) return;

    await verifyCertificate({
      id: selectedLearner.certificate_id,
      action: dialogType === "Accept" ? "verify" : "reject",
      rejection_reason: dialogType === "Reject" ? "Certificate rejected by provider" : undefined
    });
    setOpenAlert(false);
    setOpen(false); // Close profile modal if open
  };

  return (
    <div className="space-y-6">
      {/* Header: Search + Add Training */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <InputGroup className="bg-white rounded-lg border border-gray-200 w-full max-w-md">
          <InputGroupInput
            placeholder="Search by name, email, or program..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="h-4 w-4 text-gray-500" />
          </InputGroupAddon>
        </InputGroup>


      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-gray-500">Loading learners...</div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-12 text-red-600">
          Failed to load learners. Please try again later.
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Learner Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Program</TableHead>
                <TableHead className="font-bold">Start Date</TableHead>
                <TableHead className="text-center font-bold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="hover:bg-transparent font-bold"
                  >
                    Status
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead className="text-center font-bold">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("certificate_status")}
                    className="hover:bg-transparent font-bold"
                  >
                    Certificate
                    {getSortIcon("certificate_status")}
                  </Button>
                </TableHead>
                <TableHead className="font-bold">Financial Aid</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLearners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    {searchQuery
                      ? "No learners found matching your search."
                      : "No enrolled learners yet."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLearners.map((learner) => (
                  <TableRow key={learner.id}>
                    <TableCell className="font-medium">
                      {learner.learner_name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {learner.learner_email}
                    </TableCell>
                    <TableCell>{learner.program_name}</TableCell>
                    <TableCell>
                      {new Date(learner.start_date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={learner.status}
                        onValueChange={(value) =>
                          updateStatus({ id: learner.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-[140px] h-8 mx-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enrolled">Enrolled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="dropped">Dropped</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      {learner.certificate_status ? (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${learner.certificate_status === "verified"
                            ? "bg-green-100 text-green-800"
                            : learner.certificate_status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800" // pending
                            }`}
                        >
                          {learner.certificate_status.charAt(0).toUpperCase() +
                            learner.certificate_status.slice(1)}
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        learner.financial_aid_requested
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {learner.financial_aid_requested ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleView(learner)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => {
                            if (learner.resume_url) {
                              window.open(learner.resume_url, "_blank");
                            }
                          }}
                          disabled={!learner.resume_url}
                        >
                          <Download className="h-4 w-4" />
                          Resume
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLearners.length)} of {filteredLearners.length}
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

      {/* Modals */}
      {selectedLearner && (
        <LearnerProfile
          action={{
            open,
            setOpen,
            handleValue: ({ type, open }) => {
              setOpenAlert(open);
              setDialogType(type);
            },
          }}
          data={selectedLearner}
        />
      )}

      <ConfirmationDialog
        open={openAlert}
        action={dialogType}
        setOpen={setOpenAlert}
        title="Verify Certificate"
        subtitle={
          dialogType === "Accept"
            ? "Are you sure you want to verify this certificate?"
            : "Are you sure you want to reject this certificate request?"
        }
        onConfirm={onConfirmVerification}
      />
    </div>
  );
}