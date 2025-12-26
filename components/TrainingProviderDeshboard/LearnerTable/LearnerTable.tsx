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
import { Download, Eye, Search } from "lucide-react"; // Fixed: SearchIcon → Search
import LearnerProfile from "../LearnersProfile/LearnerProfile";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/elements/ConfirmationDialog";
import AddTraining from "../AddTraining/AddTraining";
import { useLearnerListQuery } from "@/store/api/trainerSlice/trainerSlice";
import { LearnerEnrollment } from "@/types/trainer/trainer";

// Define the type based on your API response

export default function LearnerTable() {
  const { data, isLoading, isError } = useLearnerListQuery();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<"Accept" | "Reject">("Accept");

  const [selectedLearner, setSelectedLearner] = useState<LearnerEnrollment | null>(null);

  // Filter learners based on search query
  const filteredLearners = useMemo(() => {
    if (!data?.results) return [];

    const query = searchQuery.trim().toLowerCase();
    if (!query) return data.results;

    return data.results.filter((learner: LearnerEnrollment) => {
      return (
        learner.learner_name.toLowerCase().includes(query) ||
        learner.learner_email.toLowerCase().includes(query) ||
        learner.program_name.toLowerCase().includes(query)
      );
    });
  }, [data?.results, searchQuery]);

  const handleView = (learner: LearnerEnrollment) => {
    setSelectedLearner(learner);
    setOpen(true);
  };

  const handleVerify = (type: "Accept" | "Reject") => {
    setDialogType(type);
    setOpenAlert(true);
  };

  return (
    <div className="space-y-6">
      {/* Header: Search + Add Training */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <InputGroup className="bg-white rounded-lg shadow-sm w-full max-w-md">
          <InputGroupInput
            placeholder="Search by name, email, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Learner Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Program</TableHead>
                <TableHead className="font-bold">Start Date</TableHead>
                <TableHead className="text-center font-bold">Status</TableHead>
                <TableHead className="text-center font-bold">Certificate</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLearners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    {searchQuery
                      ? "No learners found matching your search."
                      : "No enrolled learners yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLearners.map((learner) => (
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
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          learner.status === "enrolled"
                            ? "bg-blue-100 text-blue-800"
                            : learner.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : learner.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {learner.status.replace("_", " ").charAt(0).toUpperCase() +
                          learner.status.replace("_", " ").slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          learner.has_certificate
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {learner.has_certificate ? "Yes" : "No"}
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
      />
    </div>
  );
}