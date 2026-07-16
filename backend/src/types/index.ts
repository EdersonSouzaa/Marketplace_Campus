export const CATEGORIES = [
  "Livros",
  "Apostilas e Xerox",
  "Eletrônicos",
  "Calculadoras",
  "Material de Laboratório",
  "Jalecos e Uniformes",
  "Móveis",
  "Outros",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  category: Category;
  price: number | null;
  is_donation: 0 | 1;
  image_url: string;
  owner_id: number;
  owner_name: string;
  created_at: string;
}

export interface AuthPayload {
  sub: number;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
