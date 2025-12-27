
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGetJobApplicantsQuery } from "@/store/api/adminSlice/EmployerSlice";
import { ApplicantCard } from "@/components/employerDashboard/JobManagement/ApplicantCard";
import JobApplicant from "@/components/employerDashboard/JobManagement/JobApplicant/JobApplicant";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  // if (!job) return <div className="text-center mt-20">No data</div>;

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-[1920px] mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/employer-dashboard/manage-jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Applicants & Hiring</h1>
        </div>

        <div>
          <JobApplicant id={id} />
        </div>
      </div>
    </div>
  );
}
