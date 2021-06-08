import { API_INSTANCE } from "../config/api";

const POST_SERVICE = {
  GET_POSTS: () => API_INSTANCE.get("/home/atainan"),
};

export default POST_SERVICE;
