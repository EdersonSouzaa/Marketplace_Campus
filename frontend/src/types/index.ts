export type Category =
  | "Livros"
  | "Apostilas e Xerox"
  | "Eletrônicos"
  | "Calculadoras"
  | "Material de Laboratório"
  | "Jalecos e Uniformes"
  | "Móveis"
  | "Outros";

export interface User {
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

export interface Stats {
  totalListings: number;
  totalDonations: number;
  totalSales: number;
  totalUsers: number;
  byCategory: { category: string; total: number }[];
}

export interface ApiError {
  error: {
    message: string;
    fields?: Record<string, string>;
  };
}
