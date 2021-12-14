import { API_INSTANCE } from "../config/api";

const AUTHENTICATION_SERVICE = {
    LOG_IN: (username, password) => API_INSTANCE.post("/guest/login/", { username: username, password }),
    LOG_OUT: (userId) => API_INSTANCE.post(`/users/${userId}/logout/`),
    REGISTER: (data) => API_INSTANCE.post("/guest/register/", data),
};

export default AUTHENTICATION_SERVICE;