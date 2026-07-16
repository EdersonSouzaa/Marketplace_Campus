import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt.js";
import { UnauthorizedError } from "../lib/errors.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de acesso ausente");
  }

  try {
    req.user = verifyToken(header.slice("Bearer ".length));
    next();
  } catch {
    throw new UnauthorizedError("Token de acesso inválido ou expirado");
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyToken(header.slice("Bearer ".length));
    } catch {
      // segue sem usuário autenticado; rota pública decide o que fazer
    }
  }
  next();
}
