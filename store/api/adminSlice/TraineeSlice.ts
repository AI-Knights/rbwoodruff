import { TraineeEnrollmentsResponse } from "@/types/admin/trainee.type";
import { api } from "../ApiSlice";

export const traineeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTraineeEnrollments: builder.query<TraineeEnrollmentsResponse, void>({
      query: () => '/admin-panel/training-enrollments/',
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Trainee' as const, id })),
              { type: 'Trainee', id: 'LIST' },
            ]
          : [{ type: 'Trainee', id: 'LIST' }],
    }),
  }),
});

export const { useGetTraineeEnrollmentsQuery } = traineeApi;