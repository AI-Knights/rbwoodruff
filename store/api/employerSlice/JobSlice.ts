import { api } from "@/store/api/ApiSlice";
import { Job, JobsResponse } from "../../../types/employer/job.type";
import {
  ApplicantForJob,
  CreateJobBody,
  CreateJobResponse,
  PaginatedCategoryResponse,
  UpdateApplicationStatusBody,
  Interview,
  InterviewsResponse,
  HiredApplicant,
  HiredApplicantsResponse,
} from "@/types/employer/employer.type";

// Helper function to fetch all pages from a paginated endpoint
async function fetchAllPages<T>(
  baseUrl: string,
  fetchWithBQ: (url: string) => Promise<{ data?: { results: T[]; next: string | null }; error?: unknown }>
): Promise<T[]> {
  let allResults: T[] = [];
  let nextUrl: string | null = baseUrl;

  while (nextUrl) {
    const response = await fetchWithBQ(nextUrl);
    if (response.error) {
      throw response.error;
    }
    if (response.data) {
      allResults = [...allResults, ...response.data.results];
      nextUrl = response.data.next;
    } else {
      break;
    }
  }

  return allResults;
}

export const employerJobApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const jobs = await fetchAllPages<Job>("/employer/jobs/", async (url) => {
            const result = await fetchWithBQ(url);
            return result as { data?: JobsResponse; error?: unknown };
          });
          return { data: jobs };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
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
      invalidatesTags: ["Job"],
    }),
    getJobCategories: builder.query<PaginatedCategoryResponse, void>({
      query: () => "/users/categories/",
    }),
    updateApplication: builder.mutation<ApplicantForJob, UpdateApplicationStatusBody>({
      query: ({ id, ...body }) => ({
        url: `/employer/applicants/${id}/status/`,
        method: "PATCH",
        body,
        credentials: "include"
      }),
      invalidatesTags: ["Application", "Interview", "HiredApplicant"]
    }),

    // Hired Applicants - fetches all pages
    getHiredApplicants: builder.query<HiredApplicant[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const applicants = await fetchAllPages<HiredApplicant>("/employer/applicants/hired/", async (url) => {
            const result = await fetchWithBQ(url);
            return result as { data?: HiredApplicantsResponse; error?: unknown };
          });
          return { data: applicants };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ["HiredApplicant"]
    }),

    // Scheduled Interviews - fetches all pages
    getScheduledInterviews: builder.query<Interview[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const interviews = await fetchAllPages<Interview>("/employer/interviews/", async (url) => {
            const result = await fetchWithBQ(url);
            return result as { data?: InterviewsResponse; error?: unknown };
          });
          return { data: interviews };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ["Interview"]
    }),

    getInterview: builder.query<Interview, string>({
      query: (id) => `/employer/interviews/${id}/`,
      providesTags: ["Interview"]
    }),

    updateInterview: builder.mutation<Interview, { id: string; body: Partial<Interview> }>({
      query: ({ id, body }) => ({
        url: `/employer/interviews/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Interview"]
    }),
  }),
});

export const {
  useGetJobsQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useCreateJobMutation,
  useGetJobCategoriesQuery,
  useUpdateApplicationMutation,
  useGetHiredApplicantsQuery,
  useGetScheduledInterviewsQuery,
  useGetInterviewQuery,
  useUpdateInterviewMutation,
} = employerJobApi;
