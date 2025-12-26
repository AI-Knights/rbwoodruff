"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Job } from "@/types/employer/job.type";
import {
  useGetJobCategoriesQuery,
  useUpdateJobMutation,
} from "@/store/api/employerSlice/JobSlice";


const JobEditSchema = z
  .object({
    title: z
      .string()
      .min(3, "Job title must be at least 3 characters")
      .optional(),

    category: z
      .string()
      .min(1, "Please select a category")
      .optional(),

    description: z
      .string()
      .min(50, "Description must be at least 50 characters")
      .optional(),

    requirements: z
      .string()
      .min(10, "Requirements must be detailed")
      .optional(),

    employment_type: z
      .enum(["full_time", "part_time", "contract", "internship"])
      .optional(),

    location: z
      .string()
      .min(2, "Location is required")
      .optional(),

    is_remote: z.boolean().optional(),

    salary_min: z
      .string()
      .refine((val) => /^\d+$/.test(val.trim()), "Only numbers allowed")
      .refine((val) => Number(val) >= 0, "Minimum salary must be ≥ 0")
      .optional(),

    salary_max: z
      .string()
      .refine((val) => /^\d+$/.test(val.trim()), "Only numbers allowed")
      .refine((val) => Number(val) >= 0, "Maximum salary must be ≥ 0")
      .optional(),

    skills_required: z
      .string()
      .min(1, "At least one skill required")
      .optional(),

    deadline: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .optional(),

    number_of_openings: z
      .string()
      .refine((val) => Number(val) >= 1, "Must be ≥ 1")
      .optional(),

    status: z.enum(["active", "closed", "draft"]).optional(),
  })
  .superRefine((data, ctx) => {
    // Salary consistency check (only if both are provided)
    if (data.salary_min !== undefined && data.salary_max !== undefined) {
      const min = Number(data.salary_min);
      const max = Number(data.salary_max);

      if (max < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum salary must be ≥ minimum salary",
          path: ["salary_max"],
        });
      }
    }

    // Location requirement only if is_remote is explicitly false
    if (data.is_remote === false && !data.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location is required for on-site jobs",
        path: ["location"],
      });
    }
  });
type JobEditFormData = z.infer<typeof JobEditSchema>;

interface JobEditFormProps {
  initialData: Job;
  onSuccess?: () => void;
  submitLabel?: string;
}

export default function JobEditForm({
  initialData,
  onSuccess,
  submitLabel = "Update Job",
}: JobEditFormProps) {
  const [updateJob, { isLoading: isSubmitting }] = useUpdateJobMutation();
  const { data: categories, isLoading: loadingCategories } =
    useGetJobCategoriesQuery();

  const form = useForm<JobEditFormData>({
    resolver: zodResolver(JobEditSchema),
    defaultValues: {
      title: initialData.title,
      category: initialData.category,
      description: initialData.description,
      requirements: initialData.requirements,
      employment_type: initialData.employment_type,
      location: initialData.location,
      is_remote: initialData.is_remote,
      salary_min: initialData.salary_min.replace(".00", ""), // clean decimal
      salary_max: initialData.salary_max.replace(".00", ""),
      skills_required: initialData.skills_required.join(", "),
      deadline: initialData.deadline,
      number_of_openings: initialData.number_of_openings.toString(),
      status: initialData.status,
    },
  });

  const isRemote = form.watch("is_remote");

  const onSubmit = async (data: JobEditFormData) => {
    try {
      const payload = {
        title: data.title,
        category: data.category,
        description: data.description,
        requirements: data.requirements,
        employment_type: data.employment_type,
        location: data.location,
        is_remote: data.is_remote,
        salary_min: Number(data.salary_min),
        salary_max: Number(data.salary_max),
        skills_required: data.skills_required
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        deadline: data.deadline,
        number_of_openings: Number(data.number_of_openings),
        status: data.status,
      };

      await updateJob({ id: initialData.id, body: payload }).unwrap();
      toast.success("Job updated successfully!");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update job");
    }
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([8, 9, 27, 46, 13].includes(e.keyCode)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Job Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Job Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Senior Software Engineer"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category & Location Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Job Category <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loadingCategories}
                >
                  <FormControl>
                    <SelectTrigger className="min-h-12 w-full">
                      <SelectValue
                        placeholder={
                          loadingCategories ? "Loading..." : "Select category"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.results.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_remote"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Location Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val === "true")}
                  value={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger className="min-h-12 w-full">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="false">On-site</SelectItem>
                    <SelectItem value="true">Remote</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location (only if on-site) */}
        {!isRemote && (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Job Location <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. San Francisco, CA"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Salary Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="salary_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="120000"
                    className="h-12"
                    {...field}
                    onKeyDown={handleNumberKeyDown}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Salary (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="160000"
                    className="h-12"
                    {...field}
                    onKeyDown={handleNumberKeyDown}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Employment Type & Number of Openings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="employment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Employment Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-h-12 w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number_of_openings"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Number of Openings <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="3"
                    className="h-12"
                    {...field}
                    onKeyDown={handleNumberKeyDown}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Deadline & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center gap-1">
                  Application Deadline <span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Job Status <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-h-12 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Skills */}
        <FormField
          control={form.control}
          name="skills_required"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Required Skills <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Python, Django, PostgreSQL"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Requirements */}
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Requirements <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List key requirements..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Job Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the role, responsibilities, and company culture..."
                  className="min-h-40 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-black hover:bg-gray-800 text-white px-8"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
