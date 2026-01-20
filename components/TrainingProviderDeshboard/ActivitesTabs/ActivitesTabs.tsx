"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiSimpleanalytics } from "react-icons/si";
import { IoBusiness } from "react-icons/io5";

import { FiUsers } from "react-icons/fi";
import { useState } from "react";
import LearnerTable from "../LearnerTable/LearnerTable";
import EmployerList from "../EmployerList/EmployerList";
import { MdModelTraining } from "react-icons/md";
import TrainingLists from "../TrainingLists/TrainingLists";
import ProgramAnalytics from "../ProgramAnalytics/ProgramAnalytics";

export default function ActivitesTabs() {
  const tablist = [
    { name: "Learner Overview", icon: <FiUsers className="text-xl" />, value: "learner_overview" },
    {
      name: "Program Analytics",
      icon: <SiSimpleanalytics className="text-xl" />,
      value: "program_analytics",
    },
    {
      name: "Employer Linkages",
      icon: <IoBusiness className="text-xl" />,
      value: "employer_linkages",
    },
    {
      name: "Trainings",
      icon: <MdModelTraining className="text-xl" />,
      value: "trainings",
    },
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="learner_overview" className="w-full space-y-8">
        <div className="w-full">
          <TabsList className="w-full h-auto bg-gray-200 p-1.5 rounded-full grid grid-cols-2 md:grid-cols-4 gap-1">
            {tablist.map((data, index) => (
              <TabsTrigger
                key={index}
                value={data.value}
                className="
                  rounded-full py-3 px-4 flex items-center justify-center gap-2.5
                  text-sm font-medium text-gray-500 transition-all duration-200
                  data-[state=active]:bg-white data-[state=active]:text-gray-900 
                  data-[state=active]:shadow-sm data-[state=active]:font-semibold
                "
              >
                <span>{data.icon}</span>
                <span className="hidden sm:inline-block">{data.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={"learner_overview"} className="mt-0 focus-visible:ring-0">
          <LearnerTable />
        </TabsContent>
        <TabsContent value={"program_analytics"} className="mt-0 focus-visible:ring-0">
          <ProgramAnalytics />
        </TabsContent>
        <TabsContent value={"employer_linkages"} className="mt-0 focus-visible:ring-0">
          <EmployerList />
        </TabsContent>
        <TabsContent value={"trainings"} className="mt-0 focus-visible:ring-0">
          <TrainingLists />
        </TabsContent>
      </Tabs>
    </div>
  );
}
