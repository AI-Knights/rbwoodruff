"use client";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {UserIcon } from "lucide-react";
import UserOverview from "./UserOverview";
import UserResume from "./UserResume";
import UserActivity from "./UserActivity";
import UserCertificates from "./UserCertificates";
import { userDetails } from "@/data/UserDetails.data";

interface UserDetailsProps{
    id: string
}

export default function UserDetails({id}:UserDetailsProps) {
  const user = userDetails.find((u) => u.id === "1");

  if (!user) {
    return <div className="p-8 text-center">User not found</div>;
  }

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
              <h2 className="text-xl font-bold">{user.name}</h2>
              <Badge className="bg-green-600 text-white">Active</Badge>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Case ID</p>
              <p className="font-medium">{user.caseId}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full col-span-1 md:col-span-2 xl:col-span-4">
          <TabsList className="grid w-full grid-cols-4 h-auto px-4 py-4 border-2 rounded-full bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white rounded-full h-10">
              Overview
            </TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-white py-4 rounded-full h-10">
              Resume
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white py-4 rounded-full h-10">
              Activity
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-white py-4 rounded-full h-10">
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <UserOverview
              complianceCompletion={user.complianceCompletion}
              complianceStatus={user.complianceStatus}
              quizStatus={user.quizStatus}
              resumeStatus={user.resumeStatus}
              jobApplications={user.jobApplications}
              trainingCourses={user.trainingCourses}
              timeline={user.timeline}
            />
          </TabsContent>

          <TabsContent value="resume" className="mt-6">
            <UserResume resumeSections={user.resumeSections} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <UserActivity
              totalApplications={user.totalApplications}
              coursesEnrolled={user.coursesEnrolled}
            />
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <UserCertificates
              certificateStatus={user.certificateStatus}
              documents={user.documents}
            />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}