import type { Request, Response } from "express";
import * as userRepository from "../repositories/user.repository.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signToken } from "../lib/jwt.js";
import { loginSchema, parseOrThrow, registerSchema } from "../lib/validation.js";
import { ConflictError, UnauthorizedError } from "../lib/errors.js";
import type { PublicUser } from "../types/index.js";

function toPublicUser(user: { id: number; name: string; email: string }): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

export function register(req: Request, res: Response): void {
  const data = parseOrThrow(registerSchema, req.body);

  if (userRepository.findByEmail(data.email)) {
    throw new ConflictError("Já existe uma conta com este e-mail");
  }

  const user = userRepository.create(data.name, data.email, hashPassword(data.password));
  const token = signToken({ sub: user.id, name: user.name, email: user.email });

  res.status(201).json({ user: toPublicUser(user), token });
}

export function login(req: Request, res: Response): void {
  const data = parseOrThrow(loginSchema, req.body);

  const user = userRepository.findByEmail(data.email);
  if (!user || !verifyPassword(data.password, user.password_hash)) {
    throw new UnauthorizedError("E-mail ou senha incorretos");
  }

  const token = signToken({ sub: user.id, name: user.name, email: user.email });
  res.json({ user: toPublicUser(user), token });
}

export function me(req: Request, res: Response): void {
  const user = userRepository.findById(req.user!.sub);
  if (!user) {
    throw new UnauthorizedError("Usuário não encontrado");
  }
  res.json({ user: toPublicUser(user) });
}
