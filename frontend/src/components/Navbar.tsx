import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-mark">MC</span>
          Marketplace Campus
        </Link>

        <nav className="navbar__links">
          <a href="/#vitrine">Vitrine</a>
          <a href="/#como-funciona">Como funciona</a>
        </nav>

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/app" className="navbar__button navbar__button--ghost">
                Minha área
              </Link>
              <button type="button" className="navbar__button navbar__button--outline" onClick={handleSignOut}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__button navbar__button--ghost">
                Entrar
              </Link>
              <Link to="/registro" className="navbar__button navbar__button--solid">
                Anunciar um item
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
