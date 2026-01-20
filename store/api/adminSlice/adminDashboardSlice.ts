import { api } from "../ApiSlice";

export interface AdminDashboardStats {
    total_users: number;
    total_trainers: number;
    total_employers: number;
    total_agencies: number;
    total_job_seekers: number;
    total_enrollments: number;
    active_programs: number;
    total_revenue: number;
    monthly_revenue: number;
    pending_verifications: number;
    placement_rate: number;
    average_completion_rate: number;
    enrollments_by_category: { category: string; enrollments: number }[];
}

export const adminDashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboardStats: builder.query<AdminDashboardStats, void>({
            query: () => "/admin-panel/dashboard/",
            providesTags: ["Dashboard"],
        }),
    }),
});

export const { useGetAdminDashboardStatsQuery } = adminDashboardApi;
