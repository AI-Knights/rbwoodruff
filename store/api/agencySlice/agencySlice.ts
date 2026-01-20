import { api } from "../ApiSlice";

export interface AgencyDashboardStats {
    total_assigned_users: number;
    in_progress: number;
    completed: number;
    non_compliant: number;
    assigned_count: number;
    delayed_count: number;
    closed_count: number;
    quiz_completed_count: number;
    resume_completed_count: number;
    upcoming_court_dates: {
        name: string;
        caseId: string;
        date: string;
        status: string;
    }[];
}

export interface AgencyCaseLoad {
    id: string;
    case_id: string;
    court_name: string;
    court_date: string | null;
    status: string;
    email: string;
    is_registered: boolean;
    user_name?: string;
    matched_user?: string;
    is_mismatch?: boolean;
    user_reported_case_id?: string;
    created_at: string;
}

export interface CSVUploadResponse {
    total_rows: number;
    successful_matches: number;
    failed_matches: number;
    failures: { row: number; error: string; case_id?: string }[];
}

export interface AuditLogItem {
    id: string;
    action: string;
    admin_user: string; // ID
    admin_name: string;
    target_user?: string; // ID
    target_name?: string;
    details: any;
    ip_address: string;
    timestamp: string;
}

export const agencyApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getAgencyDashboard: builder.query<AgencyDashboardStats, void>({
            query: () => "/agency/dashboard/",
            providesTags: ["Dashboard"],
        }),
        getAgencyCases: builder.query<AgencyCaseLoad[], void>({
            query: () => "/agency/cases/",
            providesTags: ["Case"],
        }),
        uploadCaseCSV: builder.mutation<CSVUploadResponse, FormData>({
            query: (formData) => ({
                url: "/agency/cases/upload-csv/",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Case", "Dashboard", "User"],
        }),
        getUserRoster: builder.query<any[], void>({
            query: () => "/agency/users/",
            providesTags: ["User"],
        }),
        getAuditLogs: builder.query<AuditLogItem[], void>({
            query: () => "/agency/audit-logs/",
            providesTags: ["AuditLog"],
        }),
        updateAgencyCase: builder.mutation<AgencyCaseLoad, { id: string; data: Partial<AgencyCaseLoad> }>({
            query: ({ id, data }) => ({
                url: `/agency/cases/${id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Case"],
        }),
        deleteAgencyCase: builder.mutation<void, string>({
            query: (id) => ({
                url: `/agency/cases/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Case", "User", "Dashboard"],
        }),
    }),
});

export const {
    useGetAgencyDashboardQuery,
    useGetAgencyCasesQuery,
    useUploadCaseCSVMutation,
    useGetUserRosterQuery,
    useGetAuditLogsQuery,
    useUpdateAgencyCaseMutation,
    useDeleteAgencyCaseMutation
} = agencyApiSlice;
