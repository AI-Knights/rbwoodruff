"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, CheckCircle, Verified, User, Mail, BookOpen, AlertCircle, XCircle } from "lucide-react";
import { LearnerEnrollment } from "@/types/trainer/trainer";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LearnProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleValue: (value: { type: "Accept" | "Reject"; open: boolean }) => void;
}

export default function LearnerProfile({
  data,
  action,
}: {
  data: LearnerEnrollment;
  action: LearnProps;
}) {
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={action.open} onOpenChange={action.setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white">
        {/* Header Section with Color Background */}
        <div className="bg-slate-50 border-b px-6 py-6 flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
            <AvatarImage src="" /> {/* Add profile pic if available in data */}
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {getInitials(data.learner_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {data.learner_name}
            </DialogTitle>
            <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
              <Mail className="h-4 w-4" />
              <span>{data.learner_email}</span>
            </div>
          </div>
          <div className="ml-auto">
            <Badge className={cn("px-3 py-1 capitalize", {
              "bg-blue-100 text-blue-700 hover:bg-blue-100": data.status === "enrolled",
              "bg-purple-100 text-purple-700 hover:bg-purple-100": data.status === "in_progress",
              "bg-green-100 text-green-700 hover:bg-green-100": data.status === "completed",
              "bg-red-100 text-red-700 hover:bg-red-100": data.status === "dropped",
            })}>
              {data.status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Course Details Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Course Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Program Name</p>
                <p className="font-medium text-gray-900">{data.program_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <div className="flex items-center gap-1.5 font-medium text-gray-900 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {data.start_date}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Completion</p>
                  <div className="flex items-center gap-1.5 font-medium text-gray-900 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {data.completion_date || "Ongoing"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Verified className="h-4 w-4" /> Certificate Status
            </h3>

            <div className={cn("rounded-lg border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors", {
              "bg-yellow-50 border-yellow-200": data.certificate_status === "pending",
              "bg-green-50 border-green-200": data.certificate_status === "verified",
              "bg-red-50 border-red-200": data.certificate_status === "rejected",
              "bg-gray-50 border-dashed border-gray-200": !data.certificate_status,
            })}>
              <div className="flex items-start gap-3">
                {data.certificate_status === "pending" && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                {data.certificate_status === "verified" && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                {data.certificate_status === "rejected" && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                {!data.certificate_status && <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />}

                <div>
                  <p className={cn("font-semibold text-sm", {
                    "text-yellow-900": data.certificate_status === "pending",
                    "text-green-900": data.certificate_status === "verified",
                    "text-red-900": data.certificate_status === "rejected",
                    "text-gray-600": !data.certificate_status,
                  })}>
                    {data.certificate_status === "pending" && "Verification Pending"}
                    {data.certificate_status === "verified" && "Certificate Verified"}
                    {data.certificate_status === "rejected" && "Certificate Rejected"}
                    {!data.certificate_status && "No Certificate Uploaded"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {data.certificate_status === "pending" && "This certificate is waiting for your approval."}
                    {data.certificate_status === "verified" && "You have verified this certificate."}
                    {data.certificate_status === "rejected" && "You have rejected this certificate."}
                    {!data.certificate_status && "The learner has not uploaded a certificate yet."}
                  </p>
                </div>
              </div>

              {data.certificate_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 shadow-sm shrink-0"
                  asChild
                >
                  <a href={data.certificate_url} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    View Document
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gray-50 p-6 flex-row justify-between sm:justify-end gap-3 border-t">
          <Button variant="ghost" onClick={() => action.setOpen(false)}>
            Close
          </Button>

          <div className="flex gap-3">
            {/* Reject Action */}
            {(data.certificate_status === "pending" || data.certificate_status === "verified") && (
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
                onClick={() => {
                  action.setOpen(false);
                  action.handleValue({ type: "Reject", open: true });
                }}
                disabled={!data.certificate_id}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            )}

            {/* Verify Action */}
            {(data.certificate_status === "pending" || data.certificate_status === "rejected") && (
              <Button
                className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                onClick={() => {
                  action.setOpen(false);
                  action.handleValue({ type: "Accept", open: true });
                }}
                disabled={!data.certificate_id}
              >
                <Verified className="mr-2 h-4 w-4" />
                Verify Certificate
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
