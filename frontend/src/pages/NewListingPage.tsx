import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createListing, fetchCategories } from "../services/listings.service";
import { RequestError } from "../services/api";
import type { Category } from "../types";
import "./AppPages.css";
import "./NewListingPage.css";

export function NewListingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isDonation, setIsDonation] = useState(false);
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(({ categories }) => setCategories(categories))
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!category) {
      setFieldErrors({ category: "Selecione uma categoria" });
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing({
        title,
        description,
        category,
        isDonation,
        price: isDonation ? null : Number(price),
        imageUrl,
      });
      navigate("/app/meus-anuncios");
    } catch (err) {
      if (err instanceof RequestError) {
        setError(err.message);
        setFieldErrors(err.fields ?? {});
      } else {
        setError("Não foi possível publicar o anúncio. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app-page">
      <h1 className="app-page__title">Anunciar um item</h1>
      <p className="app-page__subtitle">Preencha os dados abaixo. Leva menos de um minuto.</p>

      <form className="listing-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label htmlFor="title">Título</label>
          <input id="title" required value={title} onChange={(event) => setTitle(event.target.value)} />
          {fieldErrors.title && <span className="auth-field__error">{fieldErrors.title}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            required
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {fieldErrors.description && <span className="auth-field__error">{fieldErrors.description}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="category">Categoria</label>
          <select id="category" required value={category} onChange={(event) => setCategory(event.target.value as Category)}>
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {fieldErrors.category && <span className="auth-field__error">{fieldErrors.category}</span>}
        </div>

        <label className="listing-form__donation-toggle">
          <input type="checkbox" checked={isDonation} onChange={(event) => setIsDonation(event.target.checked)} />
          Este item é para doação (sem cobrar nada)
        </label>

        {!isDonation && (
          <div className="auth-field">
            <label htmlFor="price">Preço (R$)</label>
            <input
              id="price"
              type="number"
              min="0.01"
              step="0.01"
              required={!isDonation}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
            {fieldErrors.price && <span className="auth-field__error">{fieldErrors.price}</span>}
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="imageUrl">URL da imagem</label>
          <input
            id="imageUrl"
            type="url"
            required
            placeholder="https://..."
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
          {fieldErrors.imageUrl && <span className="auth-field__error">{fieldErrors.imageUrl}</span>}
        </div>

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSubmitting ? "Publicando..." : "Publicar anúncio"}
        </button>
      </form>
    </div>
  );
}
