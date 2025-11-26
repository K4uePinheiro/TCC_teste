import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// --- INTERCEPTOR DE REQUISIÇÃO (Adiciona Bearer Token) ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refreshTokenPromise: Promise<string> | null = null;

// --- INTERCEPTOR DE RESPOSTA (Renova o token automaticamente) ---
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Se a requisição falhou é do próprio refresh, desloga
    if (originalRequest.url?.includes('/auth/refresh')) {
      localStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Se o token expirou (401) e ainda não tentamos fazer refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Se já existe um refresh em andamento, aguarda ele
      if (refreshTokenPromise) {
        try {
          const newAccessToken = await refreshTokenPromise;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Criar uma Promise compartilhada para o refresh
      refreshTokenPromise = (async () => {
        try {
          // ✅ CORREÇÃO ALTERNATIVA: Enviar o refreshToken no HEADER Authorization
          // Isso é mais seguro e comum. Se sua API espera no body, use a versão anterior.
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {}, // Body vazio, pois o token está no header
            { 
              withCredentials: true,
              headers: { 
                Authorization: `Bearer ${refreshToken}` // Enviando o refresh token no header
              }
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = res.data;

          if (!accessToken) {
            throw new Error("AccessToken não retornado pela API");
          }

          localStorage.setItem("access_token", accessToken);
          
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          return accessToken;
        } catch (err) {
          console.error("Erro ao renovar token:", err);
          localStorage.clear();
          window.location.href = "/login";
          throw err;
        } finally {
          refreshTokenPromise = null;
        }
      })();

      try {
        const newAccessToken = await refreshTokenPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;