import { configureStore } from '@reduxjs/toolkit';
import { api } from './api/ApiSlice';
import setEmail from "@/store/api/authSlice/emailSlice/emailSlice";
export const store = configureStore({
  reducer: {
    emailInfo: setEmail,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;