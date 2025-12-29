"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Eye,
  GraduationCap,
  LoaderIcon,
  Settings,
  Tag,
  User,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ApplicantForJob } from "@/types/employer/employer.type";
import { useUpdateApplicationMutation } from "@/store/api/employerSlice/JobSlice";

import { toast } from "sonner";
import {
  ApplicationStatus,
  ApplicationStatusFormValues,
  applicationStatusSchema,
} from "@/schema/employer/application.schema";

interface Props {
  applicant: ApplicantForJob;
}

export function ApplicantCard({ applicant }: Props) {
  const avatarSrc =
    applicant.resume_pdf_url ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.id}`;

  const [open, setOpen] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateApplicationMutation();

  const form = useForm<ApplicationStatusFormValues>({
    resolver: zodResolver(applicationStatusSchema),
    defaultValues: {
      status: applicant.status as ApplicationStatusFormValues["status"],
    },
  });

  const handleStatusUpdate = async (values: ApplicationStatusFormValues) => {
    try {
      await updateStatus({
        id: applicant.id,
        status: values.status,
      }).unwrap();

      toast.success("Application status updated successfully");
      setOpen(false);
    } catch {
      toast.error("Failed to update application status");
    }
  };

  const handleOpenImage = (imageUrl: string | null) => {
    if (imageUrl === null) return;

    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 p-4 bg-white rounded-lg border">
      {/* Manage Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <User className="size-5" /> Manage Applicant
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Update the applicant’s current application status.
          </p>

          <form
            onSubmit={form.handleSubmit(handleStatusUpdate)}
            className="space-y-4"
          >
            <div>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue("status", value as ApplicationStatus)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>

              {form.formState.errors.status && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Applicant Info */}
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatarSrc} alt={applicant.applicant_name} />
        <AvatarFallback>{applicant.applicant_name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <h3 className="font-medium">{applicant.applicant_name}</h3>
        <p className="text-sm text-muted-foreground">
          {applicant.applicant_email}
        </p>

        <div className="flex gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />
            {moment(applicant.applied_at).format("MMMM Do, YYYY")}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="size-4" />
            {applicant.job_category}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="size-4" />
            {applicant.certifications === null
              ? "No Certification"
              : "Certified"}
          </span>
        </div>
        <h1 className="text-sm text-muted-foreground">
          Status:{" "}
          <Badge
            className="text-xs"
            variant={
              applicant.status === "rejected"
                ? "destructive"
                : applicant.status === "shortlisted"
                ? "shortlisted"
                : applicant.status === "hired"
                ? "success"
                : "outline"
            }
          >
            {applicant.status.charAt(0).toUpperCase() +
              applicant.status.slice(1)}
          </Badge>
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {applicant.resume_pdf_url !== null ? (
          <>
            <Button
              onClick={() =>
                handleOpenImage(applicant.resume_pdf_url)
              }
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Resume
            </Button>
          </>
        ) : (
          <></>
        )}
        {applicant.certifications !== null ? (
          <>
            <Button
              onClick={() => handleOpenImage(applicant.certifications)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Certificate
            </Button>
          </>
        ) : (
          <></>
        )}

        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Settings className="h-4 w-4 mr-1" />
          Manage
        </Button>
      </div>
    </div>
  );
}
