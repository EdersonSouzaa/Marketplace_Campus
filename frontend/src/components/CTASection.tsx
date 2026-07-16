import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./CTASection.css";

export function CTASection() {
  const { user } = useAuth();

  return (
    <section className="cta-section">
      <div className="cta-section__inner">
        <h2>Tem algo parado que outro estudante precisa?</h2>
        <p>
          Cadastre em menos de um minuto ou encontre exatamente o que falta para o seu semestre — de livros a
          jalecos, tudo dentro do próprio campus.
        </p>
        <div className="cta-section__actions">
          <Link to={user ? "/app/novo" : "/registro"} className="cta-section__button cta-section__button--solid">
            Anunciar um item
          </Link>
          <a href="/#vitrine" className="cta-section__button cta-section__button--outline">
            Buscar itens
          </a>
        </div>
      </div>
    </section>
  );
}
