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
      const error = e as { status?: number; data?: { description?: string } };

      // Handle unverified trainer error
      if (error?.status === 403) {
        toast.error("Permission Denied: Your training provider account is not verified yet. Please wait for admin approval.");
      } else {
        toast.error(error?.data?.description || "Something went wrong");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Add Program
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Create Program
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="name" className="text-base font-medium">Program Name</Label>
              <Input
                id="name"
                placeholder="e.g., Professional Web Development Bootcamp"
                className="h-11"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="font-medium">Category</Label>
              <select
                id="category"
                className="w-full border border-input bg-background rounded-md px-3 h-11 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("category")}
              >
                <option value="" disabled>Select Category</option>
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
              <Label htmlFor="external_link" className="font-medium">Program Link (URL)</Label>
              <Input
                id="external_link"
                type="url"
                placeholder="https://..."
                className="h-11"
                {...register("external_link")}
              />
              {errors.external_link && (
                <p className="text-sm text-red-500">
                  {errors.external_link.message}
                </p>
              )}
            </div>

            {/* Duration Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="font-medium">Duration Value</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="12"
                  className="h-11"
                  {...register("duration")}
                />
                {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Unit</Label>
                <select
                  className="w-full border border-input bg-background rounded-md px-3 h-11 text-sm"
                  {...register("duration_unit")}
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label className="font-medium">Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50">
                  <div className="pointer-events-auto">
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
                  </div>
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
            <Label htmlFor="description" className="font-medium pb-1 block">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of what learners will gain..."
              className="min-h-32 resize-none text-base p-4 leading-relaxed"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 h-11 hover:bg-gray-800 transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
