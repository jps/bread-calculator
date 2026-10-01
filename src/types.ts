export interface Ingredient {
  name: string;
  grams: number;
  isFlour?: boolean;
  isWater?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
}

export interface RecipesFile {
  recipes: Recipe[];
}
