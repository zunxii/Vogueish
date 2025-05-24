'use client';
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";

// Categories
const categories = ["Men", "Women", "New", "Sale"];

// Filters with dummy options
const filterOptions: Record<string, string[]> = {
  "Short by: popularity": ["Popularity", "New Arrivals", "Best Rated"],
  "Brand": ["Nike", "Adidas", "Loro Piana", "Puma"],
  "Price": ["Low to High", "High to Low"],
  "Gender": ["Men", "Women", "Unisex"],
};

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("Women");
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const toggleDropdown = (filter: string) => {
    setDropdownOpen(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleFilterSelect = (filter: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: option,
    }));
    setDropdownOpen(prev => ({
      ...prev,
      [filter]: false,
    }));
  };

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      {/* Category Navigation */}
      <div className="flex justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition-all ${
              activeCategory === cat ? "bg-blue-600 text-white" : "bg-white text-black"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64 space-y-4">
          {Object.entries(filterOptions).map(([filter, options]) => (
            <div key={filter} className="relative">
              <button
                onClick={() => toggleDropdown(filter)}
                className="w-full px-4 py-2 text-left bg-white border rounded-lg shadow-sm hover:shadow-md"
              >
                {selectedFilters[filter] || filter}
                <span className="float-right">▾</span>
              </button>
              {dropdownOpen[filter] && (
                <div className="absolute z-10 mt-2 w-full bg-white border rounded shadow-lg">
                  {options.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleFilterSelect(filter, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/shop/${product.slug}`}
              className="rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow relative"
            >
              <div className="relative w-full h-72">
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.description}</p>
                <p className="mt-1 text-sm font-bold">{product.realPrice}</p>
              </div>
              <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
                <button className="text-lg">♡</button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
