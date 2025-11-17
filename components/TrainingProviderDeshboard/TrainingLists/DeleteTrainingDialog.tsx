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
import { Trash2 } from "lucide-react";

interface DeleteTrainingDialogProps {
  trainingName: string;
  onConfirm: (value: boolean) => void;
  children?: React.ReactNode;
}

export default function DeleteTrainingDialog({
  trainingName,
  onConfirm,
  children,
}: DeleteTrainingDialogProps) {
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
            onClick={() => onConfirm(false)}
            className="bg-black hover:bg-gray-900 text-white"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}