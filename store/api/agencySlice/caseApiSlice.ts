import { Case, CasesResponse, CaseStatus } from "@/types/agency/case.type";
import { api } from "../ApiSlice";


export const caseApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCases: builder.query<CasesResponse, void>({
      query: () => "/admin-panel/cases/", // Adjust endpoint if different
      providesTags: ["Case"]
    }),

    updateCaseStatus: builder.mutation<Case, { id: string; status: CaseStatus }>({
      query: ({ id, status }) => ({
        url: `/admin-panel/cases/${id}/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Case"]
    }),
  }),
});

export const { useGetCasesQuery, useUpdateCaseStatusMutation } = caseApiSlice;