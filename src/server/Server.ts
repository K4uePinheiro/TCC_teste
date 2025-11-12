import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
const PORT = 8080;

// Middleware para JSON
app.use(express.json());

// Configuração de CORS
app.use(
  cors({
    origin: "http://localhost:5175", // endereço do frontend (Vite)
    credentials: true,               // permite cookies/autenticação
  })
);

// Rotas de exemplo
app.get("/product", (_req: Request, res: Response) => {
  res.json([{ id: 1, name: "Produto de teste" }]);
});

app.get("/suppliers", (_req: Request, res: Response) => {
  res.json([{ id: 1, name: "Fornecedor de teste" }]);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
