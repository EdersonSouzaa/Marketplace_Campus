import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BottomNav } from "./BottomNav";
import "./AppLayout.css";

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  return (
    <div className="app-layout">
      <header className="app-layout__header">
        <Link to="/app" className="app-layout__brand">
          Marketplace Campus
        </Link>
        <div className="app-layout__user">
          <span>Olá, {user?.name.split(" ")[0]}</span>
          <button type="button" onClick={handleSignOut}>
            Sair
          </button>
        </div>
      </header>

      <div className="app-layout__body">
        <BottomNav />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
