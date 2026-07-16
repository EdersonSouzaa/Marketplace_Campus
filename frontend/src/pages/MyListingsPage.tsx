import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListingCard } from "../components/ListingCard";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { deleteListing, fetchListings } from "../services/listings.service";
import type { Listing } from "../types";
import "./AppPages.css";

export function MyListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function loadListings() {
    setIsLoading(true);
    fetchListings({ mine: true })
      .then(({ listings }) => setListings(listings))
      .catch(() => setListings([]))
      .finally(() => setIsLoading(false));
  }

  useEffect(loadListings, []);

  async function handleConfirmDelete() {
    if (!listingToDelete) return;
    setIsDeleting(true);
    try {
      await deleteListing(listingToDelete.id);
      setListings((current) => current.filter((item) => item.id !== listingToDelete.id));
    } finally {
      setIsDeleting(false);
      setListingToDelete(null);
    }
  }

  return (
    <div className="app-page">
      <h1 className="app-page__title">Meus anúncios</h1>
      <p className="app-page__subtitle">Itens que você publicou no Marketplace Campus.</p>

      {isLoading ? (
        <p className="app-page__status">Carregando seus anúncios...</p>
      ) : listings.length === 0 ? (
        <div className="app-page__empty">
          <p>Você ainda não publicou nenhum item.</p>
          <Link to="/app/novo" className="auth-submit app-page__empty-cta">
            Anunciar meu primeiro item
          </Link>
        </div>
      ) : (
        <div className="app-page__grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onDelete={setListingToDelete} />
          ))}
        </div>
      )}

      {listingToDelete && (
        <ConfirmDialog
          title="Remover anúncio?"
          description={`"${listingToDelete.title}" será removido permanentemente do Marketplace Campus.`}
          confirmLabel={isDeleting ? "Removendo..." : "Remover"}
          onConfirm={handleConfirmDelete}
          onCancel={() => setListingToDelete(null)}
        />
      )}
    </div>
  );
}
