
import type { EmployerDashboardResponse } from "@/types/employer/dashboard.type";
import { api } from "../ApiSlice";

export const dashboardApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployerDashboard: builder.query<EmployerDashboardResponse, void>({
      query: () => "/employer/dashboard/",
    }),
  }),
});

export const { useGetEmployerDashboardQuery } = dashboardApiSlice;