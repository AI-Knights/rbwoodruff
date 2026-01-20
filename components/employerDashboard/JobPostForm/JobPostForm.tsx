"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useCreateJobMutation,
  useGetJobCategoriesQuery,
} from "@/store/api/employerSlice/JobSlice";
import { JobFormData, JobFormSchema } from "@/schema/employer/employer.schema";

import { read, utils, writeFile } from "xlsx";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function JobPostForm() {
  const [createJob, { isLoading: isSubmitting }] = useCreateJobMutation();
  const { data: categories, isLoading: loadingCategories } =
    useGetJobCategoriesQuery();

  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const form = useForm<JobFormData>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      requirements: "",
      employment_type: "full_time",
      location: "",
      is_remote: false,
      salary_min: "",
      salary_max: "",
      skills_required: "",
      deadline: "",
      number_of_openings: "1",
      status: "active",
    },
  });

  const isRemote = form.watch("is_remote");

  // Sample CSV Download
  const generateAndDownloadTemplate = () => {
    const headers = [
      {
        title: "Factory Machine Operator",
        "Category Name": "Technician",
        description: "Operate machinery...",
        requirements: "High school diploma...",
        employment_type: "full_time",
        location: "Phoenix, AZ",
        is_remote: "false",
        salary_min: 38000,
        salary_max: 52000,
        skills_required: "Driving, Time Management",
        deadline: "2025-04-12",
        number_of_openings: 3,
        status: "active"
      }
    ];

    const ws = utils.json_to_sheet(headers);

    // Set column widths
    ws["!cols"] = [
      { wch: 25 }, // title
      { wch: 20 }, // Category Name
      { wch: 40 }, // description
      { wch: 40 }, // requirements
      { wch: 15 }, // employment_type
      { wch: 15 }, // location
      { wch: 10 }, // is_remote
      { wch: 12 }, // salary_min
      { wch: 12 }, // salary_max
      { wch: 30 }, // skills_required
      { wch: 12 }, // deadline
      { wch: 10 }, // number_of_openings
      { wch: 10 }, // status
    ];

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Template");

    writeFile(wb, "job_post_template.xlsx");
  };

  // Bulk Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBulkUploading(true);
    setUploadProgress({ current: 0, total: 0 });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const wb = read(arrayBuffer);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data: any[] = utils.sheet_to_json(ws);

      if (data.length === 0) {
        toast.error("File is empty");
        return;
      }

      setUploadProgress({ current: 0, total: data.length });

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // Determine Category Payload
          // Check for "Category Name" column or legacy "category"/"Category" columns
          const categoryNameInput = row["Category Name"] || row["category_name"] || row["Category"] || row["category"];

          let categoryIdPayload = undefined;
          let categoryNamePayload = undefined;

          if (categoryNameInput) {
            const valStr = String(categoryNameInput).trim();
            // Simple heuristic: UUIDs have dashes and are long (36 chars)
            if (valStr.length === 36 && valStr.split('-').length === 5) {
              categoryIdPayload = valStr;
            } else {
              categoryNamePayload = valStr;
            }
          }

          // Map CSV row to Payload
          const payload: any = {
            title: row.title,
            category: categoryIdPayload,
            category_name: categoryNamePayload,
            description: row.description,
            requirements: row.requirements,
            employment_type: row.employment_type || "full_time",
            location: row.location || "",
            is_remote: String(row.is_remote).toLowerCase() === "true" || row.is_remote === true,
            salary_min: Number(row.salary_min) || 0,
            salary_max: Number(row.salary_max) || 0,
            skills_required: String(row.skills_required || "").split(",").map((s: string) => s.trim()).filter(Boolean),
            deadline: row.deadline, // Ensure defined format or process date
            number_of_openings: Number(row.number_of_openings) || 1,
            status: row.status || "active",
          };

          await createJob(payload).unwrap();
          successCount++;
        } catch (err: any) {
          console.error(`Row ${i + 1} failed:`, err);
          if (err?.status === 403) {
            toast.error(`Row ${i + 1}: Account not verified. Only verified employers can post jobs.`);
          } else {
            toast.error(`Row ${i + 1}: ${err?.data?.detail || "Failed to create job"}`);
          }
          failCount++;
        }

        setUploadProgress(prev => ({ ...prev, current: i + 1 }));
      }

      toast.success(`Bulk upload complete: ${successCount} created, ${failCount} failed.`);
      if (failCount > 0) {
        toast.warning("Some jobs failed to upload. Please check your verification status.");
      }

      if (successCount > 0 && failCount === 0) {
        // Optional: e.target.value = "" to reset input
      }

    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("Failed to process file");
    } finally {
      setIsBulkUploading(false);
      // Reset input value roughly
      e.target.value = "";
    }
  };


  const onSubmit = async (data: JobFormData) => {
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

      await createJob(payload).unwrap();
      toast.success("Job posted successfully!");
      form.reset();
    } catch (err: any) {
      const error = err as { status?: number; data?: { detail?: string } };

      if (error?.status === 403) {
        toast.error("Permission Denied: Your employer account is not verified yet. Please wait for admin approval.");
      } else {
        toast.error(error?.data?.detail || "Failed to post job");
      }
    }
  };

  const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([8, 9, 27, 46, 13].includes(e.keyCode)) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Bulk Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bulk Upload Jobs</h3>
            <p className="text-sm text-muted-foreground">Upload a CSV or Excel file to create multiple jobs at once.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setIsInstructionsOpen(true)} disabled={isBulkUploading}>
              Download Sample
            </Button>
            <Dialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Bulk Upload Instructions</DialogTitle>
                  <DialogDescription>
                    Please follow these instructions to prepare your bulk upload file:
                    <ul className="list-disc pl-5 mt-4 text-left space-y-2 text-foreground">
                      <li>Ensure the <strong>column headers</strong> in your file match exactly with the headers in the sample template.</li>
                      <li>For <strong>&apos;Category Name&apos;</strong>, please use the exact names of active categories available on the platform.</li>
                      <li>You can check the available categories in the <strong>Job Category</strong> dropdown menu on the &quot;Post a New Job&quot; form above.</li>
                      <li>If a provided category name does not match any existing category, the job will be automatically assigned to the <strong>&apos;Other&apos;</strong> category.</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6">
                  <Button variant="secondary" onClick={() => setIsInstructionsOpen(false)}>Cancel</Button>
                  <Button onClick={() => { generateAndDownloadTemplate(); setIsInstructionsOpen(false); }}>Download Template</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <Button disabled={isBulkUploading} className="pointer-events-none bg-black text-white">
                {isBulkUploading ? "Uploading..." : "Upload CSV/Excel"}
              </Button>
              <Input
                type="file"
                accept=".csv, .xlsx, .xls"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={handleFileUpload}
                disabled={isBulkUploading}
              />
            </div>
          </div>
        </div>

        {isBulkUploading && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing jobs... {uploadProgress.current} / {uploadProgress.total}</span>
              <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
            </div>
            <Progress value={(uploadProgress.current / uploadProgress.total) * 100} className="h-2" />
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 bg-white px-4 md:px-6 lg:px-9 py-4 md:py-6 lg:py-9"
          >
            <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>

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
                              loadingCategories
                                ? "Loading..."
                                : "Select category"
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
            {/* Deadline */}
            <div className="flex w-full gap-3">
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="flex items-center gap-1">
                        Application Deadline{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-12 w-full pl-3 text-left font-normal",
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
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : ""
                              )
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
              </div>

              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="flex items-center gap-1">
                        Location <span className="text-red-500">*</span>
                      </FormLabel>

                      <Input
                        placeholder="e.g. Dhaka, Remote"
                        className="h-12 w-full"
                        {...field}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                {isSubmitting ? "Publishing..." : "Publish Job"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
