import axios from "axios";
import { API_URL } from "./config";
import { getToken } from "@/utils/auth";

const axiosInstance = axios.create({
  baseURL: `${API_URL}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
