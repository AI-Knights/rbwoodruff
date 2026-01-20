import { CategoryListResponse, CourseListResponse, CreateTrainingRequest, DashboardStatsResponse, ITrainer, JobsResponse, LearnerEnrollment, LearnerEnrollmentListResponse, TrainingProgram } from "@/types/trainer/trainer";
import { api } from "../ApiSlice";


const trainerSlice = api.injectEndpoints({

    endpoints: (builder) => ({
        // trainer dashboard 
        trainerOverview: builder.query<ITrainer, void>({
            query: () => ({
                url: '/trainer/dashboard/',

            }),
            providesTags: ["Dashboard"]

        }),

        analyticsChart: builder.query<DashboardStatsResponse, void>({
            query: () => ({
                url: "/trainer/analytics/",

            }),
            providesTags: ["Dashboard"]
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
                body: info
            }),
            invalidatesTags: ["Trainings"]
        }),

        updateProgramm: builder.mutation<TrainingProgram, { id: string, data: CreateTrainingRequest }>({
            query: ({ id, data }) => ({
                url: `/trainer/programs/${id}/`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Trainings"]
        }),

        // learners 
        learnerList: builder.query<LearnerEnrollmentListResponse, void>({
            query: () => ({
                url: "/trainer/learners/"
            }),
            providesTags: ["Learners"]
        }),

        updateLearnerStatus: builder.mutation<LearnerEnrollment, { id: string, status: string }>({
            query: ({ id, status }) => ({
                url: `/trainer/learners/${id}/`,
                method: "PATCH",
                body: { status }
            }),
            invalidatesTags: ["Learners", "Dashboard"],
            async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    trainerSlice.util.updateQueryData('learnerList', undefined, (draft) => {
                        const learner = draft.results.find(l => l.id === id);
                        if (learner) {
                            learner.status = status;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),

        verifyCertificate: builder.mutation<{ message: string }, { id: string, action: "verify" | "reject", rejection_reason?: string }>({
            query: ({ id, ...body }) => ({
                url: `/trainer/certificates/${id}/verify/`,
                method: "POST",
                body
            }),
            invalidatesTags: ["Learners", "Dashboard"],
            async onQueryStarted({ id, action, rejection_reason }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    trainerSlice.util.updateQueryData('learnerList', undefined, (draft) => {
                        const learner = draft.results.find(l => l.certificate_id === id);
                        if (learner) {
                            if (action === 'verify') {
                                learner.certificate_status = 'verified';
                                learner.status = 'completed'; // Auto-complete
                            } else if (action === 'reject') {
                                learner.certificate_status = 'rejected';
                                learner.rejection_reason = rejection_reason || null;
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
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

export const { useTrainerOverviewQuery, useEmployerLinkagesQuery, useAllCategorysQuery, useProgrammListQuery, useDeleteProgrammMutation, useLearnerListQuery, useUpdateLearnerStatusMutation, useVerifyCertificateMutation, useAnalyticsChartQuery, useCreateProgrammMutation, useUpdateProgrammMutation } = trainerSlice








