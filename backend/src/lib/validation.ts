import { z } from "zod";
import { CATEGORIES } from "../types/index.js";
import { AppError } from "./errors.js";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const createListingSchema = z
  .object({
    title: z.string().trim().min(3, "Título deve ter pelo menos 3 caracteres").max(120),
    description: z.string().trim().min(10, "Descrição deve ter pelo menos 10 caracteres").max(2000),
    category: z.enum(CATEGORIES, { errorMap: () => ({ message: "Categoria inválida" }) }),
    isDonation: z.boolean(),
    price: z.number().positive("Preço deve ser maior que zero").nullable(),
    imageUrl: z.string().trim().url("URL de imagem inválida"),
  })
  .refine((data) => data.isDonation || (data.price !== null && data.price !== undefined), {
    message: "Informe um preço ou marque o item como doação",
    path: ["price"],
  });

export const listingQuerySchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  search: z.string().trim().max(200).optional(),
  mine: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export function parseOrThrow<T>(schema: z.ZodType<T, z.ZodTypeDef, any>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "_";
      if (!fields[key]) fields[key] = issue.message;
    }
    throw new AppError(400, "Dados inválidos", fields);
  }
  return result.data;
}
