import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RequestError } from "../services/api";
import "./AuthPages.css";

export function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await signUp(name, email, password);
      navigate("/app/novo");
    } catch (err) {
      if (err instanceof RequestError) {
        setError(err.message);
        setFieldErrors(err.fields ?? {});
      } else {
        setError("Não foi possível criar sua conta. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <Link to="/" className="auth-card__brand">
          Marketplace Campus
        </Link>
        <h1>Criar sua conta</h1>
        <p className="auth-card__subtitle">Leva menos de um minuto para começar a anunciar.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label htmlFor="name">Nome</label>
          <input id="name" required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
          {fieldErrors.name && <span className="auth-field__error">{fieldErrors.name}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          {fieldErrors.email && <span className="auth-field__error">{fieldErrors.email}</span>}
        </div>

        <div className="auth-field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          {fieldErrors.password && <span className="auth-field__error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>

        <p className="auth-card__footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
