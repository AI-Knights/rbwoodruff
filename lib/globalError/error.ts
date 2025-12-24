import { ErrorResponse } from "@/types/error/error";

export const getErrorMessage = (error: ErrorResponse): string => {
    const message = Object.keys(error)[0]
    
  if (!message) return "Something went wrong";

  return error[message]?.[0] ?? "Something went wrong";

}


