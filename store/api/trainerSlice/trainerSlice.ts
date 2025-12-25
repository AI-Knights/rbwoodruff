import { CategoryListResponse, CourseListResponse, CreateTrainingRequest, DashboardStatsResponse, ITrainer, LearnerEnrollmentListResponse, TrainingProgram } from "@/types/trainer/trainer";
import { api } from "../ApiSlice";


const trainerSlice = api.injectEndpoints({

    endpoints: (builder) => ({
        // trainer dashboard 
        trainerOverview: builder.query<ITrainer, void>({
            query: () => ({
                url: '/trainer/dashboard/',

            })

        }),

        analyticsChart: builder.query<DashboardStatsResponse, void>({
            query: () => ({
                url: "/trainer/analytics/",

            })
        }),



        // programmes 
        programmList: builder.query<CourseListResponse, void>({
            query: () => ({
                url: '/trainer/programs/',

            })

        }),
        deleteProgramm: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/trainer/programs/${id}/`,
                method: "DELETE"

            })
        }),

        createProgramm: builder.mutation<TrainingProgram, CreateTrainingRequest>({
            query: (info) => ({
                url: `/trainer/programs/create/`,
                method: "POST",
                body: JSON.stringify(info)
            })
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
        })
    })
})

export const { useTrainerOverviewQuery, useAllCategorysQuery, useProgrammListQuery, useDeleteProgrammMutation, useLearnerListQuery, useAnalyticsChartQuery, useCreateProgrammMutation } = trainerSlice








