import type { Listing } from "../types";
import "./ListingCard.css";

function formatPrice(price: number | null): string {
  if (price === null) return "Doação";
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface ListingCardProps {
  listing: Listing;
  onDelete?: (listing: Listing) => void;
}

export function ListingCard({ listing, onDelete }: ListingCardProps) {
  const isDonation = listing.is_donation === 1;

  return (
    <article className="listing-card">
      <div className="listing-card__image-wrap">
        <img src={listing.image_url} alt={listing.title} loading="lazy" className="listing-card__image" />
        <span className={`listing-card__badge ${isDonation ? "listing-card__badge--donation" : ""}`}>
          {formatPrice(listing.price)}
        </span>
      </div>
      <div className="listing-card__body">
        <span className="listing-card__category">{listing.category}</span>
        <h3 className="listing-card__title">{listing.title}</h3>
        <p className="listing-card__description">{listing.description}</p>
        <div className="listing-card__footer">
          <span className="listing-card__owner">por {listing.owner_name}</span>
          {onDelete && (
            <button type="button" className="listing-card__delete" onClick={() => onDelete(listing)}>
              Remover
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
