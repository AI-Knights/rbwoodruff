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
import { Calendar, Eye, CheckCircle, Verified } from "lucide-react";

export interface Learner {
  name: string;
  program: string;
  startDate: string;
  status: string;
  certificate: boolean;
}

interface LearnProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleValue: (value: { type: "Accept" | "Reject"; open: boolean }) => void;
}

export default function LearnerProfile({
  data,
  action,
}: {
  data: Learner;
  action: LearnProps;
}) {
  return (
    <Dialog open={action.open} onOpenChange={action.setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-medium text-foreground">Name</p>
                <p className="text-black font-semibold">{data.name}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Program</p>
                <p className="text-black font-semibold">{data.program}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <p className="font-medium text-foreground">Start Date</p>
                <p className="text-black font-semibold flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.startDate}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">End Date</p>
                <p className="text-black font-semibold flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.startDate}
                </p>
              </div>
            </div>
          </div>

         
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              {data.status}
            </Badge>

            {data.certificate && (
              <Button variant="outline" size="sm" asChild>
                <a href="#" target="_blank" rel="noopener">
                  <Eye className="h-4 w-4 mr-1" />
                  View Certificate
                </a>
              </Button>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-center w-fit mx-auto gap-4 mt-4">
          {/* Reject */}
          <Button
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
            onClick={() => {
              action.setOpen(false);
              action.handleValue({ type: "Reject", open: true });
            }}
          >
            Reject
          </Button>

          <Button
            onClick={() => {
              action.setOpen(false);
              action.handleValue({ type: "Accept", open: true });
            }}
          >
             <Verified></Verified>
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
