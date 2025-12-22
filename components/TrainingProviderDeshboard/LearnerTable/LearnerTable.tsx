import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Download, Eye, SearchIcon } from "lucide-react";
import LearnerProfile, { Learner } from "../LearnersProfile/LearnerProfile";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/elements/ConfirmationDialog";
import AddTraining from "../AddTraining/AddTraining";
const invoices = [
  {
    name: "Ayesha Rahman",
    program: "Full Stack Web Development",
    startDate: "2025-03-15",
    status: "In progress",
    certificate: true,
  },
  {
    name: "Md. Karim Hossain",
    program: "Data Science & AI",
    startDate: "2025-01-20",
    status: "Completed",
    certificate: false,
  },
  {
    name: "Fatima Akter",
    program: "Digital Marketing Pro",
    startDate: "2025-04-01",
    status: "In progress",
    certificate: true,
  },
  {
    name: "Rahim Uddin",
    program: "UI/UX Design Mastery",
    startDate: "2025-02-10",
    status: "Completed",
    certificate: false,
  },
  {
    name: "Sanjida Islam",
    program: "Mobile App Development",
    startDate: "2024-11-01",
    status: "Rejected",
    certificate: true,
  },
];

export default function LearnerTable() {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<"Accept" | "Reject">("Accept");
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  const [selectedLearner, setSelectedLearner] = useState<Learner>({
    certificate: false,
    name: "",
    program: "",
    startDate: "",
    status: "",
  });

  const handleValues = (value: {
    type: "Accept" | "Reject";
    open: boolean;
  }) => {
    setOpenAlert(value.open);
    setDialogType(value.type);
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <div>
          <InputGroup className="bg-white">
            <InputGroupInput placeholder="Search by name or ID" />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div>
       
          <AddTraining></AddTraining>
        </div>
      </div>

      <Table className="bg-white p-4 rounded-md mt-2">
        <TableHeader>
          <TableRow>
            <TableHead  className=" font-bold w-[100px]"  >Learner Name</TableHead>
            <TableHead  className=" font-bold" >Program</TableHead>
            <TableHead  className=" font-bold" >Start Date</TableHead>
            <TableHead className="text-center font-bold">Status</TableHead>
            <TableHead className="text-center font-bold">Certificate</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium py-4 px-6">
                {invoice.name}
              </TableCell>
              <TableCell>{invoice.program}</TableCell>
              <TableCell>{invoice.startDate}</TableCell>
              <TableCell className={`"" `}>
                <p
                  className={`${
                    invoice.status === "In progress" &&
                    " bg-[#DBEAFE] text-[#8644C1]"
                  }  ${
                    invoice.status === "Rejected" &&
                    " bg-[#FFD7D8] text-[#FF383C]"
                  } ${
                    invoice.status === "Completed" &&
                    " bg-[#D4EDDA] text-[#53B96A]"
                  } text-center w-fit p-1 rounded mx-auto `}
                >
                  {invoice.status}
                </p>
              </TableCell>
              <TableCell className="text-center">
                <div className="w-fit mx-auto">
                  {invoice.certificate ? (
                    <p className="w-fit p-1 bg-black/85 rounded text-white">
                      Yes
                    </p>
                  ) : (
                    <p className="w-fit p-1 bg-black/15 text-black rounded">
                      No
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-fit items-end justify-end ">
                <div className="w-fit flex flex-row gap-1 items-center ml-auto">
                  <Button
                    onClick={() => {
                      setOpen(true);
                      setSelectedLearner(invoice);
                    }}
                    className="flex flex-row gap-1 items-center justify-center p-4 border cursor-pointer"
                    variant="outline"
                  >
                    <Eye></Eye>
                    view
                  </Button>
                  <div className="flex flex-row gap-1 items-center justify-center p-1 rounded-md border cursor-pointer">
                    <Download></Download>
                    Resume
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <LearnerProfile
        action={{
          open,
          setOpen,
          handleValue: handleValues,
        }}
        data={selectedLearner}
      />
      <ConfirmationDialog
        open={openAlert}
        setOpen={setOpenAlert}
        title="Verify Certificate"
        subtitle={
          `${
            dialogType === "Accept"
              ? "Are you sure you want to Verify this confirmation request?"
              : "Are you sure you want to Reject this confirmation request?"
          }` || ""
        }
      />
    </div>
  );
}
