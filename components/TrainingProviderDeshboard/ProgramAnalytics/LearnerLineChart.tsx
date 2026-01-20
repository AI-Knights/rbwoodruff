'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProgramCompletionRate } from '@/types/trainer/trainer';

export default function LearnerLineChart({ info }: { info: ProgramCompletionRate[] }) {
  // Scalable height
  const chartHeight = Math.max(400, info.length * 60);

  return (
    <Card className="h-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Program Completion Rates</CardTitle>
        <CardDescription>Percentage of enrolled learners who completed</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div style={{ width: "100%", height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={info}
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-gray-100" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6B7280' }} />
              <YAxis
                dataKey="program_name"
                type="category"
                width={150}
                tick={{ fill: '#374151', fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value}%`, 'Completion Rate']}
              />
              <Legend iconType="rect" />
              <Bar
                dataKey="completion_rate"
                name="Completion Rate"
                radius={[0, 4, 4, 0]}
                barSize={20}
              >
                {info.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completion_rate === 100 ? '#10B981' : '#8B5CF6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
