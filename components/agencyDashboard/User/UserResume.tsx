import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

type UserResumeProps = {
  resumeSections: { title: string; status: "Completed" | "Incomplete" }[];
};

export default function UserResume({ resumeSections }: UserResumeProps) {
  const isCompleted = resumeSections.every(section => section.status === "Completed");

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold">Resume Status</h3>
            </div>
            <Badge className="bg-black text-white">{isCompleted ? "Completed" : "Incomplete"}</Badge>
          </div>
          <div className={`bg-${isCompleted ? "green" : "yellow"}-50 text-black px-4 py-6 rounded-md border-2 border-${isCompleted ? "green" : "yellow"}-200`}>
            Resume is {isCompleted ? "completed & is ready for job applications." : "incomplete."}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            Resume Sections
          </h3>
          <div className="space-y-3">
            {resumeSections.map((section, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border rounded-md"
              >
                <span className="text-sm">{section.title}</span>
                <Badge className={section.status === "Completed" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}>{section.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}