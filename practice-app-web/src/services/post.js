import { API_INSTANCE } from "../config/api";

const POST_SERVICE = {
  GET_POSTS: (username) => API_INSTANCE.get(`/home/${username}`),
  GET_PROFILE: (username) => API_INSTANCE.get(`/user/${username}`),
  GET_FOLLOWING: (data) => API_INSTANCE.get(`/user/${data}/followings`),
  GET_POST: (data) => API_INSTANCE.get(`/story/${data}`),
  LIKE_POST: (data) =>
    API_INSTANCE.post(`/post/${data.postId}/likes/${data.username}`),
  COMMENT_POST: (data) =>
    API_INSTANCE.post(
      `/post/${data.postId}/comments/new/${data.username}`,
      data.comment,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "multipart/form-data",
          "x-applicationid": "1",
        },
      }
    ),
  GET_COMMENTS: (data) => API_INSTANCE.get(`/post/${data}/comments`),
  CREATE_POST: (data) => API_INSTANCE.post("/story/create", data),
  CREATE_LOCATION: (data) => API_INSTANCE.post("/locations/create", data),
};

export default POST_SERVICE;
