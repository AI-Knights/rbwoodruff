"use client";
import ComplianceStatusCard from '@/components/agencyDashboard/overview/ComplianceStatusCard'
import UpcomingCourtDatesCard from '@/components/agencyDashboard/overview/UpcomingCourtDatesCard'
import OverviewCard from '@/components/elements/OverviewCard'
import { overviewCards } from '@/data/Agency-overview.data'
import { useGetAgencyDashboardQuery } from '@/store/api/agencySlice/agencySlice'
import React from 'react'

function Page() {
  const { data, isLoading } = useGetAgencyDashboardQuery();

  // Merge API data with static card metadata
  const cards = overviewCards.map((card) => {
    switch (card.title) {
      case "Total Assigned Users":
        return { ...card, value: data?.total_assigned_users ?? 0 };
      case "In Progress":
        return { ...card, value: data?.in_progress ?? 0 };
      case "Completed":
        return { ...card, value: data?.completed ?? 0 };
      case "Non-Compliant":
        return { ...card, value: data?.non_compliant ?? 0 };
      default:
        return card;
    }
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard stats...</div>;
  }

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {cards.map((item, index) => (
            <OverviewCard key={index} {...item} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <UpcomingCourtDatesCard data={data?.upcoming_court_dates} />
          <ComplianceStatusCard stats={{
            total: data?.total_assigned_users || 0,
            on_track: data?.in_progress || 0,
            delayed: data?.delayed_count || 0,
            non_compliant: data?.non_compliant || 0,
            quiz_count: data?.quiz_completed_count || 0,
            resume_count: data?.resume_completed_count || 0
          }} />
        </div>
      </div>
    </div>
  )
}

export default Page
