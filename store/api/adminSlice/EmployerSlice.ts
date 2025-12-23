
import { EmployersResponse, VerifyEmployerResponse } from '@/types/admin/employer.type';
import { api } from '../ApiSlice';

export const employerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch employers list (paginated with optional filter)
    getEmployers: builder.query<EmployersResponse,void>({
      query: () => ({
        url: '/admin-panel/employers/',
      }),
      providesTags: ["Employer"]
    }),

    // Update status (verify/ban/unban)
    updateEmployerStatus: builder.mutation<VerifyEmployerResponse, { id: string; action: 'verify' | 'banned' }>({
      query: ({ id, action }) => ({
        url: `/admin-panel/employers/${id}/verify/`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: ["Employer"]
    }),
  }),
});

// Export hooks (unique names)
export const { useGetEmployersQuery, useUpdateEmployerStatusMutation } = employerApi;