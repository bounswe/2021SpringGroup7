import {API_INSTANCE} from './api';

export const SERVICE = {
  loginRequest: data => {
    return API_INSTANCE.post(`/guest/login/`, data);
  },
  registerRequest: data => {
    return API_INSTANCE.post(`/guest/register/`, data);
  },
};
