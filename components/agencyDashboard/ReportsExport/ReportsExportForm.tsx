"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Download, FileText, Search, ChevronsUpDown, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useGetAgencyUsersQuery, useLazyGetUserReportQuery } from "@/store/api/agencySlice/agencyUsersApiSlice";
import { jsPDF } from "jspdf"; // Import jsPDF to generate PDF

// Zod Schema
const formSchema = z.object({
  userId: z.string().min(1, "Please select a user"), // Only userId is required
});

export default function ReportsExportForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  // Fetch users from API
  const { data: users } = useGetAgencyUsersQuery();

  // Lazy load the user report when needed
  const [getUserReport, { data: userReport, isLoading, error }] =
    useLazyGetUserReportQuery();

  // Handle form submission
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    const { userId } = formData;
    try {
      // Trigger API call to fetch user report data
      const response = await getUserReport(userId).unwrap();
      console.log("User Report:", response);

      // Check if we have a valid user report
      if (response) {
        // Create PDF after getting the user data from API response
        createPDF(response);
      } else {
        alert("Failed to fetch user report or report is empty.");
      }
    } catch (err) {
      console.error("Error fetching user report:", err);
      alert("Error fetching user report.");
    }
  };

  // Function to create a beautiful, colorful PDF using jsPDF
  const createPDF = (userReport: any) => {
    const doc = new jsPDF();

    // Set custom font and size for title and body
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102); // Blue color for title

    // Title
    doc.setFontSize(22);
    doc.text("User Report", 105, 20, { align: "center" });

    // Set a line break
    doc.setFontSize(12);

    // Add a colorful header background
    doc.setFillColor(0, 51, 102); // Dark blue color
    doc.setTextColor(255, 255, 255); // White text for header
    doc.text(`Report for ${userReport.user_info.full_name}`, 105, 35, { align: "center" });

    // Adding a line separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 51, 102);
    doc.line(10, 40, 200, 40);

    // Start filling the content
    let yOffset = 50; // Starting y position for content

    // User Info Section
    doc.setTextColor(0, 0, 0); // Black text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("User Information:", 20, yOffset);
    yOffset += 10;

    // Fill in user info
    doc.setFontSize(12);
    doc.text(`Full Name: ${userReport.user_info.full_name}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Email: ${userReport.user_info.email}`, 20, yOffset);
    yOffset += 10;
    doc.text(`User Type: ${userReport.user_info.user_type}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Date Joined: ${new Date(userReport.user_info.date_joined).toLocaleDateString()}`, 20, yOffset);
    yOffset += 20; // Add extra space after the user info

    // Referred User Info Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102); // Dark blue for section title
    doc.text("Referred User Information:", 20, yOffset);
    yOffset += 10;

    // Fill in referred user info
    doc.setFontSize(12);
    doc.text(`Case ID: ${userReport.referred_user_info.case_id}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Court Name: ${userReport.referred_user_info.court_name}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Phone: ${userReport.referred_user_info.phone_number}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Has Paid: ${userReport.referred_user_info.has_paid ? "Yes" : "No"}`, 20, yOffset);
    yOffset += 20;

    // Summary Stats Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text("Summary Statistics:", 20, yOffset);
    yOffset += 10;

    // Fill in summary stats
    doc.setFontSize(12);
    doc.text(`Total Trainings: ${userReport.summary_stats.total_trainings}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Completed Trainings: ${userReport.summary_stats.completed_trainings}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Total Certificates: ${userReport.summary_stats.total_certificates}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Total Skills: ${userReport.summary_stats.total_skills}`, 20, yOffset);

    // Add footer with a background
    doc.setFillColor(0, 51, 102); // Blue footer
    doc.rect(10, 290, 190, 20, "F"); // Footer rectangle
    doc.setTextColor(255, 255, 255); // White text for footer
    doc.text("Generated by NEWORKX", 105, 295, { align: "center", });

    // Save the PDF with a filename (e.g., `user_report.pdf`)
    doc.save(`${userReport.user_info.full_name}_report.pdf`);
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
        </CardHeader>

        <CardContent className="space-y-9">
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Select User with Search */}
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select User</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={cn(
                              "w-full justify-between bg-gray-50",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? users?.find((user) => user.id === field.value)?.name
                              : "Select user..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <UserSearchList
                          users={users || []}
                          onSelect={(userId) => {
                            form.setValue("userId", userId);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-800 text-white"
                size="lg"
                disabled={isLoading} // Disable the button if API is loading
              >
                <Download className="h-4 w-4 mr-2" />
                Download User Report (PDF)
              </Button>
            </form>
          </Form>

          {/* Loading or error message */}
          {isLoading && <p>Loading user report...</p>}
          {error && <p>Error fetching user report: {error.message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function UserSearchList({ users, onSelect }: { users: any[], onSelect: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.case_id && user.case_id.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          placeholder="Search name, email, case ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 border-0 focus-visible:ring-0 px-0 shadow-none ring-0 outline-none"
        />
      </div>
      <div className="max-h-[300px] overflow-y-auto p-1">
        {filteredUsers.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground text-center">No users found.</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded-sm text-sm"
              onClick={() => onSelect(user.id)}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.email} • {user.case_id || "No Case ID"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
