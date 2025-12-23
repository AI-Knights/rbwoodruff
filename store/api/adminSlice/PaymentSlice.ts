import { PaymentsResponse } from "@/types/admin/payment.type";
import { api } from "../ApiSlice";


export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentsResponse, void>({
      query: () => '/admin-panel/payments/',
      providesTags: ["Payment"]
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentApi;