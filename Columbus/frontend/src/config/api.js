import axios from "axios";

export const API_INSTANCE = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-applicationid": "1",
  },
  validateStatus: (status) => status < 500,
});

function handleResponseInterceptor({ status, data, ...response }) {
  if (status === 401 || (data.error && data.error.code === 403)) {
    if (data.error.code === 403) alert(data.error.message);
  }

  return {
    success: status >= 200 && status < 500,
    ...data,
  };
}

API_INSTANCE.interceptors.response.use(handleResponseInterceptor);
