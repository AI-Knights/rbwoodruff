"use client";

import { useState, useMemo } from "react";
import { useGetHiredApplicantsQuery } from "@/store/api/employerSlice/JobSlice";
import { ProfileImage } from "@/components/shared/ProfileImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin, Mail, User } from "lucide-react";
import moment from "moment";

const ITEMS_PER_PAGE = 15;

export default function HiredApplicantsPage() {
    const { data, isLoading, error } = useGetHiredApplicantsQuery();
    const [currentPage, setCurrentPage] = useState(1);

    const hiredApplicants = data ?? [];

    const totalPages = Math.ceil(hiredApplicants.length / ITEMS_PER_PAGE);
    const paginatedApplicants = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return hiredApplicants.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [hiredApplicants, currentPage]);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen p-4">
                <div className="text-center py-10">Loading hired applicants...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen p-4">
                <div className="text-center py-10 text-red-500">
                    Error loading hired applicants
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4">
            <div className="max-w-[1920px] mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Hired Applicants</h2>
                    <Badge variant="secondary" className="text-sm">
                        {hiredApplicants.length} Total
                    </Badge>
                </div>

                {hiredApplicants.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500">No hired applicants yet.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden p-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Job Position</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Hired Date</TableHead>
                                        <TableHead>Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedApplicants.map((applicant) => (
                                        <TableRow key={applicant.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <ProfileImage
                                                        src={applicant.profile_photo_url}
                                                        alt={applicant.applicant_name}
                                                        className="h-10 w-10"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{applicant.applicant_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {applicant.applicant_email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                    {applicant.job_title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    {applicant.job_location}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {moment(applicant.hired_at).format("MMM Do, YYYY")}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {applicant.employer_notes || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {paginatedApplicants.map((applicant) => (
                                <Card key={applicant.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <ProfileImage
                                                src={applicant.profile_photo_url}
                                                alt={applicant.applicant_name}
                                                className="h-12 w-12"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{applicant.applicant_name}</h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {applicant.applicant_email}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                                            <span>{applicant.job_title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>{applicant.job_location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>Hired: {moment(applicant.hired_at).format("MMM Do, YYYY")}</span>
                                        </div>
                                        {applicant.employer_notes && (
                                            <p className="text-sm text-muted-foreground pt-2 border-t">
                                                {applicant.employer_notes}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, hiredApplicants.length)} of {hiredApplicants.length}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3"
                                    >
                                        ← Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3"
                                    >
                                        Next →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

