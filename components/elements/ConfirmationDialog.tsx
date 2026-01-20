"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  title: string;
  subtitle?: string;
  open: boolean;
  action: string;
  setOpen: (open: boolean) => void;
  onConfirm?: () => void;
}

function ConfirmationDialog({
  subtitle,
  action,
  title,
  open,
  setOpen,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className={cn("py-4 text-sm text-muted-foreground", action === "Reject" ? "text-red-500" : "")}>{subtitle}</div>

        <DialogFooter className="gap-5 w-fit mx-auto flex flex-row  sm:gap-0">
          <Button className="mx-6" variant="outline" onClick={() => setOpen(false)}>
            No
          </Button>
          <Button
            onClick={() => {
              if (onConfirm) onConfirm();
              setOpen(false);
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
