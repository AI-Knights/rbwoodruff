"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
    useGetScheduledInterviewsQuery,
    useUpdateInterviewMutation,
} from "@/store/api/employerSlice/JobSlice";
import { ProfileImage } from "@/components/shared/ProfileImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Briefcase,
    Calendar,
    Clock,
    Edit2,
    Link,
    LoaderIcon,
    MapPin,
    Video,
    User,
} from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import { Interview } from "@/types/employer/employer.type";

export default function ScheduledInterviewsPage() {
    const { data, isLoading, error } = useGetScheduledInterviewsQuery();
    const [updateInterview, { isLoading: isUpdating }] = useUpdateInterviewMutation();
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const form = useForm({
        defaultValues: {
            scheduled_date: "",
            scheduled_time: "",
            duration_minutes: 30,
            meeting_link: "",
            location: "",
            notes: "",
            status: "scheduled" as Interview["status"],
        },
    });

    // Data is now a direct array (all pages fetched automatically)
    const interviews = data ?? [];

    // Pagination
    const ITEMS_PER_PAGE = 15;
    const totalPages = Math.ceil(interviews.length / ITEMS_PER_PAGE);
    const paginatedInterviews = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return interviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [interviews, currentPage]);

    const handleEdit = (interview: Interview) => {
        setSelectedInterview(interview);
        form.reset({
            scheduled_date: interview.scheduled_date,
            scheduled_time: interview.scheduled_time,
            duration_minutes: interview.duration_minutes,
            meeting_link: interview.meeting_link || "",
            location: interview.location || "",
            notes: interview.notes || "",
            status: interview.status,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = async (values: any) => {
        if (!selectedInterview) return;

        try {
            await updateInterview({
                id: selectedInterview.id,
                body: values,
            }).unwrap();
            toast.success("Interview updated successfully");
            setIsEditOpen(false);
        } catch {
            toast.error("Failed to update interview");
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen p-4">
                <div className="text-center py-10">Loading scheduled interviews...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen p-4">
                <div className="text-center py-10 text-red-500">
                    Error loading interviews
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: Interview["status"]) => {
        switch (status) {
            case "scheduled":
                return <Badge variant="secondary">Scheduled</Badge>;
            case "completed":
                return <Badge variant="success" className="bg-green-100 text-green-800">Completed</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>;
            case "no_show":
                return <Badge variant="outline">No Show</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="w-full min-h-screen p-4">
            <div className="max-w-[1920px] mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Scheduled Interviews</h2>
                    <Badge variant="secondary" className="text-sm">
                        {interviews.length} Total
                    </Badge>
                </div>

                {interviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500">No scheduled interviews.</p>
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
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedInterviews.map((interview) => (
                                        <TableRow key={interview.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <ProfileImage
                                                        src={interview.profile_photo_url}
                                                        alt={interview.applicant_name}
                                                        className="h-10 w-10"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{interview.applicant_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {interview.applicant_email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                    {interview.job_title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {moment(interview.scheduled_date).format("MMM Do, YYYY")}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        {interview.scheduled_time} ({interview.duration_minutes} min)
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {interview.interview_type === "online" ? (
                                                    <div className="flex items-center gap-2">
                                                        <Video className="h-4 w-4 text-blue-500" />
                                                        <a
                                                            href={interview.meeting_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm"
                                                        >
                                                            Online
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{interview.location || "In-Person"}</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(interview.status)}</TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(interview)}
                                                >
                                                    <Edit2 className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {paginatedInterviews.map((interview) => (
                                <Card key={interview.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <ProfileImage
                                                    src={interview.profile_photo_url}
                                                    alt={interview.applicant_name}
                                                    className="h-10 w-10"
                                                />
                                                <div>
                                                    <h3 className="font-semibold">{interview.applicant_name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {interview.job_title}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(interview.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{moment(interview.scheduled_date).format("MMM Do, YYYY")}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{interview.scheduled_time} ({interview.duration_minutes} min)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            {interview.interview_type === "online" ? (
                                                <>
                                                    <Video className="h-4 w-4 text-blue-500" />
                                                    <a
                                                        href={interview.meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Join Meeting
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{interview.location || "In-Person"}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                onClick={() => handleEdit(interview)}
                                            >
                                                <Edit2 className="h-4 w-4 mr-1" />
                                                Edit Interview
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, interviews.length)} of {interviews.length}
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

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Edit Interview</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" {...form.register("scheduled_date")} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Time</Label>
                                    <Input type="time" {...form.register("scheduled_time")} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    {...form.register("duration_minutes", { valueAsNumber: true })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Meeting Link (for online)</Label>
                                <Input
                                    type="url"
                                    placeholder="https://meet.google.com/..."
                                    {...form.register("meeting_link")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Location (for in-person)</Label>
                                <Input
                                    placeholder="Office Building A, Room 201"
                                    {...form.register("location")}
                                />
                            </div>



                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea
                                    placeholder="Any additional notes..."
                                    {...form.register("notes")}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? (
                                        <LoaderIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
