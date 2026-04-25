import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Search, Trash } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import DeleteTrainingDialog from "./DeleteTrainingDialog";
import { useState, useMemo } from "react";
import { useProgrammListQuery } from "@/store/api/trainerSlice/trainerSlice";
import AddTraining from "../AddTraining/AddTraining";
import EditTrainingDialog from "./EditTrainingDialog";


export default function TrainingLists() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;
  const { data, isLoading, isError } = useProgrammListQuery();

  // Filter trainings based on search query (name or id)
  const filteredTrainings = useMemo(() => {
    if (!data?.results) return [];

    const query = searchQuery.trim().toLowerCase();

    if (!query) return data.results;

    return data.results.filter((training) => {
      return (
        training.name.toLowerCase().includes(query) ||
        training.id.toLowerCase().includes(query)
      );
    });
  }, [data?.results, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredTrainings.length / ITEMS_PER_PAGE);
  const paginatedTrainings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTrainings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTrainings, currentPage]);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input */}
      <div className="flex justify-between">

        <InputGroup className="bg-white rounded-full w-full max-w-md shadow-sm">
          <InputGroupInput
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search className="h-4 w-4 text-gray-500" />

          </InputGroupAddon>
        </InputGroup>
        <div>
          <AddTraining />
        </div>
      </div>

      {/* Loading / Error States */}
      {isLoading && (
        <div className="text-center py-8 text-gray-500">Loading programs...</div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500">
          Failed to load programs. Please try again.
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="border bg-white rounded-lg overflow-hidden shadow-sm p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Program Name</TableHead>
                  <TableHead className="font-bold">Program Link</TableHead>
                  <TableHead className="font-bold">Duration</TableHead>
                  <TableHead className="font-bold">Deadline</TableHead>
                  <TableHead className="text-center font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchQuery
                        ? "No programs found matching your search."
                        : "No programs available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTrainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell className="font-medium">{training.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a
                          href={training.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {training.external_link}
                        </a>
                      </TableCell>
                      <TableCell>
                        {training.duration} {training.duration_unit}
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {new Date(training.deadline).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-1">
                          <EditTrainingDialog training={training} />

                          <DeleteTrainingDialog
                            trainingName={training.name}
                            trainingId={training.id}
                            onConfirm={() => {
                              // You can trigger refetch or optimistic update here if needed
                            }}
                          >
                            <Button variant="ghost" size="icon" className="hover:text-red-600">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </DeleteTrainingDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg shadow p-4 mt-4">
              <p className="text-sm text-gray-500">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTrainings.length)} of {filteredTrainings.length}
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
        </>
      )}
    </div>
  );
}