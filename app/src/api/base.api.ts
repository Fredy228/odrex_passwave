import axios, { isAxiosError } from "axios";
import { get, set, remove } from "local-storage";
import { toast } from "react-toastify";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL + "/api";

const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_SERVER_URL + "/api",
});

$api.interceptors.request.use((config) => {
  const token = get<string>("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        console.log("refreshing");
        const { data } = await axios.get<{ accessToken: string }>(
          "/auth/refresh",
          {
            withCredentials: true,
          },
        );
        set("token", data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 401) {
          remove("token");
          toast.error("Your session has expired.");
          document.location.href = "/auth/login";
        } else {
          toast.error("Unknown session validation error");
        }
      }
    }
    throw error;
  },
);

export default $api;
