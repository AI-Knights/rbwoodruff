import type { PaymentsResponse } from "@/types/admin/payment.type";
import { api } from "../ApiSlice";

export const paymentApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentsResponse, void>({
      query: () => ({
        url: "/admin-panel/payments/",
      }),
      providesTags: ["Payment"],
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentApiSlice;
