"use client";

import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserIcon } from "lucide-react";
import UserOverview from "./UserOverview";
import UserResume from "./UserResume";
import UserActivity from "./UserActivity";
import { useGetUserDetailsQuery } from '@/store/api/agencySlice/agencyUsersApiSlice';

interface UserDetailsProps {
  id?: string;
}

export default function UserDetails({ id: propId }: UserDetailsProps) {
  const params = useParams();
  const userId = propId || params.id as string;

  const { data, isLoading, error } = useGetUserDetailsQuery(userId);

  if (isLoading) {
    return <div className="p-8 text-center">Loading user details...</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-center">Failed to load user details</div>;
  }

  const user = data.case_details;
  const timeline = data.timeline.map(item => ({
    date: item.event_date,
    event: item.description,
    type: (item.event_type.includes('court') ? 'court' : 'milestone') as "court" | "milestone"
  }));

  const resumeSections = [
    { title: "Contact Info", status: (data.resume?.contact_info ? "Completed" : "Incomplete") as "Completed" | "Incomplete" },
    { title: "Work Experience", status: (data.resume?.work_experience ? "Completed" : "Incomplete") as "Completed" | "Incomplete" },
    { title: "Skills", status: (data.resume?.skills ? "Completed" : "Incomplete") as "Completed" | "Incomplete" },
  ];

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-[1920px] mx-auto space-y-6 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">

        {/* User Info Sidebar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.user_name}</h2>
              <Badge className="bg-green-600 text-white">{user.compliance_status}</Badge>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Case ID</p>
              <p className="font-medium">{user.case_id}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user.user_email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full col-span-1 md:col-span-2 xl:col-span-4">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 border-2 rounded-full bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white rounded-full h-9">
              Overview
            </TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-white rounded-full h-9">
              Resume
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white rounded-full h-9">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <UserOverview
              complianceStatus={user.compliance_status}
              resumeStatus={`${data.resume?.resume_completeness || 0}% Complete`}
              jobApplications={data.applications_count}
              trainingCourses={data.enrollments_count}
              timeline={timeline}
            />
          </TabsContent>

          <TabsContent value="resume" className="mt-6">
            <UserResume resumeSections={resumeSections} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <UserActivity
              totalApplications={data.applications_count}
              coursesEnrolled={data.enrollments_count}
            />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}