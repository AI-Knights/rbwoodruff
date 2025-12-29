
import type { AgencyUsersResponse } from "@/types/agency/user.type";
import { api } from "../ApiSlice";

export const agencyUsersApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAgencyUsers: builder.query<AgencyUsersResponse, void>({
      query: () => "/agency/users/",
      providesTags: ["AgencyUser"]
    }),

  }),
});

export const { useGetAgencyUsersQuery } = agencyUsersApiSlice;