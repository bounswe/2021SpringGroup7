import { API_INSTANCE } from "../config/api";

const ADMIN_SERVICE = {
    LOGIN: (adminUsername,adminPassword) => API_INSTANCE.post("/user/admin/login", {
                                                                                        "admin_username":adminUsername,
                                                                                        "admin_password":adminPassword
                                                                                        }),
    GET_REPORTEDUSER: () => API_INSTANCE.post("/user/admin/get_reported_users", {
                                                                                    "login_hash": localStorage.getItem('login_hash')
                                                                                    }),  
    GET_REPORTEDSTORY: () => API_INSTANCE.post("/user/admin/get_reported_stories", {
                                                                                    "login_hash": localStorage.getItem('login_hash')
                                                                                    }), 
    GET_REPORTEDCOMMENT: () => API_INSTANCE.post("/user/admin/get_reported_comments", {
                                                                                    "login_hash": localStorage.getItem('login_hash')
                                                                                    }),                                                                                                                                                                
    GET_REPORTEDTAG: () => API_INSTANCE.post("/user/admin/get_reported_tags", {
                                                                                    "login_hash": localStorage.getItem('login_hash')
                                                                                    }),  
    ACTION_REPORTEDUSER: (reportId, safe) => API_INSTANCE.post("/user/admin/action_reported_users", {
                                                                                    "login_hash": localStorage.getItem('login_hash'),
                                                                                    "report_id": reportId,
                                                                                    "safe": safe
                                                                                    }),  
    ACTION_REPORTEDSTORY: (reportId, safe) => API_INSTANCE.post("/user/admin/action_reported_stories", {
                                                                                    "login_hash": localStorage.getItem('login_hash'),
                                                                                    "report_id": reportId,
                                                                                    "safe": safe
                                                                                    }),    
    ACTION_REPORTEDCOMMENT: (reportId, safe) => API_INSTANCE.post("/user/admin/action_reported_comments", {
                                                                                    "login_hash": localStorage.getItem('login_hash'),
                                                                                    "report_id": reportId,
                                                                                    "safe": safe
                                                                                    }),                    
    ACTION_REPORTEDTAG: (reportId, safe) => API_INSTANCE.post("/user/admin/action_reported_tags", {
                                                                                    "login_hash": localStorage.getItem('login_hash'),
                                                                                    "report_id": reportId,
                                                                                    "safe": safe
                                                                                    }),                                                                                                                                                                                                                                                                                                                                                                                                                         
    };

export default ADMIN_SERVICE;