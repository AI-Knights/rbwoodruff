import { CategoryListResponse, CourseListResponse, CreateTrainingRequest, DashboardStatsResponse, ITrainer, JobsResponse, LearnerEnrollmentListResponse, TrainingProgram } from "@/types/trainer/trainer";
import { api } from "../ApiSlice";


const trainerSlice = api.injectEndpoints({

    endpoints: (builder) => ({
        // trainer dashboard 
        trainerOverview: builder.query<ITrainer, void>({
            query: () => ({
                url: '/trainer/dashboard/',

            }),
            providesTags: ["Trainings"]

        }),

        analyticsChart: builder.query<DashboardStatsResponse, void>({
            query: () => ({
                url: "/trainer/analytics/",

            }),
            providesTags: ["Trainings"]
        }),



        // programmes 
        programmList: builder.query<CourseListResponse, void>({
            query: () => ({
                url: '/trainer/programs/',

            }),
            providesTags: ["Trainings"]

        }),
        deleteProgramm: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/trainer/programs/${id}/`,
                method: "DELETE"

            }),
            invalidatesTags: ["Trainings"]
        }),

        createProgramm: builder.mutation<TrainingProgram, CreateTrainingRequest>({
            query: (info) => ({
                url: `/trainer/programs/create/`,
                method: "POST",
                body: JSON.stringify(info)
            }),
            invalidatesTags: ["Trainings"]
        }),

        // learners 
        learnerList: builder.query<LearnerEnrollmentListResponse, void>({
            query: () => ({
                url: "/trainer/learners/"
            })
        }),

        // cetagorys 
        allCategorys: builder.query<CategoryListResponse, void>({
            query: () => ({
                url: '/users/categories/'
            })
        }),

        // linkages
        employerLinkages: builder.query<JobsResponse, void>({
            query: () => ({
                url: '/trainer/job-opportunities/'
            })
        }),
    })
})

export const { useTrainerOverviewQuery, useEmployerLinkagesQuery, useAllCategorysQuery, useProgrammListQuery, useDeleteProgrammMutation, useLearnerListQuery, useAnalyticsChartQuery, useCreateProgrammMutation } = trainerSlice








