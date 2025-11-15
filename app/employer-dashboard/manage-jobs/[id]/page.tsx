import { jobs } from "@/data/Job.Data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ApplicantCard } from "@/components/employerDashboard/JobManagement/ApplicantCard";

interface Props {
  params: { id: string };
}

export default async function page({ params }: Props) {
    const {id} = await params
  const job = jobs.find((j) => j.id === id);
  if (!job) return <div>No data</div>

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-[1920px] mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/employer-dashboard/manage-jobs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Applicants & Hiring
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          View all applicants across all jobs
        </p>


        <div className="space-y-4 bg-white py-4 md:py-6 lg:py-8 xl:py-10 px-4 md:px-6 lg:px-8 xl:px-10 rounded-2xl">
        <h2 className="text-xl font-semibold mt-8">Applicant List</h2>
          {job.applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}              
            />
          ))}
        </div>
      </div>
    </div>
  );
}