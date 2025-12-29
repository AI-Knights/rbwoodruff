"use client";

import OverviewCard from "@/components/elements/OverviewCard";
import OverviewPieChart from "./OverviewPieChart";
import OverviewBarChart from "./OverviewBarChart";
import { useGetEmployerDashboardQuery } from "@/store/api/employerSlice/dashboardApiSlice";

const Overview = () => {
  const { data, isLoading, isError } = useGetEmployerDashboardQuery();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p className="text-lg text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  // Overview Cards based on API response
  const overviewCards = [
    {
      title: "Total Jobs Posted",
      value: data.total_jobs_posted.toLocaleString(),
      description: "All time",
      trend: "", // no trend data in API
      icon: "users" as const,
    },
    {
      title: "Active Jobs",
      value: data.active_jobs.toLocaleString(),
      description: "Currently open",
      trend: "",
      icon: "programs" as const,
    },
    {
      title: "Total Applicants",
      value: data.total_applicants.toLocaleString(),
      description: "Across all jobs",
      trend: "",
      icon: "verifications" as const,
    },
    {
      title: "Hired Candidates",
      value: data.hired_candidates.toLocaleString(),
      description: "Successfully placed",
      trend: "",
      icon: "placement" as const,
    },
  ];

  // Pie chart: Application status distribution
  const pieChartData = [
    { name: "Applied", value: data.applied_count, color: "#3b82f6" },
    { name: "Shortlisted", value: data.shortlisted_count, color: "#10b981" },
    { name: "Rejected", value: data.rejected_count, color: "#ef4444" },
    { name: "Hired", value: data.hired_candidates, color: "#a855f7" },
  ]

  // Bar chart: Top jobs by applicant count
  const barChartData = data.top_jobs.map((job) => ({
    name: job.job_title.length > 15 ? job.job_title.slice(0, 15) + "..." : job.job_title,
    value: job.applicant_count,
  }));

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Overview Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {overviewCards.map((card, index) => (
            <OverviewCard key={index} {...card} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <div className="xl:col-span-1">
            <OverviewPieChart data={pieChartData} />
          </div>
          <div className="xl:col-span-2">
            <OverviewBarChart data={barChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;