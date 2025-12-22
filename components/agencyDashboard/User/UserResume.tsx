import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

type UserResumeProps = {
  resumeSections: { title: string; status: "Completed" }[];
};

export default function UserResume({ resumeSections }: UserResumeProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold">Resume Status</h3>
            </div>
            <Badge className="bg-black text-white">Completed</Badge>
          </div>
          <div className="bg-green-50 text-black px-4 py-6 rounded-md border-2 border-green-200">
            Resume has been completed & is ready for job applications.
          </div>
          <Button className="w-full mt-4 bg-black hover:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Download Resume
          </Button>
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
                <Badge className="bg-black text-white">Completed</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}