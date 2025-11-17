"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { auditLogs } from "@/data/audit.data";

const ITEMS_PER_PAGE = 10;

export default function AuditLogsTable() {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination
  const totalPages = Math.ceil(auditLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = auditLogs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="w-full min-h-[calc(100vh-170px)] p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Audit Logs</h2>
          <p className="text-sm text-muted-foreground">
            Track all administrative actions and system activity
          </p>
        </div>

        <div className="bg-white p-4">
          {/* Desktop Table */}
          <div className="hidden md:block rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead className="text-left">Timestamp</TableHead>
                  <TableHead className="text-left">Admin</TableHead>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-left">User</TableHead>
                  <TableHead className="text-left">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm text-gray-600">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">{log.admin}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          log.status === "Downloaded Report"
                            ? "bg-black text-white"
                            : "outline bg-white text-gray-700 border-gray-400"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {paginatedLogs.map((log) => (
              <Card key={log.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                      <h3 className="font-semibold">{log.user}</h3>
                    </div>
                    <Badge
                      className={
                        log.status === "Downloaded Report"
                          ? "bg-black text-white"
                          : "outline text-gray-700 border-gray-400"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin:</span>
                    <span className="font-medium">{log.admin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Details:</span>
                    <span>{log.details}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Pagination – Same as JobSeekersTable */}
          </div>
          <div className="flex justify-center items-center pt-4 gap-2 bg-white">
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
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages || 1, p + 1))
              }
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
