import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "./schema.js";

const dbPath = process.env.DATABASE_PATH ?? "./data/campus.db";

mkdirSync(dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath, { enableForeignKeyConstraints: true });
db.exec("PRAGMA journal_mode = WAL");
db.exec(SCHEMA_SQL);
