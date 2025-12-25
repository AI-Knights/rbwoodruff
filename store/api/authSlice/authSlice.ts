import { IRegister, UserRegistrationPayload } from "@/types/auth/auth";
import { api } from "../ApiSlice";
import { setTokenInCookies } from "@/lib/manage_token";
import { User } from "@/types/trainer/trainer";


const authSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        createAccount: builder.mutation<IRegister, UserRegistrationPayload>({
            query: (userInfo) => ({

                url: "/auth/register/",
                method: "POST",
                body: userInfo
            })

        }),
        signInUser: builder.mutation<{ refresh: string; access: string }, { email: string; password: string }>({
            query: (userInfo) => ({
                url: "/auth/login/",
                method: "POST",
                body: userInfo
            }),
            async onQueryStarted(_org, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    setTokenInCookies({ access: data.access, refresh: data.refresh })

                } catch (eror) {
                    console.log(eror)

                }
            }
        }),

        sendOtp: builder.mutation<{ message: string }, { email: string }>({
            query: ({ email }) => ({
                url: '/auth/send-otp/',
                method: "POST",
                body: { email }
            })

        }),
        forgotPassword: builder.mutation<{ message: string, reset_token: string }, { email: string }>({
            query: ({ email }) => ({
                url: '/auth/password-reset-request/',
                method: "POST",
                body: { email }
            })

        }),

        verifyResetOtp: builder.mutation<{ message: string, reset_token: string }, { reset_token: string, otp: string }>({
            query: ({ reset_token, otp }) => ({
                url: '/auth/password-reset-verify-otp/',
                method: "POST",
                body: { reset_token, otp }
            })

        }),
        confirmPassword: builder.mutation<{ message: string }, { reset_token: string, new_password: string }>({
            query: ({ reset_token, new_password }) => ({
                url: '/auth/password-reset-confirm/',
                method: "POST",
                body: { reset_token, new_password }
            })

        }),
        verifyEmail: builder.mutation<{ message: string; email: string }, { otp: string, email: string }>({
            query: ({ otp, email }) => ({
                url: "/auth/verify-otp/",
                method: "POST",
                body: { otp, email }
            })
        }),

        getProfileInfo: builder.query<User, void>({
            query: () => ({
                url: "/auth/profile/",
            })
        }),

        updateProfile: builder.mutation<User, { profile_pic?: string; full_name: string }>({
            query: (info) => ({
                url: "/auth/profile/",
                method: "PATCH",
                body: { ...info }
            })
        })
    })
})


export const { useCreateAccountMutation, useUpdateProfileMutation, useConfirmPasswordMutation, useSignInUserMutation, useVerifyResetOtpMutation, useVerifyEmailMutation, useSendOtpMutation, useForgotPasswordMutation, useGetProfileInfoQuery } = authSlice
