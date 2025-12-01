import axios, { type AxiosInstance, AxiosError, type AxiosRequestConfig } from 'axios';

// Variáveis de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL;
const REFRESH_ENDPOINT = '/auth/refresh'; // Endpoint comum para renovação de token

// Variável para controlar se o token está sendo renovado
let isRefreshing = false;
// Array de requisições pendentes que serão repetidas após a renovação
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; config: AxiosRequestConfig }[] = [];

// Função para processar a fila de requisições pendentes
const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            // Repete a requisição com o novo token
            prom.config.headers = prom.config.headers || {};
            prom.config.headers['Authorization'] = `Bearer ${token}`;
            prom.resolve(axios(prom.config));
        }
    });

    failedQueue = [];
};

// 1. Cria a instância do Axios
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor de Requisição (Adiciona o Access Token)
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor de Resposta (Lida com o 401 e renova o token)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Verifica se é um erro 401 (Unauthorized) e se não é a requisição de refresh token
        if (error.response?.status === 401 && originalRequest && originalRequest.url !== REFRESH_ENDPOINT) {
            // Se o token já estiver sendo renovado, adiciona a requisição à fila
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                });
            }

            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            // Se não houver refresh token, ou se a renovação falhar, faz logout
            if (!refreshToken) {
                // Redireciona para o login (ou chama a função de logout do AuthContext)
                // window.location.href = '/login'; 
                return Promise.reject(error);
            }

            try {
                // Tenta renovar o token
                const response = await axios.post(`${API_BASE_URL}${REFRESH_ENDPOINT}`, { refreshToken });
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

                // Salva os novos tokens
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Processa a fila de requisições pendentes
                processQueue(null, newAccessToken);

                // Repete a requisição original com o novo token
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);

            } catch (refreshError) {
                // Se a renovação falhar, faz logout e rejeita todas as requisições na fila
                processQueue(refreshError as AxiosError, null);
                // Redireciona para o login (ou chama a função de logout do AuthContext)
                // window.location.href = '/login'; 
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;