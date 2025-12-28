
import type { JobSeekersResponse } from "@/types/admin/jobSeeker.type";
import { api } from "../ApiSlice";

export const jobSeekerApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getJobSeekers: builder.query<JobSeekersResponse, void>({
      query: () => "/admin-panel/users/",
      providesTags: ["Job"]
    }),
  }),
});

export const { useGetJobSeekersQuery } = jobSeekerApiSlice;