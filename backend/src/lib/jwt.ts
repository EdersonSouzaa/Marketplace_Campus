import jwt from "jsonwebtoken";
import type { AuthPayload } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-nao-use-em-producao";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as AuthPayload;
}
