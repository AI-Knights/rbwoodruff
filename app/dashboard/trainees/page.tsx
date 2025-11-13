import TraineesTable from '@/components/dashboard/Trainees/TraineesTable'
import React from 'react'

function page() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Trainees
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-2">
          View and Manage all trainees.
        </p>
      </div>
      <TraineesTable/>
    </div>
  )
}

export default page
