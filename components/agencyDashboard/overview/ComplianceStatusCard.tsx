"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText } from "lucide-react";

interface StatusItem {
  label: string;
  users: number;
  color: string;
  progress: number; // 0–100
}

const complianceData: StatusItem[] = [
  { label: "On-track", users: 6, color: "bg-green-500", progress: 75 },
  { label: "Delayed", users: 1, color: "bg-orange-500", progress: 12 },
  { label: "Non-Compliant", users: 1, color: "bg-red-600", progress: 12 },
];

const activityData = [
  { icon: CheckCircle2, label: "Quiz Completed", count: 6 },
  { icon: FileText, label: "Resumes Done", count: 4 },
];

function ComplianceStatusCard() {
  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Compliance Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bars */}
          <div className="space-y-8">
            {complianceData.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-600 font-semibold">
                    {item.users} users
                  </span>
                </div>
                <Progress value={item.progress} className="h-2">
                  <div
                    className={`h-full rounded-full transition-all ${item.color}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </Progress>
              </div>
            ))}
          </div>

          {/* Activity Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Activity Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              {activityData.map((act) => (
                <div
                  key={act.label}
                  className="flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="text-center space-y-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {act.count}
                    </p>
                    <p className="text-sm text-gray-500">{act.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComplianceStatusCard;
