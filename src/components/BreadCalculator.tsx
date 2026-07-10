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

  const updateIngredient = (index: number, patch: Partial<Ingredient>) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, ...patch } : ing)),
    );
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", grams: 0, isFlour: false }]);
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <RecipeSelect
            recipes={recipes}
            selectedId={selectedId}
            onChange={handleSelectRecipe}
          />
          <MultiplierControl multiplier={multiplier} onChange={setMultiplier} />
        </div>
        {selectedRecipe?.description && (
          <p className="mt-4 text-sm text-stone-500">{selectedRecipe.description}</p>
        )}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-stone-800">Ingredients</h2>
        <IngredientTable
          ingredients={ingredients}
          multiplier={multiplier}
          onUpdate={updateIngredient}
          onRemove={removeIngredient}
          onAdd={addIngredient}
        />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-stone-800">Export recipe</h2>
        <p className="mb-4 text-sm text-stone-500">
          Save your current ingredients (at base weights) as a new recipe.
        </p>
        <ExportPanel
          name={name}
          description={description}
          ingredients={ingredients}
          onNameChange={setName}
          onDescriptionChange={setDescription}
        />
      </section>
    </div>
  );
}
