"use client"
import LearnersBarChart from "./LearnersBarChart";
import LearnerLineChart from "./LearnerLineChart";
import Demand_Indicator from "./Demand_Indicator";
import { useAnalyticsChartQuery } from "@/store/api/trainerSlice/trainerSlice";

export default function ProgramAnalytics() {
  const { data } = useAnalyticsChartQuery(undefined); // Passing undefined to trigger query without args if needed, or empty

  if (!data) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 min-h-[500px]">
        <div className="bg-white rounded-xl">
          {/* This component now renders proper Horizontal Bar Chart for Learners */}
          <LearnersBarChart info={data.learners_by_program || []} />
        </div>
        <div className="bg-white rounded-xl">
          {/* This component now renders Horizontal Bar Chart for Completion Rates */}
          <LearnerLineChart info={data.completion_rates || []} />
        </div>
      </div>
      <div>
        <Demand_Indicator data={data.category_demand || []} />
      </div>
    </div>
  );
}
