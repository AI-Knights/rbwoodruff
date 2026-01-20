import { cn } from "@/lib/utils";
import { CategoryDemand } from "@/types/trainer/trainer";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Demand_Indicator({ data }: { data: CategoryDemand[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 px-2">Category Demand Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start space-x-2">
                <CardTitle className="text-lg font-medium leading-tight">
                  {item.category_name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    "whitespace-nowrap",
                    item.demand_level === "High"
                      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                      : item.demand_level === "Medium"
                        ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100"
                        : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {item.demand_level} Demand
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold">{item.enrollment_count}</span>
                <span className="text-xs text-muted-foreground">Enrolled Learners</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
