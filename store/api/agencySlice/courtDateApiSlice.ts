import type {
  CourtDatesResponse,
  CourtDate,
  ComplianceStatus,
  UploadCsvResponse,
} from "@/types/agency/courtDate.type";
import { api } from "../ApiSlice";

export const courtDateApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourtDates: builder.query<CourtDatesResponse, void>({
      query: () => "/agency/court-dates/users/",
      providesTags: ["Case"]
    }),

    updateCourtDateStatus: builder.mutation<
      CourtDate,
      { id: string; status: ComplianceStatus }
    >({
      query: ({ id, status }) => ({
        url: `/agency/court-dates/${id}/status/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Case"]
    }),

    uploadCourtDatesCsv: builder.mutation<UploadCsvResponse, FormData>({
      query: (formData) => ({
        url: "/agency/court-dates/upload-csv/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Case"],
    }),
  }),
});

export const {
  useGetCourtDatesQuery,
  useUpdateCourtDateStatusMutation,
  useUploadCourtDatesCsvMutation,
} = courtDateApiSlice;