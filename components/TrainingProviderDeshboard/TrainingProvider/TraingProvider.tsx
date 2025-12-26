"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LogoImage from "@/assets/logo (2).svg";
import CatImage from "@/assets/cat.jpg";
import { FiUserCheck, FiUsers } from "react-icons/fi";
import { GiBowlingPropulsion } from "react-icons/gi";
import { MdAccessTime } from "react-icons/md";
import { GrDocumentPerformance } from "react-icons/gr";
import ActivitesCard from "../Activites/ActivitesCard";
import { Bell, Info, CircleCheck } from "lucide-react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiWarning } from "react-icons/ci";
import { useTrainerOverviewQuery } from "@/store/api/trainerSlice/trainerSlice";



export default function TraingProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data } = useTrainerOverviewQuery()

  const activies = [
    {
      title: "Total Learners Referred",
      value: data?.total_learners,
      subtitle: "NEWORXX",
      iconColor: "#155DFC",
      icon: <FiUsers className="text-[#155DFC]" />,
    },
    {
      title: "Active Learners",
      value: data?.active_learners,
      subtitle: "Currently Enrolled",
      iconColor: "#00A63E",
      icon: <FiUserCheck className="text-[#00A63E]" />,
    },
    {
      title: "Completed Learners",
      value: data?.completed_learners,
      subtitle: "Program Graduates",
      iconColor: "#9810FA",
      icon: <GiBowlingPropulsion className="text-[#9810FA]" />,
    },
    {
      title: "Pending Enrollment",
      value: data?.pending_enrollments,
      subtitle: "Awaiting start",
      iconColor: "#F54900",
      icon: <MdAccessTime className="text-[#F54900]" />,
    },
    {
      title: "Average Completion Rate",
      value: `${data?.average_completion_rate}%`,
      subtitle: "Overall Performance",
      iconColor: "#009966",
      icon: <GrDocumentPerformance className="text-[#009966]" />,
    },
  ];
  console.log(data)
  return (
    <div className="bg-[#F4F4F4]">
      <div className="flex flex-row bg-white shadow  px-8 py-4 justify-between items-center">
        <Link className=" " href={"/training-provider-dashboard"}>
          <Image
            src={LogoImage}
            alt="Logo Image"
            className=" md:w-3xs"
            width={100}
            height={100}
          ></Image>
        </Link>
        <p className=" text-xs hidden md:block md:text-4xl font-bold">
          Training Provider Portal
        </p>
        <div className="h-14 w-14 rounded-full">
          <Link href={"/profile"}>
            <Image
              src={CatImage}
              className="w-full rounded-full h-full"
              alt="Profile Image"
              height={50}
              width={50}
            />
          </Link>
        </div>
      </div>
      <div className=" h-fit   grid grid-cols-1 md:grid-cols-12 gap-3 px-8">
        <div className="  col-span-10 ">
          <ActivitesCard data={activies}></ActivitesCard>

          {children}
        </div>

        <div className="w-full  bg-white h-full col-span-2 p-6 shadow-lg border border-gray-200 ">
          <div className="w-full  bg-white h-fit p-5 rounded-xl shadow-lg border border-gray-200">
            <div className="px-4 py-3  border-gray-200 flex items-center gap-3">
              <Bell className="size-6" fill="black" />
              <h3 className="text-lg font-semibold">Notification</h3>
            </div>

            <div className="p-4 border-b hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-blue-400">
                  <Info className="size-5" fill="none" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-gray-600">
                    5 new learners applied this week
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    10 mins ago
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-b hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-green-600 text-2xl ">
                  <IoMdCheckmarkCircleOutline />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-gray-600">
                    2 Learners Completed Logistics Program
                  </p>
                  <p className="text-xs font-medium text-gray-500">Just Now</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-yellow-600 text-2xl">
                  <CiWarning />

                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-gray-600">
                    Certificate pending for jennifer Martinez
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    10 mins ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
