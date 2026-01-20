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
  console.log("all data:", data)
  // Total is calculated from the original data (including zeros)
  const totalUsers = data.reduce((sum, item) => sum + item.value, 0);

  // Data for the actual pie – filter out zeros so the chart doesn’t render empty slices
  const pieData = data.filter((item) => item.value > 0);

  const chartConfig = {
    value: {
      label: "Users",
    },
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Application Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend – shows ALL items, including those with 0 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs md:text-sm text-gray-600">
                {item.name}
              </span>
              <span className="text-xs md:text-sm font-semibold ml-auto">
                {totalUsers > 0
                  ? `${Math.round((item.value / totalUsers) * 100)}%`
                  : "0%"}
              </span>
            </div>
          ))}
        </div>

        {/* Pie Chart – only renders slices with value > 0 */}
        <ChartContainer
          config={chartConfig}
          className="h-[300px] md:h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OverviewPieChart;