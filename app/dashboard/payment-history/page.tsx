import PaymentHistoryTable from "@/components/dashboard/Payment/PaymentHistoryTable";

function page() {
  return (
    <div className="">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Transaction History
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-2">
          View and track payments across all users.
        </p>
      </div>
      <PaymentHistoryTable />
    </div>
  );
}

export default page;
