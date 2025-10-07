import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/", // conecta no json-server
});

export default api;