"use client"
import LearnersBarChart from "./LearnersBarChart";
import LearnerLineChart from "./LearnerLineChart";
import Demand_Indicator from "./Demand_Indicator";
import { useAnalyticsChartQuery } from "@/store/api/trainerSlice/trainerSlice";

export default function ProgramAnalytics() {
  const {data} = useAnalyticsChartQuery()
  return (
    <div >
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 h-fit ">
        <div>
          <LearnerLineChart info={data?.learners_by_program || []}></LearnerLineChart>
        </div>
        <div>
          <LearnersBarChart info={data?.learners_by_program || []}></LearnersBarChart>
        </div>
      </div>
      <div>
        <Demand_Indicator></Demand_Indicator>
      </div>
    </div>
  );
}
