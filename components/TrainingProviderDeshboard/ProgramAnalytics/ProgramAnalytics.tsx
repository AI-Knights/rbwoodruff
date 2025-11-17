import React from "react";
import LearnersBarChart from "./LearnersBarChart";
import LearnerLineChart from "./LearnerLineChart";

export default function ProgramAnalytics() {
  return (
    <div>
      <div className="md:grid  grid-cols-2 h-60 ">
        <div>
          <LearnerLineChart></LearnerLineChart>
        </div>
        <div>
          <LearnersBarChart></LearnersBarChart>
        </div>
      </div>
    </div>
  );
}
