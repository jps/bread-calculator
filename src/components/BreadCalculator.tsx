import { useMemo, useState } from "react";
import type { Ingredient } from "../types";
import recipesFile from "../data/recipes.json";
import RecipeSelect from "./RecipeSelect";
import MultiplierControl from "./MultiplierControl";
import IngredientTable from "./IngredientTable";
import ExportPanel from "./ExportPanel";

const recipes = recipesFile.recipes;

function cloneIngredients(ingredients: Ingredient[]): Ingredient[] {
  return ingredients.map((i) => ({ ...i }));
}

export default function BreadCalculator() {
  const [selectedId, setSelectedId] = useState(recipes[0]?.id ?? "");

  const selectedRecipe = useMemo(
    () => recipes.find((r) => r.id === selectedId),
    [selectedId],
  );

  const [multiplier, setMultiplier] = useState(1);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    cloneIngredients(selectedRecipe?.ingredients ?? []),
  );
  const [name, setName] = useState(selectedRecipe?.name ?? "");
  const [description, setDescription] = useState(selectedRecipe?.description ?? "");

  const handleSelectRecipe = (id: string) => {
    const recipe = recipes.find((r) => r.id === id);
    setSelectedId(id);
    setIngredients(cloneIngredients(recipe?.ingredients ?? []));
    setName(recipe?.name ?? "");
    setDescription(recipe?.description ?? "");
  };

  const updateIngredientByRef = (targetIng: Ingredient, patch: Partial<Ingredient>) => {
    setIngredients((prev) => {
      let found = false;
      const updated = prev.map((ing) => {
        if (ing === targetIng || (ing.isWater && targetIng.isWater)) {
          found = true;
          return { ...ing, ...patch };
        }
        return ing;
      });
      if (!found && targetIng.isWater) {
        return [{ ...targetIng, ...patch }, ...prev];
      }
      return updated;
    });
  };

  const removeIngredientByRef = (targetIng: Ingredient) => {
    if (targetIng.isWater) return; // Never remove water
    setIngredients((prev) => prev.filter((ing) => ing !== targetIng));
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", grams: 0, isFlour: false }]);
  };

  // Ensure water ingredient exists and is placed first in the list
  const sortedIngredients = useMemo(() => {
    const waterIndex = ingredients.findIndex((i) => i.isWater);
    if (waterIndex === -1) {
      // If no water ingredient exists, prepend a default water ingredient
      return [{ name: "Water", grams: 0, isWater: true }, ...ingredients];
    }
    if (waterIndex === 0) {
      return ingredients;
    }
    // Move water ingredient to the front
    const water = ingredients[waterIndex];
    const rest = ingredients.filter((_, i) => i !== waterIndex);
    return [water, ...rest];
  }, [ingredients]);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="grid gap-6 sm:grid-cols-2">
          <RecipeSelect
            recipes={recipes}
            selectedId={selectedId}
            onChange={handleSelectRecipe}
          />
          <MultiplierControl multiplier={multiplier} onChange={setMultiplier} />
        </div>
        {selectedRecipe?.description && (
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">{selectedRecipe.description}</p>
        )}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h2 className="mb-4 text-lg font-semibold text-stone-800 dark:text-stone-200">Ingredients</h2>
        <IngredientTable
          ingredients={sortedIngredients}
          multiplier={multiplier}
          onUpdate={updateIngredientByRef}
          onRemove={removeIngredientByRef}
          onAdd={addIngredient}
        />
      </section>

      <details className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200">Export recipe</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-5 w-5 text-stone-400 transition-transform duration-200 group-open:rotate-180 dark:text-stone-500"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </summary>
        <p className="mt-1 mb-4 text-sm text-stone-500 dark:text-stone-400">
          Save your current ingredients (at base weights) as a new recipe.
        </p>
        <ExportPanel
          name={name}
          description={description}
          ingredients={sortedIngredients}
          onNameChange={setName}
          onDescriptionChange={setDescription}
        />
      </details>
    </div>
  );
}
