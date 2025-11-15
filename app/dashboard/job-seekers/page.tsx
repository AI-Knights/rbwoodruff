import JobSeekersTable from '@/components/adminDashboard/JobSeekers/JobSeekersTable'
import React from 'react'

function page() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Job Seekers
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-2">
          View and Manage all Job Seekers.
        </p>
      </div>
      <JobSeekersTable/>
    </div>
  )
}

export default page
