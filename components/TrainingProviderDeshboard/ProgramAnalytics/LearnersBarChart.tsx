"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProgramLearnerSummary } from "@/types/trainer/trainer";

export default function LearnersBarChart({ info }: { info: ProgramLearnerSummary[] }) {
  // Dynamic height ensuring at least 100px per item if many items, min 400px
  const chartHeight = Math.max(400, info.length * 60);

  return (
    <Card className="h-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          Learners by Program
        </CardTitle>
        <CardDescription>
          Active vs. Completed learners (Stacked)
        </CardDescription>
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
              <XAxis type="number" tick={{ fill: "#6B7280" }} allowDecimals={false} />
              <YAxis
                dataKey="program_name"
                type="category"
                width={150} // increased for long names
                tick={{ fill: "#374151", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend iconType="circle" />
              <Bar dataKey="active" stackId="a" name="Active" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
              <Bar dataKey="completed" stackId="a" name="Completed" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
