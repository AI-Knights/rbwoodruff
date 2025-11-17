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
import { users } from "@/data/AgencyUsers.data";
import Link from "next/link";

const ITEMS_PER_PAGE = 9;

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");
  const [complianceFilter, setComplianceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ──────────────────────────────────────────────────────────────
  // FILTER LOGIC
  // ──────────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.caseId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "yes" && user.quiz === "Yes") ||
        (statusFilter === "no" && user.quiz === "No");

      const matchesTrack =
        trackFilter === "all" ||
        user.resume.toLowerCase().replace(" ", "-") === trackFilter;

      const matchesCompliance =
        complianceFilter === "all" ||
        user.compliance.toLowerCase().replace("-", "") === complianceFilter;

      return (
        matchesSearch && matchesStatus && matchesTrack && matchesCompliance
      );
    });
  }, [search, statusFilter, trackFilter, complianceFilter]);

  // ──────────────────────────────────────────────────────────────
  // PAGINATION
  // ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ──────────────────────────────────────────────────────────────
  // BADGE VARIANTS
  // ──────────────────────────────────────────────────────────────
  const getResumeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-black text-white";
      case "In Progress":
        return "outline text-orange-600 border-orange-600";
      case "Not Started":
        return "bg-gray-200 text-gray-700";
      default:
        return "default";
    }
  };

  const getCertificateVariant = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-black text-white";
      case "Pending":
        return "outline text-yellow-600 border-yellow-600";
      case "None":
        return "bg-gray-200 text-gray-700";
      default:
        return "default";
    }
  };

  return (
    <div className="lg:max-w-2xl xl:max-w-[1920px] mx-auto min-h-[calc(100vh-170px)]">
      <div className="space-y-6">
        {/* ──────── FILTERS ──────── */}
        <div className="bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>

            <Select value={trackFilter} onValueChange={setTrackFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Tracks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={complianceFilter}
              onValueChange={setComplianceFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Compliance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Compliance</SelectItem>
                <SelectItem value="ontrack">On-track</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="noncompliant">Non-Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white p-4">
          {/* ──────── RESULT COUNT ──────── */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              All Users ({filteredUsers.length})
            </h2>
          </div>

          {/* ──────── DESKTOP TABLE (shadcn) ──────── */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-left">User Name</TableHead>
                  <TableHead className="text-left">Case ID</TableHead>
                  <TableHead className="text-left">Quiz</TableHead>
                  <TableHead className="text-left">Resume</TableHead>
                  <TableHead className="text-left">Job Activity</TableHead>
                  <TableHead className="text-left">Training</TableHead>
                  <TableHead className="text-left">Certificate</TableHead>
                  <TableHead className="text-left">Compliance</TableHead>
                  <TableHead className="text-left">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.caseId}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.quiz === "Yes"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }
                      >
                        {user.quiz}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getResumeVariant(user.resume)}>
                        {user.resume}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.jobApplications} applications</TableCell>
                    <TableCell>{user.courses} Courses</TableCell>
                    <TableCell>
                      <Badge
                        className={getCertificateVariant(user.certificate)}
                      >
                        {user.certificate}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-black text-white">
                        {user.compliance}
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

          {/* ──────── MOBILE CARDS ──────── */}
          <div className="md:hidden space-y-4">
            {paginatedUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.caseId}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Quiz:</span>
                    <Badge
                      className={
                        user.quiz === "Yes"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }
                    >
                      {user.quiz}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Resume:</span>
                    <Badge className={getResumeVariant(user.resume)}>
                      {user.resume}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Job Activity:</span>
                    <span>{user.jobApplications} applications</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training:</span>
                    <span>{user.courses} Courses</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificate:</span>
                    <Badge className={getCertificateVariant(user.certificate)}>
                      {user.certificate}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance:</span>
                    <Badge className="bg-black text-white">
                      {user.compliance}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ──────── PAGINATION (TrainerTable style) ──────── */}
          <div className="flex justify-center items-center gap-2 pt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
