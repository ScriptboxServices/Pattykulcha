import { coffeeOptions, drinkOptions, lassiOptions, menuItems, teaOptions } from '@/constants/MenuOptions';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCategory: 'Kulcha',
  items: {
    "Kulcha":menuItems,
    "Lassi": lassiOptions,
    "Coffee": coffeeOptions,
    "Tea": teaOptions,
    "Soft Drinks":drinkOptions,
  },
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
});

export const { setActiveCategory } = menuSlice.actions;

export default menuSlice.reducer;
