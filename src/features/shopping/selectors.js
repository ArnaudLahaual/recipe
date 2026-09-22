import { createSelector } from '@reduxjs/toolkit';

const selectRecipes = (state) => state.recipes.items;

/**
 * Génère la liste de courses pour UNE recette, mise à l'échelle sur les
 * portions voulues, groupée par catégorie (comme sur les captures).
 */
export const makeSelectShoppingListForRecipe = () =>
  createSelector(
    [selectRecipes, (_, recipeId) => recipeId, (_, __, wantedPortions) => wantedPortions],
    (recipes, recipeId, wantedPortions) => {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return { recipeName: '', groups: [] };

      const ratio = wantedPortions / (recipe.basePortions || 1);
      const byCategory = {};

      recipe.ingredients.forEach((ing) => {
        const scaledQty = Math.round(ing.qty * ratio * 100) / 100;
        if (!byCategory[ing.category]) byCategory[ing.category] = [];
        byCategory[ing.category].push({ ...ing, scaledQty });
      });

      return {
        recipeName: recipe.name,
        wantedPortions,
        groups: Object.entries(byCategory).map(([category, ingredients]) => ({
          category,
          ingredients,
        })),
      };
    }
  );

/**
 * Variante "Par planning" : agrège les ingrédients de toutes les recettes
 * planifiées sur le mois (utile pour le type de liste "Planning entier").
 */
export const selectShoppingListForPlan = (state) => {
  const { recipes } = state.recipes.items.reduce(
    (acc, r) => ({ ...acc, [r.id]: r }),
    {}
  );
  const recipesById = Object.fromEntries(state.recipes.items.map((r) => [r.id, r]));
  const totals = {}; // key: `${recipeId}__${ingredientName}` -> { name, unit, category, qty }

  state.plan.weeks.forEach((week) => {
    week.days.forEach((day) => {
      const recipe = recipesById[day.recipeId];
      if (!recipe) return;
      const ratio = day.portions / (recipe.basePortions || 1);
      recipe.ingredients.forEach((ing) => {
        const key = `${ing.name.toLowerCase()}__${ing.unit}`;
        if (!totals[key]) {
          totals[key] = { name: ing.name, unit: ing.unit, category: ing.category, qty: 0 };
        }
        totals[key].qty += ing.qty * ratio;
      });
    });
  });

  const byCategory = {};
  Object.values(totals).forEach((item) => {
    item.qty = Math.round(item.qty * 100) / 100;
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });

  return Object.entries(byCategory).map(([category, ingredients]) => ({ category, ingredients }));
};
