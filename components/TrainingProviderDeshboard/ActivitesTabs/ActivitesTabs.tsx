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
    {
      name: "Trainings",
      icon: <MdModelTraining />,
      value: "trainings",
    },
  ];

  return (
    <div>
      <div className="w-full ">
        <div className=" w-full">
          <Tabs className="w-full " defaultValue="learner_overview">
            <div className="flex  flex-row justify-between md:px-4 py-1 w-1/2 mx-auto rounded-full md:w-full  bg-gray-200">
              {tablist.map((data, index) => (
                <TabsList className="bg-transparent" key={index}>
                  <TabsTrigger
                    className=" rounded-full p-4 cursor-pointer"
                    value={data.value}
                  >
                    <div className="flex text-xl items-center flex-row gap-2">
                      {data.icon}
                      <p className="md:text-xs lg:text-lg hidden md:block">{data.name}</p>
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
            <TabsContent value={"employer_linkages"} className="mt-6">
              <EmployerList></EmployerList>
            </TabsContent>
            <TabsContent value={"trainings"} className="mt-6">
              <TrainingLists></TrainingLists>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
