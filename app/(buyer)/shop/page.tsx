'use client';
import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import { products } from "@/data/products";
import SearchBar from "@/components/shop/SearchBar";
import ProductFilters, { FilterState } from "@/components/shop/ProductFilters";
import SortDropdown from "@/components/shop/SortDropDown";
import ViewToggle from "@/components/shop/ViewToggle";
import ProductGrid from "@/components/shop/ProductGrid";

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  slug: string;
}

const categories = ["All", "Men", "Women", "New", "Sale"];

const filterOptions = {
  brand: ["Nike", "Adidas", "Loro Piana", "Puma", "Zara", "H&M"],
  priceRange: [
    { label: "Under ₹1,000", value: "0-1000" },
    { label: "₹1,000 - ₹3,000", value: "1000-3000" },
    { label: "₹3,000 - ₹5,000", value: "3000-5000" },
    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
    { label: "Above ₹10,000", value: "10000-999999" },
  ],
  gender: ["Men", "Women", "Unisex"],
  sortBy: [
    { label: "Popularity", value: "popularity" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest First", value: "newest" },
    { label: "Best Rated", value: "rating" },
  ],
};

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    brand: [],
    priceRange: "",
    gender: [],
    sortBy: "popularity",
    searchQuery: "",
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // const savedWishlist = localStorage.getItem('ecommerce-wishlist');
    // if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    // localStorage.setItem('ecommerce-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      brand: [],
      priceRange: "",
      gender: [],
      sortBy: "popularity",
      searchQuery: "",
    });
  };

  const toggleWishlist = (product: any) => {
    const isInWishlist = wishlist.some(item => item.slug === product.slug);
    if (isInWishlist) {
      setWishlist(prev => prev.filter(item => item.slug !== product.slug));
    } else {
      const wishlistItem: WishlistItem = {
        id: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.discountedPrice,
        image: product.mainImage,
        slug: product.slug,
      };
      setWishlist(prev => [...prev, wishlistItem]);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }
    if (filters.category !== "All") {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    if (filters.brand.length > 0) {
      filtered = filtered.filter(product =>
        filters.brand.includes(product.brand)
      );
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product =>
        product.discountedPrice >= min && product.discountedPrice <= max
      );
    }
    if (filters.gender.length > 0) {
      filtered = filtered.filter(product =>
        filters.gender.includes(product.gender || 'Unisex')
      );
    }
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return filtered;
  }, [products, filters]);

  const activeFiltersCount = [
    ...filters.brand,
    ...filters.gender,
    filters.priceRange,
    filters.searchQuery,
  ].filter(Boolean).length + (filters.category !== "All" ? 1 : 0);

  const wishlistSlugs = wishlist.map(item => item.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            value={filters.searchQuery}
            onChange={(value) => setFilters(prev => ({ ...prev, searchQuery: value }))}
            className="max-w-2xl mx-auto mb-3"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-gray-700 lg:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <div className="bg-white px-4 py-3 rounded-xl border border-gray-200">
              <span className="text-gray-600 font-medium">
                {filteredAndSortedProducts.length} products found
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <SortDropdown
              options={filterOptions.sortBy}
              value={filters.sortBy}
              onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
            />
            <ViewToggle
              viewMode={viewMode}
              onViewChange={setViewMode}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`w-full lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <ProductGrid
              products={filteredAndSortedProducts}
              viewMode={viewMode}
              wishlist={wishlistSlugs}
              onToggleWishlist={toggleWishlist}
              showDescription={viewMode === 'list'}
            />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-96 max-w-[90vw] bg-gray-50 overflow-y-auto">
            <ProductFilters
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
              isMobile={true}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
