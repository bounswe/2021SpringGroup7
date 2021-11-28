import { API_INSTANCE } from "../config/api";

const USER_SERVICE = {
  GET_PROFILE: (username) => API_INSTANCE.get(`/users/${username}/profile/`),
  GET_FOLLOWING: (username) => API_INSTANCE.get(`/users/${username}/followings/`),
  GET_FOLLOWERS: (username) => API_INSTANCE.get(`/users/${username}/followers/`),
  GET_POSTS: (username) => API_INSTANCE.get(`/users/${username}/posts/`)
};

export default USER_SERVICE;
