// src/components/ApplicantCard.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Applicant } from "@/types/job.type";
import { Calendar, Download, GraduationCap, Settings, User } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplicantForJob } from "@/types/employer/employer.type";

interface Props {
  applicant: ApplicantForJob;
}

export function ApplicantCard({ applicant }: Props) {
  const skills = ["JavaScript", "React", "Node.js"];
  const avatarSrc =
    applicant.resume_pdf_url ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.id}`;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center gap-4 p-4 bg-white rounded-lg border">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <User className="size-5" /> Manage Applicant
          </DialogTitle>
          <p className="text-[#4B4B4B]">
            Choose an action to update this applicant’s status or schedule next
            steps.
          </p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="waiting">Waiting</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-end">
            <Button className="w-fit" onClick={() => setOpen(false)}>Done</Button>

          </div>
        </DialogContent>
      </Dialog>
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatarSrc} alt={applicant.applicant_name} />
        <AvatarFallback>{applicant.applicant_name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <h3 className="font-medium">{applicant.applicant_name}</h3>
        <p className="text-sm text-muted-foreground">
          {applicant.applicant_email}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-5" /> {applicant.applied_at}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="size-5" /> {applicant.job}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="xl:flex md:flex-col lg:flex-row hidden gap-2 mt-3 sm:mt-0">
        <Button variant="outline" size="sm">
          <Download href={applicant.resume_pdf_url ? applicant.resume_pdf_url : "#"} className="h-4 w-4 mr-1" />
          View Resume as PDF
        </Button>
        <Button variant="outline" size="sm">
          <Download  className="h-4 w-4 mr-1" />
          View Certificate
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Settings className="h-4 w-4 mr-1" />
          Manage
        </Button>
      </div>
      <div className="flex xl:hidden gap-2 mt-3 sm:mt-0">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Certificate
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Settings className="h-4 w-4 mr-1" />
          Manage
        </Button>
      </div>
    </div>
  );
}
