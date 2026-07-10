import { useState } from "react";
import type { Ingredient, Recipe } from "../types";

interface Props {
  name: string;
  description: string;
  ingredients: Ingredient[];
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "new-recipe"
  );
}

function buildRecipeJson(name: string, description: string, ingredients: Ingredient[]) {
  const recipe: Recipe = {
    id: slugify(name),
    name: name.trim() || "New Recipe",
    ...(description.trim() ? { description: description.trim() } : {}),
    ingredients: ingredients.map((i) => ({
      name: i.name,
      grams: i.grams,
      ...(i.isFlour ? { isFlour: true } : {}),
    })),
  };
  return JSON.stringify(recipe, null, 2);
}

export default function ExportPanel({
  name,
  description,
  ingredients,
  onNameChange,
  onDescriptionChange,
}: Props) {
  const [copied, setCopied] = useState(false);
  const json = buildRecipeJson(name, description, ingredients);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="export-name" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Recipe name
          </label>
          <input
            id="export-name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="My Sourdough"
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="export-desc" className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Description <span className="text-stone-400 dark:text-stone-500">(optional)</span>
          </label>
          <input
            id="export-desc"
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="~2 loaves"
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          />
        </div>
      </div>

      <pre className="max-h-64 overflow-auto rounded-lg bg-stone-900 p-4 text-xs leading-relaxed text-stone-100 dark:bg-stone-950 dark:ring-1 dark:ring-stone-800">
        <code>{json}</code>
      </pre>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          Copy JSON
        </button>
        {copied && <span className="text-sm font-medium text-green-600 dark:text-green-400">Copied!</span>}
        <span className="text-sm text-stone-400 dark:text-stone-500">
          Paste this into <code className="text-stone-500 dark:text-stone-400">src/data/recipes.json</code> inside
          the <code className="text-stone-500 dark:text-stone-400">"recipes"</code> array.
        </span>
      </div>
    </div>
  );
}
