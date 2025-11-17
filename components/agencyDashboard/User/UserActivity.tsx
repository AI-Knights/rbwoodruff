import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

type UserActivityProps = {
  totalApplications: number;
  coursesEnrolled: number;
};

export default function UserActivity({
  totalApplications,
  coursesEnrolled,
}: UserActivityProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold">Jobs & Training Activity</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Job Applications</p>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <span>Total Applications</span>
                <span className="font-bold text-lg">{totalApplications}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Training Courses</p>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <span>Courses Enrolled</span>
                <span className="font-bold text-lg">{coursesEnrolled}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}