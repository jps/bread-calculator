import type { Ingredient } from "../types";

interface Props {
  ingredients: Ingredient[];
  multiplier: number;
  onUpdate: (ing: Ingredient, patch: Partial<Ingredient>) => void;
  onRemove: (ing: Ingredient) => void;
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
          <tr className="border-b border-stone-200 text-left text-stone-500 dark:border-stone-800 dark:text-stone-400">
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
              <td colSpan={6} className="py-6 text-center text-stone-400 dark:text-stone-500">
                No ingredients — add one below.
              </td>
            </tr>
          )}
          {ingredients.map((ing, index) => {
            const isWater = !!ing.isWater;
            const hydrationPercent =
              totalFlour > 0
                ? (ing.grams / totalFlour) * 100
                : 70;

            const handleHydrationChange = (newHydration: number) => {
              if (totalFlour > 0) {
                const newGrams = Math.round(((newHydration / 100) * totalFlour) * 10) / 10;
                onUpdate(ing, { grams: newGrams });
              }
            };

            return (
              <tr key={index} className="border-b border-stone-100 dark:border-stone-800">
                <td className="py-2 pr-2">
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="text"
                      value={ing.name}
                      placeholder="Ingredient name"
                      onChange={(e) => onUpdate(ing, { name: e.target.value })}
                      className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 hover:border-stone-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:hover:border-stone-700 dark:focus:bg-stone-800"
                    />
                    {isWater && (
                      <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                        <label
                          htmlFor={`hydration-slider-${index}`}
                          className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap"
                        >
                          Hydration:
                        </label>
                        <input
                          id={`hydration-slider-${index}`}
                          type="range"
                          min={0}
                          max={125}
                          step={1}
                          disabled={totalFlour === 0}
                          value={Math.round(hydrationPercent)}
                          onChange={(e) => handleHydrationChange(Number(e.target.value))}
                          className="w-28 sm:w-36 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-xs font-bold text-blue-800 dark:text-blue-200 tabular-nums min-w-[3.5rem]">
                          {formatGrams(hydrationPercent)}%
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-1.5 px-2 text-center">
                  {!isWater && (
                    <input
                      type="checkbox"
                      checked={!!ing.isFlour}
                      onChange={(e) => onUpdate(ing, { isFlour: e.target.checked })}
                      className="h-4 w-4 accent-amber-600"
                      aria-label={`${ing.name || "Ingredient"} is flour`}
                    />
                  )}
                </td>
                <td className="py-1.5 px-2 text-right align-top pt-2.5">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={ing.grams}
                    onChange={(e) => onUpdate(ing, { grams: Number(e.target.value) })}
                    className="w-20 rounded-md border border-transparent bg-transparent px-2 py-1 text-right hover:border-stone-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:hover:border-stone-700 dark:focus:bg-stone-800"
                  />
                </td>
                <td className="py-1.5 px-2 text-right font-medium text-stone-900 tabular-nums dark:text-stone-100 align-top pt-3.5">
                  {formatGrams((ing.grams || 0) * multiplier)}
                </td>
                <td className="py-1.5 px-2 text-right text-stone-500 tabular-nums dark:text-stone-400 align-top pt-3.5">
                  {bakersPercent(ing.grams || 0)}
                </td>
                <td className="py-1.5 pl-2 text-right align-top pt-2.5">
                  {!isWater && (
                    <button
                      type="button"
                      onClick={() => onRemove(ing)}
                      aria-label="Remove ingredient"
                      className="rounded-md px-2 py-1 text-stone-400 hover:bg-red-50 hover:text-red-600 dark:text-stone-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-stone-200 font-medium text-stone-700 dark:border-stone-700 dark:text-stone-300">
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
          <tr className="text-stone-500 dark:text-stone-400">
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
        className="mt-3 rounded-lg border border-dashed border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 hover:border-amber-500 hover:text-amber-700 dark:border-stone-700 dark:text-stone-400 dark:hover:border-amber-500 dark:hover:text-amber-400"
      >
        + Add ingredient
      </button>
    </div>
  );
}
