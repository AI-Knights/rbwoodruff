
import { EmployersResponse, VerifyEmployerResponse } from '@/types/admin/employer.type';
import { api } from '../ApiSlice';

export const employerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch employers list (paginated with optional filter)
    getEmployers: builder.query<EmployersResponse, { page?: number; filter?: 'verified' | 'pending' | 'banned' }>({
      query: ({ page = 1, filter }) => ({
        url: '/admin-panel/employers/',
        params: { page, ...(filter && { filter }) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Employer' as const, id })),
              { type: 'Employer', id: 'LIST' },
            ]
          : [{ type: 'Employer', id: 'LIST' }],
    }),

    // Update status (verify/ban/unban)
    updateEmployerStatus: builder.mutation<VerifyEmployerResponse, { id: string; action: 'verified' | 'banned' }>({
      query: ({ id, action }) => ({
        url: `/admin-panel/employers/${id}/verify/`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Employer', id },
        { type: 'Employer', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks (unique names)
export const { useGetEmployersQuery, useUpdateEmployerStatusMutation } = employerApi;