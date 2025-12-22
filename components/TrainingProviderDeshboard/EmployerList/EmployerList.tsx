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
import { Eye, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { useState } from "react";
import EmployerDetailDialog from "./EmployerDetailDialog";
import { tr } from "date-fns/locale";

interface Employer {
  id: string;
  name: string;
  trainingProgram: string;
  roleHiring: string;
  salaryRange: string;
  activeListings: number;
  status: "verified" | "pending" | "not-available";
}

const employers: Employer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    trainingProgram: "Health Assistant",
    roleHiring: "Medical Assistant",
    salaryRange: "$45K-$72K",
    activeListings: 28,
    status: "verified",
  },
  {
    id: "2",
    name: "Micheal Chan",
    trainingProgram: "Digital Marketing",
    roleHiring: "Social Media Manager",
    salaryRange: "$46K-$82K",
    activeListings: 26,
    status: "not-available",
  },
  {
    id: "3",
    name: "Emily Rodge",
    trainingProgram: "Software Developer",
    roleHiring: "Front-end Developer",
    salaryRange: "$52K-$72K",
    activeListings: 23,
    status: "pending",
  },
  {
    id: "4",
    name: "Devid Washi",
    trainingProgram: "IT Support",
    roleHiring: "Help desk Technician",
    salaryRange: "$45K-$72K",
    activeListings: 8,
    status: "verified",
  },
  {
    id: "5",
    name: "Washibo Kar",
    trainingProgram: "App Developer",
    roleHiring: "Flutter Developer",
    salaryRange: "$78K-$82K",
    activeListings: 21,
    status: "pending",
  },
  {
    id: "6",
    name: "Dekteri Oselo",
    trainingProgram: "Health Assistant",
    roleHiring: "Medical Assistant",
    salaryRange: "$52K-$82K",
    activeListings: 20,
    status: "verified",
  },
];




export default function EmployerList() {
  const [modal, setModal] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<Employer>({
    id: "",
    name: "",
    trainingProgram: "",
    roleHiring: "",
    salaryRange: "",
    activeListings: 0,
    status: "verified"
  })
  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div>
        <InputGroup className="bg-white rounded-full w-fit ">
          <InputGroupInput placeholder="Search by name or ID" />
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
               <TableHead  className=" font-bold">Employer Name</TableHead>
               <TableHead  className=" font-bold">Training Program</TableHead>
               <TableHead  className=" font-bold">Roles Hiring</TableHead>
               <TableHead  className=" font-bold">Avg Salary Range</TableHead>
               <TableHead  className=" font-bold">Active Listings</TableHead>
               <TableHead  className=" font-bold">Status</TableHead>
              <TableHead className="text-center font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employers.map((employer) => (
              <TableRow key={employer.id}>
                <TableCell className="font-medium">{employer.name}</TableCell>
                <TableCell>{employer.trainingProgram}</TableCell>
                <TableCell>{employer.roleHiring}</TableCell>
                <TableCell className="text-green-600 font-medium">
                  {employer.salaryRange}
                </TableCell>
                <TableCell>{employer.activeListings} open</TableCell>
                <TableCell>
                  <Badge className={cn('px-3 text-black py-1 rounded', employer.status === "verified" && "bg-green-100 border border-green-200", employer.status === "not-available" && "bg-[#F1E8CC] border border-[#fcd971]", employer.status === "pending" && "bg-[#FFEEEF] border border-[#fd9098]")}>
                    {/* {getStatusText(employer.status)} */}
                    {employer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button onClick={() => {
                    setSelectedIndex(employer);
                    setModal(true)
                  }} className=" " variant="ghost" size="icon">
                    <div className="flex flex-row gap-2 p-2 items-center justify-center border rounded" >
                      <Eye className="w-4 h-4" />
                      <div>
                        view
                      </div>
                    </div>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EmployerDetailDialog onSet={setModal} showModal={modal} employer={selectedIndex} ></EmployerDetailDialog>
    </div>
  );
}