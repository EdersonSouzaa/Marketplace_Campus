import { db } from "../db/connection.js";
import type { User } from "../types/index.js";

export function findByEmail(email: string): User | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
}

export function findById(id: number): User | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

export function create(name: string, email: string, passwordHash: string): User {
  const { lastInsertRowid } = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name, email, passwordHash);
  return findById(Number(lastInsertRowid))!;
}

export function countAll(): number {
  const row = db.prepare("SELECT COUNT(*) AS total FROM users").get() as { total: number };
  return row.total;
}
