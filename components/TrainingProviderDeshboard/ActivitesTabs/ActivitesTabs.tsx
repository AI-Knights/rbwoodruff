"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiSimpleanalytics } from "react-icons/si";
import { IoBusiness } from "react-icons/io5";

import { FiUsers } from "react-icons/fi";
import { useState } from "react";
import LearnerTable from "../LearnerTable/LearnerTable";
import ProgramAnalytics from "../ProgramAnalytics/ProgramAnalytics";

export default function ActivitesTabs() {
  const tablist = [
    { name: "Learner Overview", icon: <FiUsers />, value: "learner_overview" },
    {
      name: "Program Analytics",
      icon: <SiSimpleanalytics />,
      value: "program_analytics",
    },
    {
      name: "Employer Linkages",
      icon: <IoBusiness />,
      value: "employer_linkages",
    },
  ];

  return (
    <div>
      <div className="w-full p-6">
        <div className=" w-full">
          <Tabs className="w-full " defaultValue="learner_overview">
            <div className="flex flex-row justify-between px-4 py-1 rounded-full w-full bg-gray-200">
              {tablist.map((data, index) => (
                <TabsList className="bg-transparent" key={index}>
                  <TabsTrigger
                    className=" rounded-full p-4 cursor-pointer"
                    value={data.value}
                  >
                    <div className="flex text-xl items-center flex-row gap-2">
                      {data.icon}
                      <p>{data.name}</p>
                    </div>
                  </TabsTrigger>
                </TabsList>
              ))}
            </div>
            <TabsContent value={"learner_overview"} className="mt-6">
              <LearnerTable></LearnerTable>
            </TabsContent>
            <TabsContent value={"program_analytics"} className="mt-6">
              <ProgramAnalytics></ProgramAnalytics>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
