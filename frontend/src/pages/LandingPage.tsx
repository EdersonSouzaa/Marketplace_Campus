import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { StatsSection } from "../components/StatsSection";
import { CTASection } from "../components/CTASection";
import { CategoryFilter } from "../components/CategoryFilter";
import { ListingCard } from "../components/ListingCard";
import { useAuth } from "../context/AuthContext";
import { fetchCategories, fetchListings } from "../services/listings.service";
import { fetchStats } from "../services/stats.service";
import type { Category, Listing, Stats } from "../types";
import "./LandingPage.css";

export function LandingPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => setStats(null));
    fetchCategories()
      .then(({ categories }) => setCategories(categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setIsLoadingListings(true);
    fetchListings({ category: selectedCategory ?? undefined })
      .then(({ listings }) => setListings(listings))
      .catch(() => setListings([]))
      .finally(() => setIsLoadingListings(false));
  }, [selectedCategory]);

  return (
    <>
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero__inner">
            <span className="hero__eyebrow">Economia circular no campus</span>
            <h1>O que você não usa mais pode ser exatamente o que um calouro está procurando.</h1>
            <p>
              O Marketplace Campus conecta estudantes para doar, vender e encontrar livros, calculadoras, jalecos,
              componentes eletrônicos e outros itens universitários — sem sair da própria faculdade.
            </p>
            <div className="hero__actions">
              <Link to={user ? "/app/novo" : "/registro"} className="hero__button hero__button--solid">
                Anunciar um item
              </Link>
              <a href="#vitrine" className="hero__button hero__button--outline">
                Buscar itens
              </a>
            </div>
          </div>
        </section>

        <StatsSection stats={stats} />

        <section id="vitrine" className="showcase">
          <div className="showcase__header">
            <h2>Últimos anúncios</h2>
            <p>Itens recém-publicados por estudantes do campus.</p>
          </div>

          <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

          {isLoadingListings ? (
            <p className="showcase__status">Carregando anúncios...</p>
          ) : listings.length === 0 ? (
            <p className="showcase__status">Nenhum anúncio encontrado nesta categoria ainda.</p>
          ) : (
            <div className="showcase__grid">
              {listings.slice(0, 8).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        <section id="como-funciona" className="how-it-works">
          <div className="how-it-works__header">
            <h2>Como funciona</h2>
          </div>
          <div className="how-it-works__grid">
            <div className="how-it-works__step">
              <span className="how-it-works__number">1</span>
              <h3>Cadastre-se com seu e-mail</h3>
              <p>Crie uma conta em segundos para anunciar ou acompanhar seus próprios itens.</p>
            </div>
            <div className="how-it-works__step">
              <span className="how-it-works__number">2</span>
              <h3>Anuncie ou explore</h3>
              <p>Publique o que você não usa mais ou filtre por categoria para achar o que precisa.</p>
            </div>
            <div className="how-it-works__step">
              <span className="how-it-works__number">3</span>
              <h3>Combine a retirada</h3>
              <p>Fale diretamente com quem anunciou e combine a doação ou a venda dentro do campus.</p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </>
  );
}
