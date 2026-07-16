import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <p className="footer__brand">Marketplace Campus</p>
          <p className="footer__tagline">Desapego e economia circular entre universitários.</p>
        </div>
        <p className="footer__copy">
          Projeto desenvolvido para o processo seletivo Vortex 2026. Dados de demonstração — não é um serviço em
          produção.
        </p>
      </div>
    </footer>
  );
}
