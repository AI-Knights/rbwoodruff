"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LabelList
} from "recharts";

interface BarChartData {
  name: string;
  value: number;
}

const OverviewBarChart: React.FC<{ data: BarChartData[] }> = ({ data }) => {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm bg-white h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold tracking-tight">Top Performing Job Listings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Fixed height to match Pie Chart */}
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 60, left: 10, bottom: 5 }}
              barSize={24}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis
                type="number"
                hide
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
                width={220}
                tickFormatter={(value) => value.length > 35 ? `${value.slice(0, 35)}...` : value}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${value} Applicants`, '']}
              />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
              >
                <LabelList dataKey="value" position="right" fontSize={12} fill="#666" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewBarChart;