import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";

type UserCertificatesProps = {
  certificateStatus: string;
  documents: { name: string; icon: string }[];
};

export default function UserCertificates({
  certificateStatus,
  documents,
}: UserCertificatesProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            Certificate
          </h3>
          <div className="flex justify-between items-center p-3 border rounded-md">
            <span>Certificate Status</span>
            <Badge className="bg-black text-white">{certificateStatus}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-gray-600" />
            Uploaded Documents
          </h3>
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">{doc.name}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}