
import { TrainersResponse, UpdateTrainerStatusResponse } from '@/types/admin/trainer.type';
import { api } from '../ApiSlice';

export const trainerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all trainers (no params, full list)
    getTrainers: builder.query<TrainersResponse, void>({
      query: () => '/admin-panel/trainers/',
      providesTags: ["Trainer"]
    }),

    // Update trainer status (verify/ban/pending)
    updateTrainerStatus: builder.mutation<UpdateTrainerStatusResponse, { id: string; action: 'verify' | 'banned' | 'pending' }>({
      query: ({ id, action }) => ({
        url: `/admin-panel/trainers/${id}/verify/`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: ["Trainer"]
    }),
  }),
});

// Export unique hooks
export const { useGetTrainersQuery, useUpdateTrainerStatusMutation } = trainerApi;