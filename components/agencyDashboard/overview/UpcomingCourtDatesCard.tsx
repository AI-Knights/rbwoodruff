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

const getStatusVariant = (status: CourtCase["status"]) => {
  switch (status) {
    case "On-track":
      return "bg-black text-white hover:bg-gray-800";
    case "Delayed":
      return "outline outline-orange-600 text-orange-600";
    case "Non-Compliant":
      return "bg-red-600 text-white hover:bg-red-700";
  }
};

export default function UpcomingCourtDatesCard() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-2 pb-4">
        <Calendar className="h-5 w-5 text-gray-600" />
        <CardTitle className="text-lg font-semibold">Upcoming Court Dates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {courtCases.map((item, idx) => (
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
              <Badge className={getStatusVariant(item.status)}>{item.status}</Badge>
              <span className="hidden sm:inline text-sm text-gray-600">{item.date}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}