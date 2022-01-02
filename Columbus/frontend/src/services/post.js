import { API_INSTANCE } from "../config/api";

const POST_SERVICE = {
    GET_POSTS: (username) => API_INSTANCE.get(`/posts/${username}/`),
    GET_POST: (postId) => API_INSTANCE.get(`/posts/${postId}/`),
    CREATE_POST: (postData) => API_INSTANCE.post("/user/create_post/", postData),
    LIKE_POST: (data) => API_INSTANCE.post(`/user/like/`, data),
    GET_COMMENTS: (data) => API_INSTANCE.post(`/user/get_comments/`, data),
    POST_COMMENT: (comment) => API_INSTANCE.post(`/user/comment_create/`, comment),
    POST_DELETE: (data) => API_INSTANCE.post(`/user/delete_post/`, data),
    COMMENT_DELETE: (data) => API_INSTANCE.post(`/user/comment_delete/`, data)
};

export default POST_SERVICE;