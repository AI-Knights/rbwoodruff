import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEmployerLinkagesQuery } from "@/store/api/trainerSlice/trainerSlice";

export default function EmployerList() {
  const { data } = useEmployerLinkagesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // Filtered list based on search
  const filteredEmployers = useMemo(() => {
    if (!data?.jobs) return [];
    return data.jobs.filter((employer) =>
      employer.employer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.job_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployers.length / ITEMS_PER_PAGE);
  const paginatedEmployers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEmployers, currentPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div>
        <InputGroup className="bg-white rounded-full w-fit">
          <InputGroupInput
            placeholder="Search by name "
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Table */}
      <div className="border bg-white rounded-lg overflow-hidden p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Employer Name</TableHead>
              <TableHead className="font-bold">Program</TableHead>
              <TableHead className="font-bold">Roles Hiring</TableHead>
              <TableHead className="font-bold">Avg Salary Range</TableHead>
              <TableHead className="font-bold">Active Listings</TableHead>
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployers.map((employer) => (
              <TableRow key={employer.job_id}>
                <TableCell className="font-medium">{employer.employer_name}</TableCell>
                <TableCell>{employer.job_category}</TableCell>
                <TableCell>{employer.employment_type}</TableCell>
                <TableCell className="text-green-600 font-medium">
                  ${employer.salary_min}K - ${employer.salary_max}K
                </TableCell>
                <TableCell>{employer.number_of_openings} open</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "px-3 text-black py-1 rounded",
                      employer.status === "active" && "bg-green-100 border border-green-200",
                      employer.status === "not-available" && "bg-[#F1E8CC] border border-[#fcd971]",
                      employer.status === "pending" && "bg-[#FFEEEF] border border-[#fd9098]"
                    )}
                  >
                    {employer.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredEmployers.length)} of {filteredEmployers.length}
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
    </div>
  );
}
