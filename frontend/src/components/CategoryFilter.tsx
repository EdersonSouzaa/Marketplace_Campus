import type { Category } from "../types";
import "./CategoryFilter.css";

interface CategoryFilterProps {
  categories: Category[];
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="category-filter" role="group" aria-label="Filtrar por categoria">
      <button
        type="button"
        className={`category-filter__pill ${selected === null ? "category-filter__pill--active" : ""}`}
        onClick={() => onSelect(null)}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-filter__pill ${selected === category ? "category-filter__pill--active" : ""}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
