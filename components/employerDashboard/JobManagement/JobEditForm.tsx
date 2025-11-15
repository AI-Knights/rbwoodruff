// src/components/JobEditForm.tsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Job } from "@/types/job.type";

const jobPostSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
  jobCategory: z.string().min(1, "Please select a job category"),
  locationType: z.string().min(1, "Please select a location type"),
  salaryMin: z.string().regex(/^\d+$/, "Must be a valid number"),
  salaryMax: z.string().regex(/^\d+$/, "Must be a valid number"),
  employmentType: z.string().min(1, "Please select employment type"),
  requiredSkills: z.string().min(5, "List at least one skill"),
  requirements: z.string().min(10, "Requirements must be detailed"),
  jobDescription: z.string().min(50, "Description must be at least 50 characters"),
  applicationDeadline: z.date(),
  numberOfOpenings: z.string().regex(/^\d+$/, "Must be a valid number").min(1, "At least 1 opening"),
});

type JobEditFormData = z.infer<typeof jobPostSchema>;

interface JobEditFormProps {
  initialData?: Job;
  onSuccess?: () => void;
  submitLabel?: string;
}

export default function JobEditForm({ initialData, onSuccess, submitLabel = "Publish Job" }: JobEditFormProps) {
  const form = useForm<JobEditFormData>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: initialData
      ? {
          jobTitle: initialData.jobTitle,
          jobCategory: initialData.jobCategory.toLowerCase().replace(" & ", "-"),
          locationType: initialData.locationType,
          salaryMin: initialData.salaryMin,
          salaryMax: initialData.salaryMax,
          employmentType: initialData.employmentType,
          requiredSkills: initialData.requiredSkills,
          requirements: initialData.requirements,
          jobDescription: initialData.jobDescription,
          applicationDeadline: initialData.applicationDeadline,
          numberOfOpenings: initialData.numberOfOpenings,
        }
      : {
          jobTitle: "",
          jobCategory: "",
          locationType: "",
          salaryMin: "",
          salaryMax: "",
          employmentType: "",
          requiredSkills: "",
          requirements: "",
          jobDescription: "",
          numberOfOpenings: "1",
        },
  });

  const onSubmit = async (data: JobEditFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success(initialData ? "Job updated!" : "Job posted!");
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Same form fields as before... */}
        {/* (Copy all FormField blocks from previous version) */}
        {/* Only change: use `submitLabel` */}
         {/* Job Title */}
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Job Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Frontend Developer" className="h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Job Category & Location Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="jobCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Job Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Location Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Remote, On-site, Hybrid" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="on-site">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Salary Range & Employment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="salaryMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Salary Range <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="Min"
                          className="h-12"
                          {...field}
                        />
                        <span className="text-gray-500">—</span>
                        <Input
                          type="text"
                          placeholder="Max"
                          className="h-12"
                          {...form.register("salaryMax")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Employment Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Full-time, Part-time, etc." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Required Skills */}
            <FormField
              control={form.control}
              name="requiredSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Required Skills <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. React, TypeScript, Node.js"
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
              name="jobDescription"
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

            {/* Application Deadline & Number of Openings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="applicationDeadline"
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
                              format(field.value, "PPP")
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
                          selected={field.value}
                          onSelect={field.onChange}
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
                name="numberOfOpenings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Number of Openings <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. 3"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-black hover:bg-gray-800 text-white px-8"
          >
            {form.formState.isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}