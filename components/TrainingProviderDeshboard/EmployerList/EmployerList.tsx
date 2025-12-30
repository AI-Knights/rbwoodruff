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
import { cn } from "@/lib/utils";
import { useEmployerLinkagesQuery } from "@/store/api/trainerSlice/trainerSlice";

export default function EmployerList() {
  const { data } = useEmployerLinkagesQuery();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered list based on search
  const filteredEmployers = useMemo(() => {
    if (!data?.jobs) return [];
    return data.jobs.filter((employer) =>
      employer.employer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.job_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div>
        <InputGroup className="bg-white rounded-full w-fit">
          <InputGroupInput
            placeholder="Search by name "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Table */}
      <div className="border bg-white rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Employer Name</TableHead>
              <TableHead className="font-bold">Training Program</TableHead>
              <TableHead className="font-bold">Roles Hiring</TableHead>
              <TableHead className="font-bold">Avg Salary Range</TableHead>
              <TableHead className="font-bold">Active Listings</TableHead>
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployers.map((employer) => (
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
    </div>
  );
}
