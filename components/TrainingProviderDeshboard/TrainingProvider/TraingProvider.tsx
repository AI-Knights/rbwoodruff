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

const activies = [
  {
    title: "Total Learners Referred",
    value: 8,
    subtitle: "NEWORXX",
    iconColor: "blue",
    icon: <FiUsers />,
  },
  {
    title: "Active Learners",
    value: 2,
    subtitle: "Currently Enrolled",
    iconColor: "green",
    icon: <FiUserCheck />,
  },
  {
    title: "Completed Learners",
    value: 2,
    subtitle: "Program Graduates",
    iconColor: "purple",
    icon: <GiBowlingPropulsion />,
  },
  {
    title: "Pending Enrollment",
    value: 2,
    subtitle: "Awaiting start",
    iconColor: "red",
    icon: <MdAccessTime />,
  },
  {
    title: "Average Completion Rate",
    value: "38%",
    subtitle: "Overall Performance",
    iconColor: "green",
    icon: <GrDocumentPerformance />,
  },
];

export default function TraingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F4F4F4]">
      <div className="flex flex-row bg-white p-8 shadow justify-between items-center">
        <Link href={"/trainin-provider-dashboard"}>
          <Image
            src={LogoImage}
            alt="Logo Image"
            className="w-3xs"
            width={100}
            height={100}
          ></Image>
        </Link>
        <p className="text-xl md:text-4xl font-bold">
          Training Provider Portal
        </p>
        <div className="h-14 w-14 rounded-full">
          <Image
            src={CatImage}
            className="w-full rounded-full h-full"
            alt="Profile Image"
            height={50}
            width={50}
          />
        </div>
      </div>
      <div className=" h-screen  mt-2 grid grid-cols-12 gap-3 p-8">
        <div className="col-span-10 ">
          <ActivitesCard data={activies}></ActivitesCard>

          {children}
        </div>
        <div className="col-span-2 bg-white h-screen">notification</div>
      </div>
    </div>
  );
}
