import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { ProductCard } from '../components/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  Search,
  Grid,
  List,
  Check,
  X,
  Star,
  ChevronDown,
  RotateCcw,
  Globe
} from 'lucide-react';

interface ProductsPageProps {
  initialCategory?: string;
  initialSubcategory?: string;
  initialSearch?: string;
  onNavigate: (route: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  initialCategory,
  initialSubcategory,
  initialSearch,
  onNavigate
}) => {
  const { products, categories, sellers, formatPrice, currentCurrency } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [selectedSeller, setSelectedSeller] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Sync props when user clicks categories or search from other pages
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    } else {
      setSelectedCategory('all');
    }
  }, [initialCategory]);

  React.useEffect(() => {
    if (initialSubcategory) {
      setSelectedSubcategory(initialSubcategory);
    } else {
      setSelectedSubcategory('all');
    }
  }, [initialSubcategory]);

  React.useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const activeCategoryObj = categories.find(
    (c) =>
      c.id === selectedCategory ||
      c.slug?.toLowerCase() === selectedCategory.toLowerCase() ||
      c.name.toLowerCase() === selectedCategory.toLowerCase()
  );

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catTarget = selectedCategory.toLowerCase();
        const matchesCategory =
          product.category_id?.toLowerCase() === catTarget ||
          product.category_name?.toLowerCase() === catTarget ||
          categories.some(
            (c) =>
              (c.id.toLowerCase() === catTarget || c.name.toLowerCase() === catTarget || c.slug?.toLowerCase() === catTarget) &&
              (c.id === product.category_id || c.name.toLowerCase() === product.category_name?.toLowerCase())
          );
        if (!matchesCategory) return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all') {
        const subTarget = selectedSubcategory.toLowerCase();
        const matchesSub =
          product.subcategory?.toLowerCase() === subTarget ||
          product.name.toLowerCase().includes(subTarget) ||
          product.description.toLowerCase().includes(subTarget) ||
          product.brand.toLowerCase().includes(subTarget);
        if (!matchesSub) return false;
      }

      // Seller filter
      if (selectedSeller !== 'all' && product.seller_id !== selectedSeller) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.category_name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // In stock
      if (inStockOnly && product.quantity <= 0) {
        return false;
      }
      // Price range (in USD base)
      const effectivePrice = product.discount_price || product.price;
      if (effectivePrice < priceRange[0] || effectivePrice > priceRange[1]) {
        return false;
      }
      // Rating
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.discount_price || a.price;
      const priceB = b.discount_price || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = a.discount_price ? a.price - a.discount_price : 0;
        const discB = b.discount_price ? b.price - b.discount_price : 0;
        return discB - discA;
      }
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });
  }, [products, selectedCategory, selectedSubcategory, selectedSeller, searchQuery, priceRange, inStockOnly, minRating, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSelectedSeller('all');
    setPriceRange([0, 5000]);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    searchQuery !== '' ||
    selectedSeller !== 'all' ||
    priceRange[1] < 5000 ||
    inStockOnly ||
    minRating > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground flex items-center gap-2">
            <Globe className="w-7 h-7 text-brand" />
            <span>Global Marketplace Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Browse verified products and equipment from international vendors ({filteredProducts.length} items available)
          </p>
        </div>

        {/* Global Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog, brands, models..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-secondary border border-border focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden p-2.5 rounded-xl bg-secondary border border-border text-foreground flex items-center gap-2 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <aside
          className={`space-y-6 md:block ${
            showMobileFilters ? 'block fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-6 overflow-y-auto' : 'hidden'
          }`}
        >
          {showMobileFilters && (
            <div className="flex items-center justify-between pb-4 border-b border-border md:hidden">
              <h3 className="font-bold text-sm">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-lg bg-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full py-2 px-3 rounded-xl bg-secondary hover:bg-rose-500/10 hover:text-rose-500 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}

          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Categories ({categories.length})</span>
            </h3>
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'brand-gradient text-white font-bold shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] font-mono opacity-80">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter(
                  (p) =>
                    p.category_id === cat.id ||
                    p.category_name.toLowerCase() === cat.name.toLowerCase() ||
                    p.category_id?.toLowerCase() === cat.slug?.toLowerCase()
                ).length;
                const isSelected =
                  selectedCategory === cat.id ||
                  selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                  selectedCategory.toLowerCase() === cat.slug?.toLowerCase();

                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubcategory('all');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-brand/10 text-brand font-bold border border-brand/20'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0 text-brand" />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">{count}</span>
                    </button>

                    {/* Expand subcategories if selected */}
                    {isSelected && cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="pl-3 py-1 space-y-0.5 border-l-2 border-brand/40 ml-3">
                        <button
                          onClick={() => setSelectedSubcategory('all')}
                          className={`w-full text-left px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                            selectedSubcategory === 'all'
                              ? 'bg-brand text-white font-bold'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                          }`}
                        >
                          All {cat.name}
                        </button>
                        {cat.subcategories.map((sub, i) => {
                          const isSubSelected = selectedSubcategory === sub;
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedSubcategory(sub)}
                              className={`w-full text-left px-2 py-1 rounded-lg text-[11px] truncate transition-colors cursor-pointer ${
                                isSubSelected
                                  ? 'bg-brand text-white font-bold'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                              }`}
                            >
                              • {sub}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-bold text-foreground uppercase tracking-wider">Price Range</h3>
              <span className="text-brand font-bold font-mono">
                {formatPrice(priceRange[1])}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5000}
              step={50}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-brand"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>{formatPrice(0)}</span>
              <span>{formatPrice(5000)}+</span>
            </div>
          </div>

          {/* International Sellers Filter */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Verified Vendors
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedSeller('all')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                  selectedSeller === 'all' ? 'bg-brand/10 text-brand font-bold' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <span>All Merchants</span>
              </button>
              {sellers.map((seller) => (
                <button
                  key={seller.id}
                  onClick={() => setSelectedSeller(seller.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${
                    selectedSeller === seller.id
                      ? 'bg-brand/10 text-brand font-bold'
                      : 'text-muted-foreground hover:bg-secondary truncate'
                  }`}
                >
                  <span className="truncate">{seller.store_name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Rating</h3>
            <div className="space-y-1">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(minRating === r ? 0 : r)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 ${
                    minRating === r ? 'bg-brand/10 text-brand font-bold' : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span>{r} Stars & Above</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Filter */}
          <div className="pt-4 border-t border-border">
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-brand accent-brand"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Right Main Grid */}
        <div className="md:col-span-3 lg:col-span-4 space-y-6">
          {/* Top Sort & View Bar */}
          <div className="p-3 rounded-2xl bg-card border border-border flex items-center justify-between gap-4 text-xs">
            <div className="text-muted-foreground font-medium">
              Showing <span className="font-bold text-foreground">{filteredProducts.length}</span> results
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-secondary text-foreground text-xs font-semibold px-3 py-1.5 rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center border border-border rounded-xl p-0.5 bg-secondary">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-card text-brand shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-card text-brand shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Subcategories Filter Chips */}
          {activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-muted-foreground uppercase mr-1 shrink-0">Subcategory:</span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedSubcategory === 'all'
                    ? 'brand-gradient text-white shadow-sm'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                All {activeCategoryObj.name}
              </button>
              {activeCategoryObj.subcategories.map((sub, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    selectedSubcategory === sub
                      ? 'brand-gradient text-white shadow-sm'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Products Render */}
          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-card border border-border space-y-4">
              <p className="text-sm font-semibold text-foreground">No matching products found</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try loosening your filter criteria or search for broader product keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onNavigate(`/product/${product.id}`)}
                  className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4 card-hover-lift cursor-pointer"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-24 h-24 rounded-xl object-cover bg-secondary shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-brand">{product.category_name}</span>
                      <h3 className="font-bold text-sm text-foreground font-display line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <div>
                      <div className="text-base font-extrabold text-foreground font-display">
                        {formatPrice(product.discount_price || product.price)}
                      </div>
                      {product.discount_price && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-brand font-bold mt-2">View Item →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
