import { apiRequest } from "./api";
import type { User } from "../types";

interface AuthResponse {
  user: User;
  token: string;
}

export function register(name: string, email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: { name, email, password } });
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: { email, password } });
}

export function me(): Promise<{ user: User }> {
  return apiRequest<{ user: User }>("/auth/me", { auth: true });
}
