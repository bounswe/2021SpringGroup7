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
                                                                                        }),
  GET_LIKEDPOSTS: (username,pageNumber,pageSize) => API_INSTANCE.post(`/user/get_user_likes/`,{
                                                                                          "username": username,
                                                                                          "page_number": pageNumber,
                                                                                          "page_size": pageSize

                                                                                          }),   
  GET_NOTIFICATIONS: (username) => API_INSTANCE.post(`/user/get_notifications/`,{
                                                                                  "user_name":username,
                                                                                  "limit": 20
                                                                                }), 
  GET_FOLLOWREQUEST: () => API_INSTANCE.get(`/user/get_follow_request/`), 
  
  ACCEPT_FOLLOWREQUEST: (request_id) => API_INSTANCE.post(`/user/accept_follow_request/`,{
                                                                                      "request_id": request_id,
                                                                                      "accept": true
                                                                                    }), 
 
  BLOCK_USER: (userThatBlocks, userThatIsBlocked) => API_INSTANCE.post(`/user/block/`, {
                                                                                        "user_id_block": userThatBlocks,
                                                                                        "block": userThatIsBlocked,
                                                                                        "action_block": true
                                                                                      }),   
  UNBLOCK_USER: (userThatBlocks, userThatIsBlocked) => API_INSTANCE.post(`/user/block/`, {
                                                                                          "user_id_block": userThatBlocks,
                                                                                          "block": userThatIsBlocked,
                                                                                          "action_block": false
                                                                                        }), 
  REPORT_USER: (reportedUser, reporterUser, reportMessage) => API_INSTANCE.post(`/user/report_user/`, {                                                                                    
                                                                                            "reported_username": reportedUser,
                                                                                            "reporter_username": reporterUser,
                                                                                            "report": reportMessage

                                                                                          }),  
  DELETE_PROFILE: (userId, password) => API_INSTANCE.post(`/user/delete_profile/`, {
                                                                                    "user_id": userId,
                                                                                    "password": password
                                                                                  }),                                                                                       
  SEARCH_USER: (searchText) => API_INSTANCE.post(`/search/user_search/`, {
                                                                          "search_text": searchText,
                                                                          page_number: 1,
                                                                          page_size: 99999
                                                                        }), 
  EXPLORE: () => API_INSTANCE.post(`/user/explore/`, {
                                                          "username": localStorage.getItem('username'),
                                                          "page_number": 1,
                                                          "page_size": 50
                                                      }),                                                                                                                                                           
};

export default USER_SERVICE;
