import { API_INSTANCE } from "../config/api";

const GUEST_SERVICE = {
  GET_HOMEPOSTS: (pageNumber,pageSize) => API_INSTANCE.post(`/guest/home_page/`,{
                                                                                "page_number": pageNumber,
                                                                                "page_size": pageSize
                                                                                        })                                                                                      

};

export default GUEST_SERVICE;
