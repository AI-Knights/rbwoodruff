import React from "react";
import LearnersBarChart from "./LearnersBarChart";
import LearnerLineChart from "./LearnerLineChart";
import Demand_Indicator from "./Demand_Indicator";

export default function ProgramAnalytics() {
  return (
    <div >
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2 h-fit ">
        <div>
          <LearnerLineChart></LearnerLineChart>
        </div>
        <div>
          <LearnersBarChart></LearnersBarChart>
        </div>
      </div>
      <div>
        <Demand_Indicator></Demand_Indicator>
      </div>
    </div>
  );
}
