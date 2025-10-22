import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8080", 
  timeout: 10000,// ajuste aqui
  });
  api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
{/*"https://w6m310s8-8080.brs.devtunnels.ms"*/}