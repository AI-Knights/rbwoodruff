"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

interface CategoryData {
    category: string;
    enrollments: number;
}

interface ProgramPerformanceChartProps {
    data: CategoryData[];
    totalEnrollments: number;
    avgCompletionRate: number;
}

const ProgramPerformanceChart = ({
    data,
    totalEnrollments,
    avgCompletionRate
}: ProgramPerformanceChartProps) => {
    // Calculate dynamic height: at least 300px, or 50px per item
    const height = Math.max(300, data.length * 50);

    return (
        <Card className="col-span-1 lg:col-span-1 h-full shadow-sm bg-white">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold tracking-tight">Program Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ height: `${height}px`, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                            barSize={32}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#666", fontSize: 12 }}
                            />
                            <YAxis
                                dataKey="category"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="enrollments"
                                fill="#3b82f6"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Footer Stats */}
                <div className="mt-6 flex items-center justify-between px-2">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Average Completion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{avgCompletionRate}%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Enrollments</p>
                        <p className="text-2xl font-bold text-gray-900">{totalEnrollments.toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProgramPerformanceChart;
