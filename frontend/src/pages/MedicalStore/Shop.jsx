import { useEffect, useState } from "react";
import axios from "axios"; // Import your axios instance
import Loader from "./Components/Loader";
import ProductCard from "./Products/ProductCard";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
  withCredentials: true, // For handling cookies
});

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [checked, setChecked] = useState([]);
  const [priceFilter, setPriceFilter] = useState([0, 1000]);
  const [selectedBrand, setSelectedBrand] = useState("All Brands");

  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch filtered products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products", {
          params: { checked, priceFilter },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [checked, priceFilter]);

  // Filter products based on selected brand, price range, and categories
  useEffect(() => {
    const filterProducts = () => {
      const filtered = products.filter((product) => {
        const matchesPrice =
          product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesBrand =
          selectedBrand === "All Brands" || product.brand === selectedBrand;
        const matchesCategory =
          checked.length === 0 || checked.includes(product.categoryId);

        return matchesPrice && matchesBrand && matchesCategory;
      });

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [products, checked, priceRange, selectedBrand]);

  // Handle category selection
  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    setChecked(updatedChecked);
  };

  // Handle brand selection
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    const newRange = e.target.value.split(",").map((val) => parseInt(val, 10));
    setPriceRange(newRange);
    setPriceFilter(newRange);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedBrand("All Brands");
    setChecked([]);
    setPriceFilter([0, 1000]);
  };

  // Get unique brands
  const uniqueBrands = [
    "All Brands",
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
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
            {categories.map((c) => (
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
          <h2 className="h4 text-center mb-2">
            {filteredProducts.length} Products
          </h2>
          <div className="flex flex-wrap">
            {filteredProducts.length === 0 ? (
              <Loader />
            ) : (
              filteredProducts.map((p) => (
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
