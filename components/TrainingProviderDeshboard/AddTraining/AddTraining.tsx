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

import {
  useAllCategorysQuery,
  useCreateProgrammMutation,
} from "@/store/api/trainerSlice/trainerSlice";

import { toast } from "sonner";

/* ---------------- Schema ---------------- */

const trainingSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  external_link: z.string().url("Must be a valid URL").or(z.literal("")),
  duration: z.coerce.number().min(1, "Duration is required"),
  duration_unit: z.enum(["hours", "days", "weeks"]),
  deadline: z.date({ message: "Deadline is required" }),
  is_active: z.boolean(),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

/* ---------------- Component ---------------- */

export default function AddTraining() {
  const [createProgram] = useCreateProgrammMutation();
  const { data, isLoading } = useAllCategorysQuery();

  const form = useForm({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      duration_unit: "hours",
      is_active: true,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const deadline = watch("deadline");

  const onSubmit = async (data: TrainingFormData) => {
    const payload = {
      name: data.name,
      description: data.description,
      category: data.category,
      external_link: data.external_link,
      deadline: format(data.deadline, "yyyy-MM-dd"),
      duration: data.duration,
      duration_unit: data.duration_unit,
      is_active: data.is_active,
    };
    console.log(payload)

    try {
      const res = await createProgram(payload).unwrap();
      toast.success(`${res.name} program created`);
      reset();
    } catch (e) {
      const error = e as { data?: { description?: string } };
      toast.error(error?.data?.description || "Something went wrong");
    }
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
          {/* Name */}
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

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>

            <select
              id="category"
              className="w-full border rounded-md px-3 py-2"
              defaultValue=""
              {...register("category")}
            >
              <option value="" disabled>
                {isLoading ? "Loading categories..." : "Select a category"}
              </option>

              {data?.results?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {errors.category && (
              <p className="text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* External Link */}
          <div className="space-y-2">
            <Label htmlFor="external_link">Training Link</Label>
            <Input
              id="external_link"
              type="url"
              placeholder="https://training-platform.com/course"
              {...register("external_link")}
            />
            {errors.external_link && (
              <p className="text-sm text-red-500">
                {errors.external_link.message}
              </p>
            )}
          </div>

          {/* Duration + Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 120"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {/* Deadline */}
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
                      setValue("deadline", date!, {
                        shouldValidate: true,
                      })
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

          {/* Duration Unit */}
          <div className="space-y-2">
            <Label>Duration Unit</Label>
            <select
              className="w-full border rounded-md px-3 py-2"
              {...register("duration_unit")}
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
            </select>
            {errors.duration_unit && (
              <p className="text-sm text-red-500">
                {errors.duration_unit.message}
              </p>
            )}
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

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 px-10 flex gap-3 hover:bg-purple-700"
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
