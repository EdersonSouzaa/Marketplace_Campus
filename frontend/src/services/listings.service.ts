import { apiRequest } from "./api";
import type { Category, Listing } from "../types";

export interface ListingFilters {
  category?: Category;
  search?: string;
  mine?: boolean;
}

export function fetchListings(filters: ListingFilters = {}): Promise<{ listings: Listing[] }> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.mine) params.set("mine", "true");

  const query = params.toString();
  return apiRequest<{ listings: Listing[] }>(`/listings${query ? `?${query}` : ""}`, {
    auth: Boolean(filters.mine),
  });
}

export function fetchListing(id: number): Promise<{ listing: Listing }> {
  return apiRequest<{ listing: Listing }>(`/listings/${id}`);
}

export function fetchCategories(): Promise<{ categories: Category[] }> {
  return apiRequest<{ categories: Category[] }>("/listings/categories");
}

export interface NewListingInput {
  title: string;
  description: string;
  category: Category;
  isDonation: boolean;
  price: number | null;
  imageUrl: string;
}

export function createListing(input: NewListingInput): Promise<{ listing: Listing }> {
  return apiRequest<{ listing: Listing }>("/listings", { method: "POST", body: input, auth: true });
}

export function deleteListing(id: number): Promise<void> {
  return apiRequest<void>(`/listings/${id}`, { method: "DELETE", auth: true });
}
