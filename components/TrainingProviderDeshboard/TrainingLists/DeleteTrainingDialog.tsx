"use client"
// components/DeleteTrainingDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProgrammMutation } from "@/store/api/trainerSlice/trainerSlice";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteTrainingDialogProps {
  trainingName: string;
  onConfirm: (value: boolean) => void;
  children?: React.ReactNode;
  trainingId: string
}

export default function DeleteTrainingDialog({
  trainingName,
  trainingId,
  onConfirm,
  children,
}: DeleteTrainingDialogProps) {
  const [deleteProgramm] = useDeleteProgrammMutation()

  const programmDelete = async () => {
    try {
      const res = await deleteProgramm(trainingId).unwrap();
      toast.success(res.message)
    } catch (e) {
      const error = e as { data: { detail: string } }
      toast.error(error.data.detail)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Delete Training
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Are you sure you want to Delete this training?
            <br />
            <span className="font-medium text-gray-800">"{trainingName}"</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 sm:gap-4">
          <AlertDialogCancel className="border-pink-200 text-pink-700 hover:bg-pink-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              onConfirm(false)
              await programmDelete()
            }}
            className="bg-black hover:bg-gray-900 text-white"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}