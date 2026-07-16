import { useEffect, useState } from "react";
import { CategoryFilter } from "../components/CategoryFilter";
import { ListingCard } from "../components/ListingCard";
import { fetchCategories, fetchListings } from "../services/listings.service";
import type { Category, Listing } from "../types";
import "./AppPages.css";

export function AppShowcasePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(({ categories }) => setCategories(categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      fetchListings({ category: selectedCategory ?? undefined, search: search || undefined })
        .then(({ listings }) => setListings(listings))
        .catch(() => setListings([]))
        .finally(() => setIsLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [selectedCategory, search]);

  return (
    <div className="app-page">
      <h1 className="app-page__title">Vitrine do campus</h1>

      <input
        type="search"
        className="app-page__search"
        placeholder="Buscar por título ou descrição..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      {isLoading ? (
        <p className="app-page__status">Carregando anúncios...</p>
      ) : listings.length === 0 ? (
        <p className="app-page__status">Nenhum anúncio encontrado.</p>
      ) : (
        <div className="app-page__grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
