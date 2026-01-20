import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/api_config";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
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
    "Agency",
    "Learners",
    "Dashboard",
    "Interview",
    "HiredApplicant",
    "AuditLog"
  ],
  endpoints: () => ({}),
});
