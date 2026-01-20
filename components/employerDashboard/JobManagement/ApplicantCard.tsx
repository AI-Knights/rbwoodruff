"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { ProfileImage } from "@/components/shared/ProfileImage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Calendar,
  Eye,
  GraduationCap,
  LoaderIcon,
  Settings,
  Tag,
  User,
  Clock,
  MapPin,
  Video,
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
  const [open, setOpen] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateApplicationMutation();

  const form = useForm<ApplicationStatusFormValues>({
    resolver: zodResolver(applicationStatusSchema),
    defaultValues: {
      status: applicant.status as ApplicationStatusFormValues["status"],
      employer_notes: "",
      interview_type: "offline",
    },
  });

  const selectedStatus = form.watch("status");
  const interviewType = form.watch("interview_type");

  const handleStatusUpdate = async (values: ApplicationStatusFormValues) => {
    try {
      const payload: any = {
        id: applicant.id,
        status: values.status,
        employer_notes: values.employer_notes,
      };

      // Add hiring-specific fields
      if (values.status === "hired") {
        payload.start_date = values.start_date;
        payload.joining_time = values.joining_time;
        payload.hiring_notes = values.hiring_notes;
      }

      // Add interview-specific fields
      if (values.status === "interview_scheduled") {
        payload.scheduled_date = values.scheduled_date;
        payload.scheduled_time = values.scheduled_time;
        payload.duration_minutes = values.duration_minutes || 30;
        payload.interview_notes = values.interview_notes;

        if (values.interview_type === "online") {
          payload.meeting_link = values.meeting_link;
        } else {
          payload.location = values.location;
        }
      }

      await updateStatus(payload).unwrap();

      toast.success("Application status updated successfully");
      setOpen(false);
      form.reset();
    } catch {
      toast.error("Failed to update application status");
    }
  };

  const handleOpenImage = (imageUrl: string | null) => {
    if (imageUrl === null) return;

    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "rejected":
        return "destructive";
      case "shortlisted":
        return "shortlisted";
      case "hired":
        return "success";
      case "interview_scheduled":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 p-4 bg-white rounded-lg border">
      {/* Manage Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <User className="size-5" /> Manage Applicant
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Update the applicant&apos;s current application status.
          </p>

          <form
            onSubmit={form.handleSubmit(handleStatusUpdate)}
            className="space-y-4"
          >
            {/* Status Select */}
            <div className="space-y-2">
              <Label>Status</Label>
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
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="interview_scheduled">Schedule Interview</SelectItem>
                </SelectContent>
              </Select>

              {form.formState.errors.status && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.status.message}
                </p>
              )}
            </div>

            {/* Employer Notes (always shown) */}
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes about this decision..."
                {...form.register("employer_notes")}
                className="min-h-[60px]"
              />
            </div>

            {/* HIRED: Additional Fields */}
            {selectedStatus === "hired" && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Calendar className="size-4" /> Hiring Details
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date <span className="text-red-500">*</span></Label>
                    <Input
                      type="date"
                      {...form.register("start_date")}
                    />
                    {form.formState.errors.start_date && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.start_date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Joining Time</Label>
                    <Input
                      type="time"
                      {...form.register("joining_time")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hiring Notes</Label>
                  <Textarea
                    placeholder="e.g., Please bring your ID and complete onboarding forms"
                    {...form.register("hiring_notes")}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            )}

            {/* INTERVIEW SCHEDULED: Additional Fields */}
            {selectedStatus === "interview_scheduled" && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Clock className="size-4" /> Interview Details
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date <span className="text-red-500">*</span></Label>
                    <Input
                      type="date"
                      {...form.register("scheduled_date")}
                    />
                    {form.formState.errors.scheduled_date && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.scheduled_date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Time <span className="text-red-500">*</span></Label>
                    <Input
                      type="time"
                      {...form.register("scheduled_time")}
                    />
                    {form.formState.errors.scheduled_time && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.scheduled_time.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    {...form.register("duration_minutes", { valueAsNumber: true })}
                  />
                </div>

                {/* Interview Type Toggle */}
                <div className="space-y-2">
                  <Label>Interview Type</Label>
                  <RadioGroup
                    value={interviewType}
                    onValueChange={(value) => form.setValue("interview_type", value as "online" | "offline")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="offline" id="offline" />
                      <Label htmlFor="offline" className="flex items-center gap-1 cursor-pointer">
                        <MapPin className="size-4" /> In-Person
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex items-center gap-1 cursor-pointer">
                        <Video className="size-4" /> Online
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Conditional: Meeting Link or Location */}
                {interviewType === "online" ? (
                  <div className="space-y-2">
                    <Label>Meeting Link <span className="text-red-500">*</span></Label>
                    <Input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      {...form.register("meeting_link")}
                    />
                    {form.formState.errors.meeting_link && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.meeting_link.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="e.g., Office Building A, Room 201"
                      {...form.register("location")}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Interview Notes</Label>
                  <Textarea
                    placeholder="e.g., Please bring your portfolio"
                    {...form.register("interview_notes")}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
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
      <ProfileImage
        src={applicant.profile_photo_url}
        alt={applicant.applicant_name}
        className="h-12 w-12"
      />

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
            variant={getStatusBadgeVariant(applicant.status) as any}
          >
            {applicant.status === "interview_scheduled"
              ? "Interview Scheduled"
              : applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
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
