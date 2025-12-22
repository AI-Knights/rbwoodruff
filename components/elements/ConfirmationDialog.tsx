"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  title: string;
  subtitle?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

function ConfirmationDialog({
  subtitle,
  title,
  open,
  setOpen,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-sm text-muted-foreground">{subtitle}</div>

        <DialogFooter className="gap-5 w-fit mx-auto flex flex-row  sm:gap-0">
          <Button className="mx-6" variant="outline" onClick={() => setOpen(false)}>
            No
          </Button>
          <Button
            onClick={() => {
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
