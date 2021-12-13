import { API_INSTANCE } from "../config/api";

const USER_SERVICE = {
  GET_PROFILE: (username) => API_INSTANCE.get(`/users/${username}/profile/`),
  GET_FOLLOWING: (username) => API_INSTANCE.get(`/users/${username}/followings/`),
  GET_FOLLOWERS: (username) => API_INSTANCE.get(`/users/${username}/followers/`),
  GET_POSTS: (username) => API_INSTANCE.get(`/users/${username}/posts/`),
  GET_PROFILEINFO: (userId) => API_INSTANCE.get(`/user/get_profile/${userId}/`),
  SET_PROFILEINFO: (profileInfo) => API_INSTANCE.post(`/user/set_profile/`, profileInfo),
  FOLLOW_USER: (userId, followId) => API_INSTANCE.post(`/user/follow/`, {
                                                                                "user_id": userId,
                                                                                "follow": followId,
                                                                                "action_follow": true
                                                                              }),
  UNFOLLOW_USER: (userId, unfollowId) => API_INSTANCE.post(`/user/follow/`,{
                                                                                "user_id": userId,
                                                                                "follow": unfollowId,
                                                                                "action_follow": false
                                                                              }),
  GET_PROFILEPOSTS: (username,pageNumber,pageSize) => API_INSTANCE.post(`/user/profile_post/`,{
                                                                                          "username": username,
                                                                                          "page_number": pageNumber,
                                                                                          "page_size": pageSize
                                                                                        }),
  GET_HOMEPOSTS: (username,pageNumber,pageSize) => API_INSTANCE.post(`/user/home_page/`,{
                                                                                          "username": username,
                                                                                          "page_number": pageNumber,
                                                                                          "page_size": pageSize
                                                                                        })                                                                                      

};

export default USER_SERVICE;
