import { API_INSTANCE } from "../config/api";

const USER_SERVICE = {
  GET_PROFILE: (username) => API_INSTANCE.get(`/users/${username}/profile/`),
  GET_FOLLOWING: (username) => API_INSTANCE.get(`/users/${username}/followings/`),
  GET_FOLLOWERS: (username) => API_INSTANCE.get(`/users/${username}/followers/`),
  GET_POSTS: (username) => API_INSTANCE.get(`/users/${username}/posts/`),
  GET_PROFILEINFO: (userId) => API_INSTANCE.get(`/user/get_profile/${userId}/`),
  SET_PROFILEINFO: (profileInfo) => API_INSTANCE.post(`/user/set_profile/`, profileInfo),
};

export default USER_SERVICE;
