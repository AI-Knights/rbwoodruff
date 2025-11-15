import ManageAgenciesTable from '@/components/adminDashboard/Agency/ManageAgenciesTable'

function page() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Agency
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-2">
           Manage all agency.
        </p>
      </div>
      <ManageAgenciesTable/>
    </div>
  )
}

export default page
