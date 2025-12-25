import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Delete, DeleteIcon, Eye, Search, Trash } from "lucide-react"; // Changed SearchIcon to Search
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import DeleteTrainingDialog from "./DeleteTrainingDialog";
import { useState, useMemo } from "react";
import { useProgrammListQuery } from "@/store/api/trainerSlice/trainerSlice";
import AddTraining from "../AddTraining/AddTraining";
import { FiDelete } from "react-icons/fi";

export default function TrainingLists() {
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  return (
    <div className="w-full space-y-6">
      {/* Search Input */}
      <div className="flex justify-between">

        <InputGroup className="bg-white rounded-full w-full max-w-md shadow-sm">
          <InputGroupInput
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="text-center py-8 text-gray-500">Loading trainings...</div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500">
          Failed to load trainings. Please try again.
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <div className="border bg-white rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Training Name</TableHead>
                <TableHead className="font-bold">Training Link</TableHead>
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
                      ? "No trainings found matching your search."
                      : "No trainings available."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrainings.map((training) => (
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
                      <DeleteTrainingDialog
                        trainingName={training.name}
                        trainingId={training.id} // assuming you need id for deletion
                        onConfirm={() => {
                          // You can trigger refetch or optimistic update here if needed
                        }}
                      >
                        <Button variant="ghost" size="icon" className="hover:text-red-600">
                       <Trash/>
                        </Button>
                      </DeleteTrainingDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}