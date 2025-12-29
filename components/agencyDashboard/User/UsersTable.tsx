"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useGetAgencyUsersQuery } from "@/store/api/agencySlice/agencyUsersApiSlice";

const ITEMS_PER_PAGE = 9;

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const [quizFilter, setQuizFilter] = useState<"all" | "true" | "false">("all");
  const [resumeFilter, setResumeFilter] = useState<"all" | "not-started" | "in-progress" | "completed">("all");
  const [complianceFilter, setComplianceFilter] = useState<"all" | "on_track" | "delayed" | "non_compliant">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users = [], isLoading, isError } = useGetAgencyUsersQuery();

  // Client-side filtering
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.case_id.toLowerCase().includes(search.toLowerCase());

      const matchesQuiz =
        quizFilter === "all" ||
        (quizFilter === "true" && user.quiz_status) ||
        (quizFilter === "false" && !user.quiz_status);

      const resumeKey = user.resume_status.toLowerCase().replace(/% complete|\s/g, "").replace("notstarted", "not-started");
      const matchesResume = resumeFilter === "all" || resumeKey.includes(resumeFilter);

      const matchesCompliance =
        complianceFilter === "all" ||
        user.compliance_status.toLowerCase().replace("_", " ") === complianceFilter.replace("_", " ");

      return matchesSearch && matchesQuiz && matchesResume && matchesCompliance;
    });
  }, [users, search, quizFilter, resumeFilter, complianceFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Badge variants
  const getResumeVariant = (status: string) => {
    if (status.includes("Complete") || status.includes("100%")) return "bg-black text-white";
    if (status.includes("Complete") || status.includes("%")) return "outline text-orange-600 border-orange-600";
    if (status === "Not Started") return "bg-gray-200 text-gray-700";
    return "default";
  };

  const getCertificateVariant = (status: string) => {
    if (status.includes("Verified")) return "bg-black text-white";
    if (status.includes("Pending")) return "outline text-yellow-600 border-yellow-600";
    return "bg-gray-200 text-gray-700";
  };

  const getComplianceVariant = (status: string) => {
    return status === "on_track" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const resetPage = () => setCurrentPage(1);

  if (isLoading) return <div className="text-center py-10">Loading users...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Failed to load users</div>;

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)]">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email or case ID"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                className="pl-10"
              />
            </div>

            <Select value={quizFilter} onValueChange={(v) => { setQuizFilter(v as any); resetPage(); }}>
              <SelectTrigger>
                <SelectValue placeholder="Quiz Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quiz Status</SelectItem>
                <SelectItem value="true">Completed</SelectItem>
                <SelectItem value="false">Not Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={resumeFilter} onValueChange={(v) => { setResumeFilter(v as any); resetPage(); }}>
              <SelectTrigger>
                <SelectValue placeholder="Resume Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resume Status</SelectItem>
                <SelectItem value="completed">Completed / High %</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>

            <Select value={complianceFilter} onValueChange={(v) => { setComplianceFilter(v as any); resetPage(); }}>
              <SelectTrigger>
                <SelectValue placeholder="Compliance Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Compliance</SelectItem>
                <SelectItem value="on_track">On Track</SelectItem>
                {/* Add more if backend expands */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              All Users ({filteredUsers.length})
            </h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Job Applications</TableHead>
                  <TableHead>Training Courses</TableHead>
                  <TableHead>Certificates</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.case_id || "-"}</TableCell>
                    <TableCell>
                      <Badge className={user.quiz_status ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}>
                        {user.quiz_status ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getResumeVariant(user.resume_status)}>
                        {user.resume_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.job_applications_count}</TableCell>
                    <TableCell>{user.training_courses_count}</TableCell>
                    <TableCell>
                      <Badge className={getCertificateVariant(user.certificate_status)}>
                        {user.certificate_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getComplianceVariant(user.compliance_status)}>
                        {user.compliance_status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/agency-dashboard/user-roaster/${user.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {paginatedUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">Case: {user.case_id || "-"}</p>
                    </div>
                    <Link href={`/agency-dashboard/user-roaster/${user.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Quiz:</span>
                    <Badge className={user.quiz_status ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"}>
                      {user.quiz_status ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Resume:</span>
                    <Badge className={getResumeVariant(user.resume_status)}>
                      {user.resume_status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Applications:</span>
                    <span>{user.job_applications_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courses:</span>
                    <span>{user.training_courses_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificates:</span>
                    <Badge className={getCertificateVariant(user.certificate_status)}>
                      {user.certificate_status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance:</span>
                    <Badge className={getComplianceVariant(user.compliance_status)}>
                      {user.compliance_status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 pt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}