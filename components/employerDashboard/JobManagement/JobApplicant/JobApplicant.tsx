
"use client";
import Image from 'next/image';
import { ApplicantCard } from '../ApplicantCard'
import { useGetJobApplicantsQuery } from '@/store/api/adminSlice/EmployerSlice';
import image from "@/assets/no-data-concept-illustration_86047-488.png"
export default function JobApplicant({ id }: { id: string }) {
  console.log(id)
  const applicantJob = useGetJobApplicantsQuery({ jobId: id });
  console.log(applicantJob)

  if (applicantJob.data?.count === 0) {
    return <div className="text-center w-full bg-white py-20 rounded-tr-4xl rounded-bl-4xl">
      <Image src={image} className='mx-auto ' alt="applicants icon" width={150} height={150} />
      <p className='font-bold'>    No Applicants found for this job</p>
    </div>
  }

  return (
    <div>

      <p className="text-sm text-muted-foreground">

        View all applicants across all jobs
      </p>

      <div className="space-y-4 bg-white py-6 px-6 rounded-2xl">
        <h2 className="text-xl font-semibold mt-8">Applicant List</h2>
        {applicantJob?.data?.results.map((applicant) => (
          <ApplicantCard key={applicant.id} applicant={applicant} />
        ))}
      </div>
    </div>
  )
}
