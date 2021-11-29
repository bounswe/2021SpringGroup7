import { API_INSTANCE } from "../config/api";

const POST_SERVICE = {
  GET_POSTS: (username) => API_INSTANCE.get(`/posts/${username}/`),
  GET_POST: (postId) => API_INSTANCE.get(`/posts/${postId}/`),
  CREATE_POST: (postData) => API_INSTANCE.post("/posts/", postData),
  LIKE_POST: (postId, username) => API_INSTANCE.post(`/posts/${postId}/likes/${username}/`),
  GET_COMMENTS: (postId) => API_INSTANCE.get(`/posts/${postId}/comments/`),
  POST_COMMENT: (postId, username, comment) => API_INSTANCE.post(`/posts/${postId}/comments/${username}/`, comment),
};

export default POST_SERVICE;
