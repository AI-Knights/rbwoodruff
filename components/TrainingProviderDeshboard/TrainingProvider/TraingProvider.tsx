"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoImage from "@/assets/logo (2).svg";
import CatImage from "@/assets/cat.jpg";
import { FiUserCheck, FiUsers } from "react-icons/fi";
import { GiBowlingPropulsion } from "react-icons/gi";
import { MdAccessTime } from "react-icons/md";
import { GrDocumentPerformance } from "react-icons/gr";
import ActivitesCard from "../Activites/ActivitesCard";
import { useTrainerOverviewQuery } from "@/store/api/trainerSlice/trainerSlice";
import { Nav } from "react-day-picker";
import Navbar from "@/components/adminDashboard/Navbar";
import { getAccessToken } from "@/lib/manage_token";
import { validateUserTypeForRoute, getDashboardRoute } from "@/lib/manage_token/decode_token";



export default function TraingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();

  const { data } = useTrainerOverviewQuery()

  useEffect(() => {
    // Validate user type on client-side before rendering
    const token = getAccessToken();

    if (!token) {
      // No token, redirect to login
      router.replace("/auth/sign-in");
      return;
    }

    // Check if user is training_provider
    const isTrainingProvider = validateUserTypeForRoute(token, "training_provider");

    if (!isTrainingProvider) {
      // User is not training provider, redirect to their correct dashboard
      const correctRoute = getDashboardRoute(token);
      router.replace(correctRoute);
      return;
    }

    // User is valid training provider, allow rendering
    setIsValidating(false);
  }, [router]);

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
      title: "Pending Certificate Verification",
      value: data?.pending_certificate_verifications,
      subtitle: "Awaiting Approval",
      iconColor: "#F54900",
      icon: <MdAccessTime className="text-[#F54900]" />, // Keeping time icon as it fits "Pending"
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

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F4F4] min-h-screen pb-10">
      <Navbar />
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8 space-y-8">
        <ActivitesCard data={activies} />
        {children}
      </div>
    </div>
  );
}
