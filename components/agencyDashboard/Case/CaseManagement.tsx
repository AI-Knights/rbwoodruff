"use client";
import React, { useState } from "react";
import {
    useGetAgencyCasesQuery,
    useUploadCaseCSVMutation,
    useUpdateAgencyCaseMutation,
    useDeleteAgencyCaseMutation,
    type AgencyCaseLoad
} from "@/store/api/agencySlice/agencySlice";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import { Spinner } from "@/components/ui/spinner";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";

const CaseManagement = () => {
    const { data: cases, isLoading, error } = useGetAgencyCasesQuery();
    const [uploadCsv, { isLoading: isUploading }] = useUploadCaseCSVMutation();
    const [updateCase, { isLoading: isUpdating }] = useUpdateAgencyCaseMutation();
    const [deleteCase, { isLoading: isDeleting }] = useDeleteAgencyCaseMutation();

    const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<AgencyCaseLoad | null>(null);
    const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCase) return;

        try {
            const res: any = await updateCase({
                id: editingCase.id,
                data: {
                    case_id: editingCase.case_id,
                    email: editingCase.email,
                    court_name: editingCase.court_name,
                    court_date: editingCase.court_date,
                    status: editingCase.status
                }
            }).unwrap();

            if (res.warning) {
                toast.warning(res.warning);
            } else {
                toast.success("Case updated successfully");
            }
            setEditingCase(null);
        } catch (err: any) {
            toast.error(err?.data?.error || "Failed to update case");
        }
    };

    const handleDelete = async () => {
        if (!deletingCaseId) return;
        try {
            await deleteCase(deletingCaseId).unwrap();
            toast.success("Case deleted successfully");
            setDeletingCaseId(null);
        } catch (err) {
            toast.error("Failed to delete case");
        }
    };

    const handleDownloadSample = () => {
        const headers = ["email", "case_id", "court_name", "court_date", "status"];
        const sampleRow = ["user@example.com", "CASE-001", "City Court", "2025-12-31", "on_track"];
        const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "case_upload_template.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadCsv(formData).unwrap();
            toast.success(
                `Upload Complete: ${result.successful_matches} matched, ${result.failed_matches} pending/failed.`
            );
            if (result.failures && result.failures.length > 0) {
                console.log("Upload Failures:", result.failures);
                toast.warning("Some rows failed. Check console for details.");
            }
            // Reset file input
            e.target.value = "";
        } catch (err: any) {
            toast.error(err?.data?.error || "Failed to upload CSV");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Case Management {cases && cases.length > 0 && <span className="text-muted-foreground ml-2 text-xl font-medium">({cases.length})</span>}
                    </h2>
                    <p className="text-muted-foreground">Manage your case load and assignments.</p>
                </div>

                {/* Bulk Upload Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Bulk Upload Cases</h3>
                        <p className="text-sm text-muted-foreground">Upload a CSV or Excel file to assign cases to users.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => setIsInstructionsOpen(true)} disabled={isUploading}>
                            Download Sample
                        </Button>

                        <Dialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Bulk Upload Instructions</DialogTitle>
                                    <DialogDescription asChild>
                                        <div className="text-muted-foreground text-sm">
                                            Please follow these instructions to prepare your case upload file:
                                            <ul className="list-disc pl-5 mt-4 text-left space-y-2 text-foreground">
                                                <li>Supported formats: <strong>.csv, .xlsx, .xls</strong></li>
                                                <li>Ensure the <strong>column headers</strong> match exactly: email, case_id, court_name, court_date, status.</li>
                                                <li><strong>Email</strong> must be a valid email address. If the user is registered, it will link automatically.</li>
                                                <li>If the user is <strong>Not Registered</strong>, the case will be saved as &quot;Pending&quot; and linked when they sign up.</li>
                                                <li><strong>Court Date</strong> should be in YYYY-MM-DD or MM/DD/YYYY format.</li>
                                                <li><strong>Status</strong> can be: on_track, delayed, non_compliant, completed.</li>
                                            </ul>
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end gap-3 mt-4">
                                    <Button variant="secondary" onClick={() => setIsInstructionsOpen(false)}>Cancel</Button>
                                    <Button onClick={() => { handleDownloadSample(); setIsInstructionsOpen(false); }}>Download CSV Template</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div className="relative">
                            <Button disabled={isUploading} className="pointer-events-none bg-black text-white hover:bg-gray-800">
                                {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4 mr-2" /> Upload File</>}
                            </Button>
                            <input
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-card p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case ID</TableHead>
                            <TableHead>User Email</TableHead>
                            <TableHead>Court Info</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registration</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">Loading cases...</TableCell>
                            </TableRow>
                        ) : cases && cases.length > 0 ? (
                            cases.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{item.case_id}</span>
                                            {item.is_mismatch && (
                                                <span className="text-[10px] text-red-600 bg-red-50 px-1 py-0.5 rounded flex items-center gap-1 mt-1 font-bold">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Mismatch: User has {item.user_reported_case_id}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-xs">{item.court_name}</span>
                                            <span className="text-xs text-muted-foreground">{item.court_date}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === 'on_track' ? 'default' : 'secondary'}>
                                            {item.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.is_registered ? (
                                            <div className="flex items-center text-green-600 gap-1.5">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">Linked ({item.user_name})</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-amber-600 gap-1.5">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">Pending Signup</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingCase(item)}
                                                className="h-8 w-8"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeletingCaseId(item.id)}
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No cases found. Upload a CSV to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Editor Dialog */}
            <Dialog open={!!editingCase} onOpenChange={(open) => !open && setEditingCase(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Case</DialogTitle>
                        <DialogDescription>Update case details.</DialogDescription>
                    </DialogHeader>
                    {editingCase && (
                        <form onSubmit={handleUpdate} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="case_id" className="text-right">Case ID</Label>
                                <Input
                                    id="case_id"
                                    value={editingCase.case_id}
                                    onChange={(e) => setEditingCase({ ...editingCase, case_id: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={editingCase.email}
                                    onChange={(e) => setEditingCase({ ...editingCase, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="court_name" className="text-right">Court</Label>
                                <Input
                                    id="court_name"
                                    value={editingCase.court_name}
                                    onChange={(e) => setEditingCase({ ...editingCase, court_name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="court_date" className="text-right">Date</Label>
                                <Input
                                    id="court_date"
                                    type="date"
                                    value={editingCase.court_date ? String(editingCase.court_date) : ''}
                                    onChange={(e) => setEditingCase({ ...editingCase, court_date: e.target.value || null })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select
                                    value={editingCase.status}
                                    onValueChange={(val) => setEditingCase({ ...editingCase, status: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="on_track">On Track</SelectItem>
                                        <SelectItem value="delayed">Delayed</SelectItem>
                                        <SelectItem value="non_compliant">Non Compliant</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => setEditingCase(null)}>Cancel</Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={!!deletingCaseId} onOpenChange={(open) => !open && setDeletingCaseId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this case and unlink any assigned users.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CaseManagement;
