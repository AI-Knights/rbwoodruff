
import { Agency } from '@/types/admin/agency.type';
import { api } from '../ApiSlice';

export const agencyApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgencies: builder.query<{ count: number; next: string | null; previous: string | null; results: Agency[] }, void>({
      query: () => '/admin-panel/agencies/',
      providesTags: ['Agency'],
    }),
    updateAgencyStatus: builder.mutation<{ message: string }, { id: string; action: 'verify' | 'banned' }>({
      query: ({ id, action }) => ({
        url: `/admin-panel/agencies/${id}/verify/`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: ['Agency'],
    }),
  }),
});

export const {
  useGetAgenciesQuery,
  useUpdateAgencyStatusMutation,
} = agencyApiSlice;