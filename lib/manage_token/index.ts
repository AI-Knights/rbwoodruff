
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


export const setToken = ({ token_name, reset_token }: { token_name: string, reset_token: string }) => {
    Cookies.set(token_name, reset_token, {
        expires: 1,
        secure: false,
        sameSite: "lax",
        path: "/",
    });


}


export const clearAuthCookies = () => {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
};
export const clearToken = ({ tokenName }: { tokenName: string }) => {
    Cookies.remove(tokenName, { path: "/" });

};

export const getToken = ({ token_name }: { token_name: string }) =>
    Cookies.get(token_name);

export const getAccessToken = () =>
    Cookies.get("access_token");

export const getRefreshToken = () =>
    Cookies.get("refresh_token");
