
import Cookies from "js-cookie";


export const setTokenInCookies = ({ access, refresh }: { access: string; refresh: string }) => {
    Cookies.set("access_token", access, {
        expires: 1,
        secure: false,
        sameSite: "lax",
        path: "/",
    });

    Cookies.set("refresh_token", refresh, {
        expires: 7,
        secure: false,
        sameSite: "lax",
        path: "/",
    });
}


export const clearAuthCookies = () => {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
};

export const getAccessToken = () =>
    Cookies.get("access_token");

export const getRefreshToken = () =>
    Cookies.get("refresh_token");
