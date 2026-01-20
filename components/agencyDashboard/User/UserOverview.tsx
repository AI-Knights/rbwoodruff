
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type UserOverviewProps = {
  complianceStatus: string;
  resumeStatus: string;
  jobApplications: number;
  trainingCourses: number;
  timeline: { date: string; event: string; type: "milestone" | "court" }[];
};

export default function UserOverview({
  resumeStatus,
  jobApplications,
  trainingCourses,
  timeline,
}: UserOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600 font-semibold">Resume</span>
              <Badge className="bg-black text-white">{resumeStatus}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600 font-semibold">Job Applications</span>
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {jobApplications}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600 font-semibold">Training Courses</span>
              <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {trainingCourses}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Timeline</h3>
          <div className="relative">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-3 items-start mb-4 last:mb-0">
                <div className="relative">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.type === "court" ? "bg-blue-600" : "bg-green-600"
                    }`}
                  />
                  {i < timeline.length - 1 && (
                    <div className="absolute top-3 left-1.5 w-0.5 h-full bg-gray-300 -z-10" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.event}</p>
                  {item.date && (
                    <p className="text-xs text-gray-500">{item.date}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}