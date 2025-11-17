import ComplianceStatusCard from '@/components/agencyDashboard/overview/ComplianceStatusCard'
import UpcomingCourtDatesCard from '@/components/agencyDashboard/overview/UpcomingCourtDatesCard'
import OverviewCard from '@/components/elements/OverviewCard'
import { overviewCards } from '@/data/Agency-overview.data'
import React from 'react'

function page() {
  return (
    <div>
      <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {overviewCards.map((item, index) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <UpcomingCourtDatesCard />
        <ComplianceStatusCard />
      </div>
    </div>
    </div>
  )
}

export default page
