"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

const OverviewPieChart: React.FC<{ data: PieChartData[] }> = ({ data }) => {
  const totalUsers = data.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = {
    value: {
      label: "Users",
    },
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          User Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs md:text-sm text-gray-600">
                {item.name}
              </span>
              <span className="text-xs md:text-sm font-semibold ml-auto">
                {Math.round((item.value / totalUsers) * 100)}%
              </span>
            </div>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="h-[300px] md:h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* User counts */}
        <div className="mt-6 grid items-center justify-center grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-start max-w-3xl mx-auto gap-2">
              <span className=" text-gray-500">{item.name}</span>
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-bold">
                  {item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewPieChart;
