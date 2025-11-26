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

// ✅ CORREÇÃO 1: Usar uma Promise ao invés de flag booleana
let refreshTokenPromise: Promise<string> | null = null;

// --- INTERCEPTOR DE RESPOSTA (Renova o token automaticamente) ---
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // ✅ CORREÇÃO 2: Verificar se a requisição falhou é do próprio refresh
    // Evita loop infinito se o refresh falhar
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

      // ✅ CORREÇÃO 3: Se já existe um refresh em andamento, aguarda ele
      if (refreshTokenPromise) {
        try {
          const newAccessToken = await refreshTokenPromise;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // ✅ CORREÇÃO 4: Criar uma Promise compartilhada para o refresh
      refreshTokenPromise = (async () => {
        try {
          // ✅ CORREÇÃO 5: Enviar refreshToken no body ou header conforme sua API espera
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken }, // Se sua API espera no body
            { 
              withCredentials: true,
              // ✅ Alternativa: Se sua API espera no header, use:
              // headers: { Authorization: `Bearer ${refreshToken}` }
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = res.data;

          if (!accessToken) {
            throw new Error("AccessToken não retornado pela API");
          }

          localStorage.setItem("access_token", accessToken);
          
          // ✅ CORREÇÃO 6: Só atualiza o refreshToken se vier um novo
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

          // ✅ CORREÇÃO 7: Atualizar o header padrão do axios
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          return accessToken;
        } catch (err) {
          console.error("Erro ao renovar token:", err);
          localStorage.clear();
          window.location.href = "/login";
          throw err;
        } finally {
          // ✅ CORREÇÃO 8: Limpar a Promise após conclusão
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