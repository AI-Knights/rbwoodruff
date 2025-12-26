'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgramLearnerSummary } from '@/types/trainer/trainer';


export default function LearnerLineChart({info} : {info : ProgramLearnerSummary[] }) {
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
                    data={info}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                    <XAxis 
                      dataKey="program_name" 
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
                      dataKey="total_learners" 
                      fill="#8B5CF6" 
                      radius={[0, 0, 0, 0]}
                      name="total_learners"
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
