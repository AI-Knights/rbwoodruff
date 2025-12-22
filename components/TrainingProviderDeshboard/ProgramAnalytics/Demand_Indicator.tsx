import { cn } from "@/lib/utils";
import React from "react";

const data = [
  {
    title: "Healthcare",
    subtitle: "Healthcare Support",
    status: "High Demand",
  },
  {
    title: "IT",
    subtitle: "IT Support Specialist",
    status: "Medium Demand",
  },
  {
    title: "Healthcare",
    subtitle: "Healthcare Support",
    status: "High Demand",
  },
  {
    title: "Healthcare",
    subtitle: "Healthcare Support",
    status: "High Demand",
  },
];

export default function Demand_Indicator() {
  return <div className="grid p-10 bg-white grid-cols-1 lg:grid-cols-4 rounded-xl mt-4 gap-2 ">

    {
      data.map((item, index) => (
        <div className="border rounded-3xl flex flex-col gap-4 p-8" key={index}>
          <h1 className="text-xl font-medium" >{item.title}</h1>
          <h1 className="text-gray-400" >{item.subtitle}</h1>
          <h1 className={cn("p-2 py-1 rounded-md w-fit ", item.status == "Medium Demand" ? "bg-amber-100 border border-orange-200" : "bg-green-100 border border-green-200")} >{item.status}</h1>
        </div>
      ))
    }
  </div>;
}
