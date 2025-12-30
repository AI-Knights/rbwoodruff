
import type { AgencyUsersResponse } from "@/types/agency/user.type";
import { api } from "../ApiSlice";
import { ReportResponse } from "@/types/agency/report.type";

export const agencyUsersApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgencyUsers: builder.query<AgencyUsersResponse, void>({
      query: () => "/agency/users/",
      providesTags: ["AgencyUser"]
    }),

    getUserReport : builder.query<ReportResponse, string>({
      query : (id)=> `/agency/reports/user-history/${id}/`
    })

  }),
});

export const { useGetAgencyUsersQuery , useLazyGetUserReportQuery } = agencyUsersApiSlice;