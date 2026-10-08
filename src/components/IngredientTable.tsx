import { useState, useRef, useEffect } from "react";
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

function EllipsisMenu({
  ing,
  onUpdate,
  onRemove,
}: {
  ing: Ingredient;
  onUpdate: (ing: Ingredient, patch: Partial<Ingredient>) => void;
  onRemove: (ing: Ingredient) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (ing.isWater) {
    return <div className="w-8 h-8" />;
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Ingredient options"
        className="flex h-8 w-8 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-stone-800 dark:ring-stone-700">
          <button
            type="button"
            onClick={() => {
              onUpdate(ing, { isFlour: !ing.isFlour });
              setOpen(false);
            }}
            className="flex w-full items-center px-4 py-2 text-xs text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-700/60"
          >
            {ing.isFlour ? "Unset flour" : "Set as flour"}
          </button>
          <button
            type="button"
            onClick={() => {
              onRemove(ing);
              setOpen(false);
            }}
            className="flex w-full items-center px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Remove ingredient
          </button>
        </div>
      )}
    </div>
  );
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
    <div className="w-full">
      {/* Mobile Card / Stacked Layout (< sm) */}
      <div className="block sm:hidden space-y-3">
        {ingredients.length === 0 && (
          <div className="py-6 text-center text-stone-400 dark:text-stone-500">
            No ingredients — add one below.
          </div>
        )}
        {ingredients.map((ing, index) => {
          const isWater = !!ing.isWater;
          const hydrationPercent =
            totalFlour > 0 ? (ing.grams / totalFlour) * 100 : 70;

          const handleHydrationChange = (newHydration: number) => {
            if (totalFlour > 0) {
              const newGrams =
                Math.round(((newHydration / 100) * totalFlour) * 10) / 10;
              onUpdate(ing, { grams: newGrams });
            }
          };

          return (
            <div
              key={index}
              className="border-b border-stone-100 dark:border-stone-800 pb-3 space-y-2"
            >
              {/* Row 1: Ingredient Name + Flour Badge + Ellipsis Menu */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <input
                    type="text"
                    value={ing.name}
                    placeholder="Ingredient name"
                    onChange={(e) => onUpdate(ing, { name: e.target.value })}
                    className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 font-medium text-stone-900 dark:text-stone-100 hover:border-stone-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:hover:border-stone-700 dark:focus:bg-stone-800"
                  />
                  {ing.isFlour && (
                    <span className="shrink-0 rounded bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                      Flour
                    </span>
                  )}
                </div>
                <EllipsisMenu
                  ing={ing}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              </div>

              {/* Water Hydration Slider */}
              {isWater && (
                <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                  <label
                    htmlFor={`hydration-slider-mobile-${index}`}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap"
                  >
                    Hydration:
                  </label>
                  <input
                    id={`hydration-slider-mobile-${index}`}
                    type="range"
                    min={0}
                    max={125}
                    step={1}
                    disabled={totalFlour === 0}
                    value={Math.round(hydrationPercent)}
                    onChange={(e) =>
                      handleHydrationChange(Number(e.target.value))
                    }
                    className="w-full accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-200 tabular-nums min-w-[3rem] text-right">
                    {formatGrams(hydrationPercent)}%
                  </span>
                </div>
              )}

              {/* Row 2: Overflowed Weights (Base, Scaled, Baker's %) */}
              <div className="grid grid-cols-3 gap-2 pt-1 px-1">
                <div>
                  <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-0.5">
                    Base (g)
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={ing.grams}
                    onChange={(e) =>
                      onUpdate(ing, { grams: Number(e.target.value) })
                    }
                    className="w-full rounded-md border border-stone-200 bg-white px-2 py-1 text-sm hover:border-stone-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-0.5">
                    Scaled (g)
                  </span>
                  <span className="block py-1 text-sm font-medium text-stone-900 dark:text-stone-100 tabular-nums">
                    {formatGrams((ing.grams || 0) * multiplier)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-0.5">
                    Baker&apos;s %
                  </span>
                  <span className="block py-1 text-sm text-stone-600 dark:text-stone-400 tabular-nums">
                    {bakersPercent(ing.grams || 0)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Mobile Totals Footer */}
        <div className="pt-2 border-t-2 border-stone-200 dark:border-stone-700 space-y-1.5 text-xs">
          <div className="grid grid-cols-4 font-medium text-stone-700 dark:text-stone-300">
            <span className="col-span-1">Total dough</span>
            <span className="text-right tabular-nums">{formatGrams(totalDough)}g</span>
            <span className="text-right tabular-nums">
              {formatGrams(totalDough * multiplier)}g
            </span>
            <span className="text-right tabular-nums">
              {totalFlour > 0
                ? `${formatGrams((totalDough / totalFlour) * 100)}%`
                : "—"}
            </span>
          </div>
          <div className="grid grid-cols-4 text-stone-500 dark:text-stone-400">
            <span className="col-span-1">Total flour</span>
            <span className="text-right tabular-nums">{formatGrams(totalFlour)}g</span>
            <span className="text-right tabular-nums">
              {formatGrams(totalFlour * multiplier)}g
            </span>
            <span className="text-right tabular-nums">
              {totalFlour > 0 ? "100%" : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Table Layout (>= sm) */}
      <table className="hidden sm:table w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-left text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <th className="py-2 pr-2 font-medium">Ingredient</th>
            <th className="w-24 py-2 px-2 text-right font-medium">Base (g)</th>
            <th className="w-24 py-2 px-2 text-right font-medium">Scaled (g)</th>
            <th className="w-20 py-2 px-2 text-right font-medium">Baker&apos;s %</th>
            <th className="w-10 py-2 pl-2 text-right" aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-6 text-center text-stone-400 dark:text-stone-500"
              >
                No ingredients — add one below.
              </td>
            </tr>
          )}
          {ingredients.map((ing, index) => {
            const isWater = !!ing.isWater;
            const hydrationPercent =
              totalFlour > 0 ? (ing.grams / totalFlour) * 100 : 70;

            const handleHydrationChange = (newHydration: number) => {
              if (totalFlour > 0) {
                const newGrams =
                  Math.round(((newHydration / 100) * totalFlour) * 10) / 10;
                onUpdate(ing, { grams: newGrams });
              }
            };

            return (
              <tr
                key={index}
                className="border-b border-stone-100 dark:border-stone-800"
              >
                {/* Ingredient Name & Hydration Slider */}
                <td className="py-2 pr-2">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ing.name}
                        placeholder="Ingredient name"
                        onChange={(e) =>
                          onUpdate(ing, { name: e.target.value })
                        }
                        className="w-full rounded-md border border-transparent bg-transparent px-2 py-1 hover:border-stone-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:hover:border-stone-700 dark:focus:bg-stone-800"
                      />
                      {ing.isFlour && (
                        <span className="shrink-0 rounded bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                          Flour
                        </span>
                      )}
                    </div>
                    {isWater && (
                      <div className="flex items-center gap-2.5 px-2 py-1 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                        <label
                          htmlFor={`hydration-slider-desktop-${index}`}
                          className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap"
                        >
                          Hydration:
                        </label>
                        <input
                          id={`hydration-slider-desktop-${index}`}
                          type="range"
                          min={0}
                          max={125}
                          step={1}
                          disabled={totalFlour === 0}
                          value={Math.round(hydrationPercent)}
                          onChange={(e) =>
                            handleHydrationChange(Number(e.target.value))
                          }
                          className="w-36 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="text-xs font-bold text-blue-800 dark:text-blue-200 tabular-nums min-w-[3.5rem]">
                          {formatGrams(hydrationPercent)}%
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Base (g) */}
                <td className="py-1.5 px-2 text-right align-top pt-2.5">
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={ing.grams}
                    onChange={(e) =>
                      onUpdate(ing, { grams: Number(e.target.value) })
                    }
                    className="w-20 rounded-md border border-transparent bg-transparent px-2 py-1 text-right hover:border-stone-200 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:hover:border-stone-700 dark:focus:bg-stone-800"
                  />
                </td>

                {/* Scaled (g) */}
                <td className="py-1.5 px-2 text-right font-medium text-stone-900 tabular-nums dark:text-stone-100 align-top pt-3.5">
                  {formatGrams((ing.grams || 0) * multiplier)}
                </td>

                {/* Baker's % */}
                <td className="py-1.5 px-2 text-right text-stone-500 tabular-nums dark:text-stone-400 align-top pt-3.5">
                  {bakersPercent(ing.grams || 0)}
                </td>

                {/* Ellipsis Menu */}
                <td className="py-1.5 pl-2 text-right align-top pt-2">
                  <EllipsisMenu
                    ing={ing}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-stone-200 font-medium text-stone-700 dark:border-stone-700 dark:text-stone-300">
            <td className="py-2 pr-2">Total dough</td>
            <td className="py-2 px-2 text-right tabular-nums">
              {formatGrams(totalDough)}
            </td>
            <td className="py-2 px-2 text-right tabular-nums">
              {formatGrams(totalDough * multiplier)}
            </td>
            <td className="py-2 px-2 text-right tabular-nums">
              {totalFlour > 0
                ? `${formatGrams((totalDough / totalFlour) * 100)}%`
                : "—"}
            </td>
            <td />
          </tr>
          <tr className="text-stone-500 dark:text-stone-400">
            <td className="py-1 pr-2">Total flour</td>
            <td className="py-1 px-2 text-right tabular-nums">
              {formatGrams(totalFlour)}
            </td>
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
