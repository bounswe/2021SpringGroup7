import axios from "axios";

export const API_INSTANCE = axios.create({
    baseURL:  process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    validateStatus: (status) => status >= 200 && status < 300,
});
