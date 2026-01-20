"use client";
import React, { useState } from "react";
import { useGetAuditLogsQuery } from "@/store/api/agencySlice/agencySlice";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 15;

export default function AuditLogsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: logs = [], isLoading, isError } = useGetAuditLogsQuery();

  // Sort by timestamp desc (if not already sorted by backend)
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalPages = Math.ceil(sortedLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) return <div className="text-center py-10">Loading audit logs...</div>;
  if (isError) return <div className="text-center py-10 text-red-600">Failed to load logs</div>;

  const getActionColor = (action: string) => {
    if (action.includes('error') || action.includes('fail')) return "destructive";
    if (action.includes('update')) return "secondary";
    if (action.includes('create') || action.includes('assign')) return "default"; // black
    return "outline";
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
        <p className="text-muted-foreground text-sm">Track all administrative actions.</p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Admin User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap font-medium text-xs">
                    {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionColor(log.action) as any}>
                      {log.action.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.admin_name || log.admin_user}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.ip_address}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">View Data</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Log Details</DialogTitle>
                        </DialogHeader>
                        <pre className="bg-slate-100 p-4 rounded text-xs overflow-auto max-h-[300px]">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
