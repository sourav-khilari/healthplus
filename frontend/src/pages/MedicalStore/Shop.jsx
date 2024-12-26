import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "./redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "./redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
  setPriceFilter,
} from "./redux/features/shop/shopSlice";

import Loader from "./Components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, priceFilter } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    priceFilter,
  });

  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
  const [selectedBrand, setSelectedBrand] = useState("All Brands");

  // Fetch categories and update state
  useEffect(() => {
    if (categoriesQuery.isSuccess) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery, dispatch]);

  // Filter products based on categories, brand, and price range
  useEffect(() => {
    if (filteredProductsQuery.isSuccess) {
      const filtered = filteredProductsQuery.data.filter((product) => {
        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesBrand =
          selectedBrand === "All Brands" || product.brand === selectedBrand;
        return matchesPrice && matchesBrand;
      });
      dispatch(setProducts(filtered));
    }
  }, [
    checked,
    priceRange,
    selectedBrand,
    filteredProductsQuery.data,
    dispatch,
  ]);

  // Handle category selection
  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Handle brand selection
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const newRange = e.target.value.split(",").map((val) => parseInt(val, 10));
    setPriceRange(newRange);
    dispatch(setPriceFilter(newRange));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedBrand("All Brands");
    dispatch(setChecked([]));
    dispatch(setPriceFilter([0, 1000]));
    if (filteredProductsQuery.isSuccess) {
      dispatch(setProducts(filteredProductsQuery.data));
    }
  };

  const uniqueBrands = [
    "All Brands",
    ...new Set(filteredProductsQuery.data?.map((p) => p.brand).filter(Boolean)),
  ];

  return (
    <div className="container mx-auto">
      <div className="flex md:flex-row">
        {/* Sidebar */}
        <div className="bg-[#151515] p-3 mt-2 mb-2 w-full md:w-1/4">
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Categories
          </h2>
          <div className="p-5">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-pink-600"
                  />
                  <label className="ml-2 text-sm font-medium text-white">
                    {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Brands
          </h2>
          <div className="p-5">
            {uniqueBrands.map((brand) => (
              <div key={brand} className="flex items-center mb-5">
                <input
                  type="radio"
                  id={brand}
                  name="brand"
                  checked={selectedBrand === brand}
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-400"
                />
                <label className="ml-2 text-sm font-medium text-white">
                  {brand}
                </label>
              </div>
            ))}
          </div>

          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
            Filter by Price
          </h2>
          <div className="p-5">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full"
            />
            <div className="text-white text-center">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>

          <div className="p-5 pt-0">
            <button className="w-full border my-4" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-3 w-full md:w-3/4">
          <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
          <div className="flex flex-wrap">
            {filteredProductsQuery.isLoading ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <div className="p-3" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;