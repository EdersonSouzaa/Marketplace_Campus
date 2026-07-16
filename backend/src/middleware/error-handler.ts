import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors.js";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: { message: `Rota não encontrada: ${req.method} ${req.path}` } });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message, fields: err.fields } });
    return;
  }

  console.error(err);
  res.status(500).json({ error: { message: "Erro interno do servidor" } });
}
