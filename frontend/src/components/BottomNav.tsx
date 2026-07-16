import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const NAV_ITEMS = [
  { to: "/app", label: "Vitrine", end: true },
  { to: "/app/novo", label: "Anunciar", end: false },
  { to: "/app/meus-anuncios", label: "Meus itens", end: false },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação do aplicativo">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
