import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EmailState {
    email: string;
    route: string
}

const initialState: EmailState = {
    email: "no email",
    route: "no route"

};

const emailSlice = createSlice({
    name: "email_data",
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<{email : string , route : string}>) => {
            state.email = action.payload.email;
            state.route = action.payload.route;
        },
        clearEmail: (state) => {
            state.email = "no email";
        },
    },
});

export const { setEmail, clearEmail } = emailSlice.actions;
export default emailSlice.reducer;
