"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface CourtCase {
  name: string;
  caseId: string;
  date: string;
  status: "On-track" | "Delayed" | "Non-Compliant";
}

const courtCases: CourtCase[] = [
  { name: "Michel Brown", caseId: "CR-2024-2310", date: "9/20/2025", status: "On-track" },
  { name: "Jenier Lopez", caseId: "CR-2024-2310", date: "9/20/2025", status: "Delayed" },
  { name: "David Chen", caseId: "CR-2024-2310", date: "9/20/2025", status: "Non-Compliant" },
  { name: "Lisa anderson", caseId: "CR-2024-2310", date: "9/20/2025", status: "On-track" },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "on_track":
    case "On-track":
      return "bg-black text-white hover:bg-gray-800";
    case "delayed":
    case "Delayed":
      return "outline outline-orange-600 text-orange-600";
    case "non_compliant":
    case "Non-Compliant":
      return "bg-red-600 text-white hover:bg-red-700";
    case "completed":
      return "bg-green-600 text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function UpcomingCourtDatesCard({ data }: { data?: any[] }) {
  const cases = data || [];

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center gap-2 pb-4">
        <Calendar className="h-5 w-5 text-gray-600" />
        <CardTitle className="text-lg font-semibold">Upcoming Court Dates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cases.length > 0 ? (
          cases.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.caseId}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 sm:hidden">{item.date}</span>
                <Badge className={getStatusVariant(item.status)}>{item.status.replace("_", " ")}</Badge>
                <span className="hidden sm:inline text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">No upcoming court dates found.</div>
        )}
      </CardContent>
    </Card>
  );
}