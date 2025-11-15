"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

interface BarChartData {
  name: string;
  value: number;
}

const OverviewBarChart: React.FC<{ data: BarChartData[] }> = ({ data }) => {
  const chartConfig = {
    value: {
      label: "Value",
    },
  };

  // Alternating colors: blue and green
  const colors = ['#3b82f6', '#10b981'];

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Program Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % 2]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Additional Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-600">Average Completion Rate</p>
            <p className="text-2xl font-bold">82%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Enrollments</p>
            <p className="text-2xl font-bold">2,180</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewBarChart;