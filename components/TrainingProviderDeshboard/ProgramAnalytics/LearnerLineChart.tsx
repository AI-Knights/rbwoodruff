'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { program: 'Logistics', learners: 50 },
  { program: 'Healthcare', learners: 35 },
  { program: 'IT', learners: 30 },
  { program: 'Digital', learners: 20 },
  { program: 'Construction', learners: 40 },
];
export default function LearnerLineChart() {
  return (
    <div>
        <div className=" p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Learners by Program</CardTitle>
             
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                    <XAxis 
                      dataKey="program" 
                      tick={{ fill: '#374151' }}
                      tickLine={{ stroke: '#9CA3AF' }}
                    />
                    <YAxis 
                      tick={{ fill: '#374151' }}
                      tickLine={{ stroke: '#9CA3AF' }}
                      domain={[0, 60]}
                      ticks={[0, 15, 30, 45, 60]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '0px',
                        padding: '12px'
                      }}
                      labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="rect"
                    />
                    <Bar 
                      dataKey="learners" 
                      fill="#8B5CF6" 
                      radius={[0, 0, 0, 0]}
                      name="Learners"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
