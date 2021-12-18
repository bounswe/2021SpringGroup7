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
  fetchPost: async ({params, token}) => {
    return await API_INSTANCE.post(`/user/home_page/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },

  fetchUserInfo: (params, token) => {
    return API_INSTANCE.get(`/user/get_profile/${params}/`, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  postUserInfo: async (params, token) => {
    return await API_INSTANCE.post(`/user/set_profile/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  fetchComments: async ({params, token}) => {
    return await API_INSTANCE.post(`/user/get_comments/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  commentOnPost: async ({params, token}) => {
    return await API_INSTANCE.post(`/user/comment_create/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  like: async ({params, token}) => {
    return await API_INSTANCE.post(`/user/like/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
};
