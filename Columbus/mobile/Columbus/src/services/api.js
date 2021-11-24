import axios from 'axios';

export const API_INSTANCE = axios.create({
  baseURL: 'http://ec2-35-158-103-6.eu-central-1.compute.amazonaws.com:8000',
  withCredentials: true,
  timeout: 1000 * 2,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-applicationid': '1',
  },
});

const handleResponseInterceptor = ({status, data, ...response}) => {
  if (status >= 200) {
    return {
      status,
      ...data,
    };
  }
  return {
    status,
    ...data,
  };
};

const errorInterceptor = error => {
  const status = error.response?.status;
  const data = error.response?.data;
  if (status < 500) {
    return {
      status,
      ...data,
    };
  }
  return Promise.reject(error);
};

API_INSTANCE.interceptors.response.use(
  handleResponseInterceptor,
  errorInterceptor,
);
