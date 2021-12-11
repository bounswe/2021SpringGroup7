import axios from "axios";

export const API_INSTANCE = axios.create({
    baseURL: "http://ec2-18-197-57-123.eu-central-1.compute.amazonaws.com:8000",
    headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('jwtToken'),
        Accept: "application/json",
    },
    validateStatus: (status) => status >= 200 && status < 300,
});