import { API_INSTANCE } from "../config/api";

const POST_SERVICE = {
    GET_POSTS: (username) => API_INSTANCE.get(`/posts/${username}/`),
    GET_POST: (postId) => API_INSTANCE.get(`/posts/${postId}/`),
    CREATE_POST: (postData) => API_INSTANCE.post("/user/create_post/", postData),
    LIKE_POST: (data) => API_INSTANCE.post(`/user/like/`, data),
    GET_COMMENTS: (data) => API_INSTANCE.post(`/user/get_comments/`, data),
    POST_COMMENT: (comment) => API_INSTANCE.post(`/user/comment_create/`, comment),
    POST_EDIT: (data) => API_INSTANCE.post(`/user/edit_post/`, data),
    POST_DELETE: (data) => API_INSTANCE.post(`/user/delete_post/`, data),
    POST_REPORT: (data) => API_INSTANCE.post(`/user/report_story/`, data),
    COMMENT_DELETE: (data) => API_INSTANCE.post(`/user/comment_delete/`, data),
    COMMENT_PIN: (data) => API_INSTANCE.post(`/user/pin_comment/`, data),
    SEARCH: (data, username) => 
        API_INSTANCE.post("/search/search/", {
            ...data,
            page_number: 1,
            page_size: 10000,
            username: username
        })
};

export default POST_SERVICE;