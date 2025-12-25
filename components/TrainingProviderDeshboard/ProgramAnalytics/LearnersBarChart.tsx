"use client";

import {
  LineChart,
  Line,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgramLearnerSummary } from "@/types/trainer/trainer";

const data = [
  { program: "Logistics", learners: 75 },
  { program: "Healthcare", learners: 80 },
  { program: "IT", learners: 70 },
  { program: "Digital", learners: 72 },
  { program: "Construction", learners: 80 },
];

export default function LearnersBarChart({info} : {info : ProgramLearnerSummary[] }) {
  return (
    <div>
      <div className=" p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Average Completion Rate per Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={info}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-gray-200"
                    />
                    <XAxis
                      dataKey="program_name"
                      tick={{ fill: "#374151" }}
                      tickLine={{ stroke: "#9CA3AF" }}
                    />
                    <YAxis
                      tick={{ fill: "#374151" }}
                      tickLine={{ stroke: "#9CA3AF" }}
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        padding: "12px",
                      }}
                      labelStyle={{ color: "#111827", fontWeight: "bold" }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="total_learners"
                      stroke="#82CA9D"
                      strokeWidth={3}
                      dot={{ fill: "#82CA9D", r: 6 }}
                      activeDot={{ r: 8 }}
                      name="Learners"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
