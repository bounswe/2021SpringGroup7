import { API_INSTANCE } from "../config/api";

const POST_SERVICE = {
    GET_POSTS: (username) => API_INSTANCE.get(`/posts/${username}/`),
    GET_POST: (postId) => API_INSTANCE.get(`/posts/${postId}/`),
    CREATE_POST: (postData) => API_INSTANCE.post("/user/create_post/", postData),
    LIKE_POST: (data) => API_INSTANCE.post(`/user/like/`, data),
    GET_COMMENTS: (postId) => API_INSTANCE.get(`/posts/${postId}/comments/`),
    POST_COMMENT: (postId, username, comment) => API_INSTANCE.post(`/posts/${postId}/comments/${username}/`, comment),
};

export default POST_SERVICE;