import axios from "axios";
import {
  refreshErrorHandler,
  refreshInterceptor,
} from "./interceptors/refresh";

const axiosConfig = {
  baseURL: import.meta.env.VITE_API_SERVER_URL,
  timeout: 5000,
  withCredentials: true,
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(refreshInterceptor, refreshErrorHandler);

export default axiosInstance;
