import { IRegister, UserRegistrationPayload } from "@/types/auth/auth";
import { api } from "../ApiSlice";
import { setTokenInCookies } from "@/lib/manage_token";


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

        verifyEmail: builder.mutation<{ message: string; email: string }, { otp: string, email: string }>({
            query: ({ otp, email }) => ({
                url: "/auth/verify-otp/",
                method: "POST",
                body: { otp, email }
            })
        })
    })
})


export const { useCreateAccountMutation, useSignInUserMutation, useVerifyEmailMutation, useSendOtpMutation } = authSlice
