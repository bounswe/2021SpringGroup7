import {API_INSTANCE} from './api';

export const SERVICE = {
  loginRequest: ({params, config}) => {
    return API_INSTANCE.post(`/guest/login/`, params, config);
  },
  registerRequest: ({params, config}) => {
    return API_INSTANCE.post(`/guest/register/`, params, config);
  },
  userInfo: data => {
    return API_INSTANCE.post(`/user/`, data);
  },
};
