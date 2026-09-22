import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  items: [], // { id, name, basePortions, ingredients: [{id, name, qty, unit, category}] }
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ name, basePortions, ingredients }) {
        return {
          payload: {
            id: uuid(),
            name,
            basePortions: Number(basePortions) || 1,
            ingredients: ingredients.map((ing) => ({
              id: uuid(),
              name: ing.name,
              qty: Number(ing.qty) || 0,
              unit: ing.unit || '',
              category: ing.category || 'Autre',
            })),
          },
        };
      },
    },
    removeRecipe(state, action) {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
    updateRecipe(state, action) {
      const idx = state.items.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
  },
});

export const { addRecipe, removeRecipe, updateRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;

// Catégories dispo pour les ingrédients — à ajuster librement
export const INGREDIENT_CATEGORIES = [
  'Fruits & légumes',
  'Viande & poisson',
  'Crémerie',
  'Épicerie',
  'Surgelés',
  'Boulangerie',
  'Autre',
];
