import type { Recipe } from "../types";

interface Props {
  recipes: Recipe[];
  selectedId: string;
  onChange: (id: string) => void;
}

export default function RecipeSelect({ recipes, selectedId, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="recipe-select" className="text-sm font-medium text-stone-700 dark:text-stone-300">
        Recipe
      </label>
      <select
        id="recipe-select"
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
      >
        {recipes.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
