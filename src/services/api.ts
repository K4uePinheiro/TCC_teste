import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
} from "axios";

// Permite usar a propriedade _retry nas configs do Axios
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Permite usar a propriedade _retry nas configs do Axios
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// ---------------------------------------------------------
// VARIÁVEIS DE AMBIENTE
// ---------------------------------------------------------
const API_BASE_URL = import.meta.env.VITE_API_URL;
const REFRESH_ENDPOINT = "/auth/refresh";

// ---------------------------------------------------------
// CONTROLE DE REFRESH
// ---------------------------------------------------------
let isRefreshing = false;

let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.config.headers = prom.config.headers || {};
      prom.config.headers["Authorization"] = `Bearer ${token}`;
      prom.resolve(axios(prom.config));
    }
  });

  failedQueue = [];
};

// ---------------------------------------------------------
// INSTÂNCIA DO AXIOS
// ---------------------------------------------------------
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------
// INTERCEPTOR DE REQUEST — ADICIONA O ACCESS TOKEN
// ---------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------
// INTERCEPTOR DE RESPONSE — RENOVA ACCESS TOKEN SE NECESSÁRIO
// ---------------------------------------------------------
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      originalRequest.url !== REFRESH_ENDPOINT &&
      !originalRequest._retry
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefresh } = response.data;

        // Salva novos tokens
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", newRefresh);

        processQueue(null, accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        // Logout automático caso o refresh falhe
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
