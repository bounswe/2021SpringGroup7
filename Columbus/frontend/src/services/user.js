import { API_INSTANCE } from "../config/api";

const USER_SERVICE = {
  GET_PROFILE: (username) => API_INSTANCE.get(`/users/${username}/profile/`),
  GET_FOLLOWING: (username) => API_INSTANCE.get(`/users/${username}/followings/`),
  GET_FOLLOWERS: (username) => API_INSTANCE.get(`/users/${username}/followers/`),
  GET_PROFILEPOSTS: (username,pageNumber,pageSize) => API_INSTANCE.post(`/user/profile_post/`,{
                                                                                          "username": username,
                                                                                          "page_number": pageNumber,
                                                                                          "page_size": pageSize
                                                                                        })
};

export default USER_SERVICE;
