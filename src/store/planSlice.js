import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  monthLabel: '', // ex. "Octobre 2026"
  weeks: [], // { id, label, days: [{id, dayLabel, recipeId, portions}] }
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setMonthLabel(state, action) {
      state.monthLabel = action.payload;
    },
    addWeek(state, action) {
      state.weeks.push({
        id: uuid(),
        label: action.payload?.label || `Semaine ${state.weeks.length + 1}`,
        days: [],
      });
    },
    removeWeek(state, action) {
      state.weeks = state.weeks.filter((w) => w.id !== action.payload);
    },
    addDayEntry(state, action) {
      const { weekId, dayLabel, recipeId, portions } = action.payload;
      const week = state.weeks.find((w) => w.id === weekId);
      if (week) {
        week.days.push({ id: uuid(), dayLabel, recipeId, portions: Number(portions) || 1 });
      }
    },
    removeDayEntry(state, action) {
      const { weekId, dayId } = action.payload;
      const week = state.weeks.find((w) => w.id === weekId);
      if (week) week.days = week.days.filter((d) => d.id !== dayId);
    },
  },
});

export const { setMonthLabel, addWeek, removeWeek, addDayEntry, removeDayEntry } = planSlice.actions;
export default planSlice.reducer;
