import axios from "axios";
import {API_DEV_URL, API_PROD_URL} from "./application.json"

export const API_INSTANCE = axios.create({
  baseURL: process.env.NODE_ENV==="production" ? API_PROD_URL : API_DEV_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: (status) => status>=200 && status < 300,
});
