import { api } from "@/store/api/ApiSlice";
import { Job, JobsResponse } from "../../../types/employer/job.type";
import {
  ApplicantForJob,
  CreateJobBody,
  CreateJobResponse,
  PaginatedCategoryResponse,
  UpdateApplicationStatusBody,
} from "@/types/employer/employer.type";

export const employerJobApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<JobsResponse, void>({
      query: () => "/employer/jobs/",
      providesTags: ["Job"]
    }),

    updateJob: builder.mutation<Job, { id: string; body: Partial<Job> }>({
      query: ({ id, body }) => ({
        url: `/employer/jobs/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Job"],
    }),

    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employer/jobs/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),
    createJob: builder.mutation<CreateJobResponse, CreateJobBody>({
      query: (body) => ({
        url: "/employer/jobs/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Job"], // if you have job list later
    }),
    getJobCategories: builder.query<PaginatedCategoryResponse, void>({
      query: ()=> "/users/categories/",
    }),
    updateApplication: builder.mutation<ApplicantForJob,UpdateApplicationStatusBody>({
      query: ({id, status})=>({
        url: `/employer/applicants/${id}/status/`,
        method: "PATCH",
        body: {status:status},
        credentials: "include"
      }),
      invalidatesTags:["Application"]
    })
  }),
});

export const {
  useGetJobsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useCreateJobMutation,
  useGetJobCategoriesQuery,
  useUpdateApplicationMutation
} = employerJobApi;
