import { OverviewCardData } from "@/components/elements/OverviewCard";

// Dummy Data
export const overviewCards: OverviewCardData[] = [
  {
    title: "Total Assigned Users",
    value: 100,
    description: "Total users currently assigned",
    trend: "+12% from last month",
    icon: "users",
  },
  {
    title: "In Progress",
    value: 40,
    description: "Ongoing training programs",
    trend: "Currently running",
    icon: "programs",
  },
  {
    title: "Completed",
    value: 50,
    description: "Successfully completed in all batches",
    trend: "+8% success rate",
    icon: "verifications",
  },
  {
    title: "Non-Compliant",
    value: 10,
    description: "Users with overdue tasks",
    trend: "Last 30 days",
    icon: "placement",
  },
];