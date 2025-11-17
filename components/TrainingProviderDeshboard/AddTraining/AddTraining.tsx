// components/AddTraining.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const trainingSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  link: z.string().url("Must be a valid URL").or(z.literal("")),
  duration: z.string().min(1, "Duration is required"),
  deadline: z.date({
    message: "Deadline is required",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

export default function AddTraining() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
  });

  const deadline = watch("deadline");

  const onSubmit = async (data: TrainingFormData) => {
    console.log("Submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Add Training
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Training Program
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-2">
            <Label htmlFor="name">Training Program Name</Label>
            <Input
              id="name"
              placeholder="e.g., Advanced React Mastery"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Training Link</Label>
            <Input
              id="link"
              type="url"
              placeholder="https://example.com/course"
              {...register("link")}
            />
            {errors.link && (
              <p className="text-sm text-red-500">{errors.link.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Training Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 6 weeks"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={(date) =>
                      setValue("deadline", date!, { shouldValidate: true })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.deadline && (
                <p className="text-sm text-red-500">
                  {errors.deadline.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the training program..."
              className="min-h-24 resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 px-10 flex flex-row gap-3 cursor-pointer hover:bg-purple-700"
            >
              <Plus />
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
