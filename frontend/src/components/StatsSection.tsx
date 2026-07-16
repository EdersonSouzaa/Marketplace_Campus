import type { Stats } from "../types";
import "./StatsSection.css";

interface StatsSectionProps {
  stats: Stats | null;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const tiles = [
    { label: "Itens circulando no campus", value: stats?.totalListings ?? 0 },
    { label: "Itens doados por estudantes", value: stats?.totalDonations ?? 0 },
    { label: "Estudantes cadastrados", value: stats?.totalUsers ?? 0 },
    { label: "Categorias ativas", value: stats?.byCategory.length ?? 0 },
  ];

  return (
    <section className="stats-section" aria-label="Estatísticas do sistema">
      <div className="stats-section__grid">
        {tiles.map((tile) => (
          <div key={tile.label} className="stats-section__tile">
            <span className="stats-section__value">{tile.value}</span>
            <span className="stats-section__label">{tile.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
