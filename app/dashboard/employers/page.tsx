import EmployerTable from '@/components/adminDashboard/Employers/EmployersTable'


function page() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Employers
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-2">
          View and Manage all Employers.
        </p>
      </div>
      <EmployerTable/>
    </div>
  )
}

export default page
