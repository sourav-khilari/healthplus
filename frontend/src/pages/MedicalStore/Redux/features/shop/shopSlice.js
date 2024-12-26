import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  products: [],
  checked: [], // Selected categories
  radio: [], // Selected price range
  brandCheckboxes: {}, // Checkbox states for brands
  checkedBrands: [], // Selected brands
  priceFilter: [0, 1000], // Price filter range (min, max)
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    // Set the categories fetched from the backend
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    // Set the products after filtering or fetching from backend
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    // Update selected categories (checked)
    setChecked: (state, action) => {
      state.checked = action.payload;
    },

    // Update selected price range
    setRadio: (state, action) => {
      state.radio = action.payload;
    },

    // Set the currently selected brand
    setSelectedBrand: (state, action) => {
      state.checkedBrands = action.payload;
    },

    // Update price filter range
    setPriceFilter: (state, action) => {
      state.priceFilter = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setSelectedBrand,
  setPriceFilter, // Exporting setPriceFilter for Shop.jsx
} = shopSlice.actions;

export default shopSlice.reducer;
