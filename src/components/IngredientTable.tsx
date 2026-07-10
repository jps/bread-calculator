import type { Ingredient } from "../types";

interface Props {
  ingredients: Ingredient[];
  multiplier: number;
  onUpdate: (index: number, patch: Partial<Ingredient>) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

function formatGrams(value: number) {
  // Show up to 1 decimal for small amounts, whole numbers otherwise.
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export default function IngredientTable({
  ingredients,
  multiplier,
  onUpdate,
  onRemove,
  onAdd,
}: Props) {
  const totalFlour = ingredients
    .filter((i) => i.isFlour)
    .reduce((sum, i) => sum + (i.grams || 0), 0);
  const totalDough = ingredients.reduce((sum, i) => sum + (i.grams || 0), 0);

  const bakersPercent = (grams: number) =>
    totalFlour > 0 ? `${formatGrams((grams / totalFlour) * 100)}%` : "—";

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-left text-stone-500">
            <th className="py-2 pr-2 font-medium">Ingredient</th>
            <th className="w-16 py-2 px-2 text-center font-medium">Flour?</th>
            <th className="w-24 py-2 px-2 text-right font-medium">Base (g)</th>
            <th className="w-24 py-2 px-2 text-right font-medium">Scaled (g)</th>
            <th className="w-20 py-2 px-2 text-right font-medium">Baker&apos;s %</th>
            <th className="w-10 py-2 pl-2" aria-label="Remove" />
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-stone-400">
                No ingredients — add one below.
              </td>
            </tr>
          )}
          {ingredients.map((ing, index) => (
            <tr key={index} className="border-b border-stone-100">
              <td className="py-1.5 pr-2">
                <input
                  type="text"
                  value={ing.name}
                  placeholder="Ingredient name"
                  onChange={(e) => onUpdate(index, { name: e.target.value })}
                  className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 hover:border-stone-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </td>
              <td className="py-1.5 px-2 text-center">
                <input
                  type="checkbox"
                  checked={!!ing.isFlour}
                  onChange={(e) => onUpdate(index, { isFlour: e.target.checked })}
                  className="h-4 w-4 accent-amber-600"
                  aria-label={`${ing.name || "Ingredient"} is flour`}
                />
              </td>
              <td className="py-1.5 px-2 text-right">
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={ing.grams}
                  onChange={(e) => onUpdate(index, { grams: Number(e.target.value) })}
                  className="w-20 rounded-md border border-transparent bg-transparent px-2 py-1 text-right hover:border-stone-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </td>
              <td className="py-1.5 px-2 text-right font-medium text-stone-900 tabular-nums">
                {formatGrams((ing.grams || 0) * multiplier)}
              </td>
              <td className="py-1.5 px-2 text-right text-stone-500 tabular-nums">
                {bakersPercent(ing.grams || 0)}
              </td>
              <td className="py-1.5 pl-2 text-right">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label="Remove ingredient"
                  className="rounded-md px-2 py-1 text-stone-400 hover:bg-red-50 hover:text-red-600"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-stone-200 font-medium text-stone-700">
            <td className="py-2 pr-2">Total dough</td>
            <td />
            <td className="py-2 px-2 text-right tabular-nums">{formatGrams(totalDough)}</td>
            <td className="py-2 px-2 text-right tabular-nums">
              {formatGrams(totalDough * multiplier)}
            </td>
            <td className="py-2 px-2 text-right tabular-nums">
              {totalFlour > 0 ? `${formatGrams((totalDough / totalFlour) * 100)}%` : "—"}
            </td>
            <td />
          </tr>
          <tr className="text-stone-500">
            <td className="py-1 pr-2">Total flour</td>
            <td />
            <td className="py-1 px-2 text-right tabular-nums">{formatGrams(totalFlour)}</td>
            <td className="py-1 px-2 text-right tabular-nums">
              {formatGrams(totalFlour * multiplier)}
            </td>
            <td className="py-1 px-2 text-right tabular-nums">
              {totalFlour > 0 ? "100%" : "—"}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 hover:border-amber-500 hover:text-amber-700"
      >
        + Add ingredient
      </button>
    </div>
  );
}
