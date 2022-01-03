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
  fetchPost: async (params, token) => {
    return await API_INSTANCE.post(`/user/home_page/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },

  fetchNotifications: async (params, token) => {
    return await API_INSTANCE.post(`/user/get_notifications/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },

  fetchUserPosts: async (params, token) => {
    return await API_INSTANCE.post(`/user/profile_post/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },

  postStory: async (params, token) => {
    return await API_INSTANCE.post(`/user/create_post/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },

  postFollow: async (params, token) => {
    return await API_INSTANCE.post(`/user/follow/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },

  fetchUserInfo: params => {
    return API_INSTANCE.get(`/user/get_profile/${params.params.userId}/`, {
      headers: {Authorization: `TOKEN ${params.params.token}`},
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
  deleteComment: async ({params, token}) => {
    return await API_INSTANCE.post(`/user/comment_delete/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  editComment: async ({params, token}) => {
    return await API_INSTANCE.post(`/user/comment_update/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  pinComment: async ({params, token}) => {
    return await API_INSTANCE.post(`/user/pin_comment/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  reportComment: async ({params, token}) => {
    return await API_INSTANCE.post(`/user/report_comment/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  getLikes: async ({params, token}) => {
    const uri = (await '/user/get_likes/') + params + '/';
    return await API_INSTANCE.get(uri, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },

  getSearchUsers: async (params, token) => {
    return await API_INSTANCE.post(`/search/user_search/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },
  getSearch: async (params, token) => {
    
     return await API_INSTANCE.post(`/search/search/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },


  postBlockUser: async (params, token) => {
    return await API_INSTANCE.post(`/user/block/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  },

  postReportUser: async (params, token) => {
    return await API_INSTANCE.post(`/user/report_user/`, params, {
      headers: {Authorization: `TOKEN ${token}`},
    });
  }
}

  