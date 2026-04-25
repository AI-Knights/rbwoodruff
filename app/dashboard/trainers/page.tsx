import TrainerTable from '@/components/adminDashboard/Trainer/TrainerTable'
import React from 'react'

function page() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Training Providers
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-2">
          View and Manage all Training Providers.
        </p>
      </div>
      <TrainerTable/>
    </div>
  )
}

export default page
