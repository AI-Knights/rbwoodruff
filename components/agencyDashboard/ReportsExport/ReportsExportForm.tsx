"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod Schema
const formSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  reportType: z.string().min(1, "Please select a report type"),
});

// Dummy users (replace with real data later)
const users = [
  { id: "1", name: "Marcus Johnson" },
  { id: "2", name: "Sarah Williams" },
  { id: "3", name: "David Chen" },
  { id: "4", name: "Jenifer Lopez" },
  { id: "5", name: "Robert Taylor" },
];

const reportTypes = [
  "Progress Report",
  "Compliance Report",
  "Activity Summary",
  "Training Log",
];

export default function ReportsExportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      reportType: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
    // Handle PDF generation here
    alert(
      `Generating ${data.reportType} for ${
        users.find((u) => u.id === data.userId)?.name
      }`
    );
  };

  const handleCSVExport = () => {
    alert("Downloading CSV file for all users...");
    // Add CSV logic
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <h3 className="flex items-center gap-4">
              <FileText className="h-5 w-5" />
              Single User Report
            </h3>
          </CardTitle>
          {/* CSV Export Button */}
        </CardHeader>

        <CardContent className="space-y-9">
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Single User Report Title */}

              {/* Select User */}
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-50 w-full">
                          <SelectValue placeholder="Choose a user..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button (PDF) */}
              <Button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-800 text-white"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download User Report (PDF)
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
