import { API_URL } from "../config/constants.js"
import axios from "axios";

const userManagementApi = axios.create({
    baseURL: API_URL,
});

userManagementApi.interceptors.request.use(config => {
    if(config.bearerToken) {
        let bearer = `Bearer ${config.bearerToken}`
        config.headers.Authorization = bearer
    }
    
    return config;
});

export default userManagementApi;