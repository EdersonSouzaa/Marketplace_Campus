import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH ?? "./data/campus.db";

mkdirSync(dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath, { enableForeignKeyConstraints: true });
db.exec("PRAGMA journal_mode = WAL");

const schema = readFileSync(join(currentDir, "schema.sql"), "utf-8");
db.exec(schema);
