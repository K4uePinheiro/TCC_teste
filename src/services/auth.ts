// src/types/auth.ts

// Defina a interface para o payload do seu token JWT
// Adapte os campos abaixo para refletir o que o seu token realmente contém.
// Exemplo: 'sub' para subject (ID do usuário), 'roles' para permissões, 'name', 'email', etc.
export interface JwtPayload {
  sub: string; // ID do usuário (subject)
  email: string;
  name: string;
  roles: string[];
  iat: number; // Issued At
  exp: number; // Expiration Time
  // Adicione outros campos que seu token possa ter
}

// Interface para o objeto User, que será usado no AuthContext
// Deve ser compatível com o que é extraído do token
export interface User {
  id: string;
  name: string;
  email: string;
  roles?: string[];
  picture?: string;
  // Adicione outros campos necessários
}
