import { db } from "../db/connection.js";
import type { Category, Listing } from "../types/index.js";

const SELECT_WITH_OWNER = `
  SELECT listings.*, users.name AS owner_name
  FROM listings
  JOIN users ON users.id = listings.owner_id
`;

interface ListingFilters {
  category?: Category;
  search?: string;
  ownerId?: number;
}

export function findMany(filters: ListingFilters): Listing[] {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.category) {
    conditions.push("listings.category = ?");
    params.push(filters.category);
  }
  if (filters.search) {
    conditions.push("(listings.title LIKE ? OR listings.description LIKE ?)");
    const term = `%${filters.search}%`;
    params.push(term, term);
  }
  if (filters.ownerId !== undefined) {
    conditions.push("listings.owner_id = ?");
    params.push(filters.ownerId);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `${SELECT_WITH_OWNER} ${where} ORDER BY listings.created_at DESC`;
  return db.prepare(sql).all(...params) as unknown as Listing[];
}

export function findById(id: number): Listing | undefined {
  return db.prepare(`${SELECT_WITH_OWNER} WHERE listings.id = ?`).get(id) as unknown as Listing | undefined;
}

interface CreateListingInput {
  title: string;
  description: string;
  category: Category;
  price: number | null;
  isDonation: boolean;
  imageUrl: string;
  ownerId: number;
}

export function create(input: CreateListingInput): Listing {
  const { lastInsertRowid } = db
    .prepare(
      `INSERT INTO listings (title, description, category, price, is_donation, image_url, owner_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.title,
      input.description,
      input.category,
      input.isDonation ? null : input.price,
      input.isDonation ? 1 : 0,
      input.imageUrl,
      input.ownerId,
    );
  return findById(Number(lastInsertRowid))!;
}

export function deleteById(id: number): void {
  db.prepare("DELETE FROM listings WHERE id = ?").run(id);
}

export function countAll(): number {
  const row = db.prepare("SELECT COUNT(*) AS total FROM listings").get() as { total: number };
  return row.total;
}

export function countDonations(): number {
  const row = db.prepare("SELECT COUNT(*) AS total FROM listings WHERE is_donation = 1").get() as {
    total: number;
  };
  return row.total;
}

export function countByCategory(): { category: string; total: number }[] {
  return db
    .prepare("SELECT category, COUNT(*) AS total FROM listings GROUP BY category ORDER BY total DESC")
    .all() as { category: string; total: number }[];
}
