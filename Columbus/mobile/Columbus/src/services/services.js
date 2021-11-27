import {API_INSTANCE} from './api';

export const SERVICE = {
  loginRequest: ({params, config}) => {
    return API_INSTANCE.post(`/guest/login/`, params, config);
  },
  registerRequest: data => {
    return API_INSTANCE.post(`/guest/register/`, data);
  },
  userInfo: data => {
    return API_INSTANCE.post(`/user/`, data);
  },
};
