// lib/utils/decodeToken.ts

import { jwtDecode } from "jwt-decode";

// Exact interface matching your backend payload
interface DecodedToken {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: string;
    user_type: string;           // This is what we use for routing
    email: string;
    full_name: string;
    [key: string]: any;
}



export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error("Invalid or expired token:", error);
        return null;
    }
};



export const getUserType = (token: string): string => {
    const decoded = decodeToken(token);
    return decoded?.user_type || "unknown";
};

/**
 * Get dashboard route based on user_type from your app
 */
export const getDashboardRoute = (token: string): string => {
    if (!token) {
        return '#'
    }



    const userType = getUserType(token).toLowerCase();
    switch (userType) {
        case "employer":
            return "/employer-dashboard";

        case "training_provider":
            return "/training-provider-dashboard";

        case "agency":
            return "/agency-dashboard";


        default:
            return "/admin-dashboard";
    }




};

