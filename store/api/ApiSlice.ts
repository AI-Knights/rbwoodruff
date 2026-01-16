import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.neworkx.com",
    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint !== "updateProfile") {
        headers.set("Content-Type", "application/json");
      }

      if (typeof window !== "undefined") {
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];

        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: [
    "Employer",
    "Trainer",
    "Payment",
    "Trainee",
    "Category",
    "Job",
    "Trainings",
    "Application",
    "AgencyUser",
    "Case",
    "User",
    "Agency"
  ],
  endpoints: () => ({}),
});
