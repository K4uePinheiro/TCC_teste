// Arquivo de configuração para variáveis sensíveis
export const config = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "587997109351-ro6laoog3jm33rfc6h6rmsl40mm8m90e.apps.googleusercontent.com",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8080"
};

// Para usar em outros arquivos:
// import { config } from './config';
// config.googleClientId
