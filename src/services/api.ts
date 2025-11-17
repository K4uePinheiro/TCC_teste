import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Intercepta requisições e adiciona o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepta respostas para renovar o token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const res = await api.post("/auth/refresh", { refreshToken });

          const newAccess = res.data.accessToken;
          const newRefresh = res.data.refreshToken;

          localStorage.setItem("access_token", newAccess);
          localStorage.setItem("refresh_token", newRefresh);

          api.defaults.headers.Authorization = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Erro ao renovar token:", refreshError);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
