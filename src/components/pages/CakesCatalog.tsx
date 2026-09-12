import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { getCakes, getCategories } from '../../lib/services/db';
import { Cake, Category } from '../../types';
import { Search, Filter, SlidersHorizontal, Heart, Star, ShoppingCart, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CakesCatalog() {
  const { navigateTo, toggleFavorite, isFavorite, addToCart, settings } = useAppContext();
  
  // SWR: Initialize state with local storage cache for instant 0ms rendering
  const [cakes, setCakes] = useState<Cake[]>(() => {
    const cached = localStorage.getItem('sbt_cached_all_cakes');
    return cached ? JSON.parse(cached) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const cached = localStorage.getItem('sbt_cached_all_categories');
    return cached ? JSON.parse(cached) : [];
  });
  
  // If we have cached items, we can bypass the initial loading screen!
  const [loading, setLoading] = useState(() => {
    const cachedCakes = localStorage.getItem('sbt_cached_all_cakes');
    return !cachedCakes; // Only show loader if we have absolutely nothing cached
  });

  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('popular'); // popular, priceAsc, priceDesc, newest
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCakeIdForQuickView, setSelectedCakeIdForQuickView] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [allCakes, allCats] = await Promise.all([
          getCakes(),
          getCategories()
        ]);
        
        const filteredCats = allCats.filter(c => c.active);

        setCakes(allCakes);
        setCategories(filteredCats);

        // Update caches for next visit
        localStorage.setItem('sbt_cached_all_cakes', JSON.stringify(allCakes));
        localStorage.setItem('sbt_cached_all_categories', JSON.stringify(filteredCats));
        
        // Find maximum cake price to initialize filter slider
        if (allCakes.length > 0) {
          const highestPrice = Math.max(...allCakes.map(c => c.price));
          setMaxPrice(highestPrice + 5);
        }
      } catch (e) {
        console.error('Error loading catalog:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Filter & Sort Logic
  const filteredCakes = cakes.filter((cake) => {
    const matchesSearch = 
      cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cake.flavor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cake.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || cake.categoryId === selectedCategory;
    const matchesPrice = cake.price <= maxPrice;
    const matchesRating = cake.rating >= minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
    // default 'popular': sort by rating desc
    return b.rating - a.rating;
  });

  const handleQuickAdd = (cake: Cake, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    if (!cake.available) return;
    
    // Add default options
    addToCart({
      cakeId: cake.id,
      cakeName: cake.name,
      cakeImage: cake.images[0]?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
      weight: cake.weights[0] || '1.0kg',
      flavor: cake.flavor || 'Vanilla',
      price: cake.price,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="text-4xl animate-bounce">🎂</div>
        <div className="h-6 w-48 shimmer mx-auto rounded-xl" />
        <p className="text-xs text-[#4B4453]/60">Sifting premium flour & whipping sweet creams...</p>
      </div>
    );
  }

  // Selected Cake details for details overlay
  const selectedCake = cakes.find(c => c.id === selectedCakeIdForQuickView);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Our Fresh Catalog</span>
        <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">
          Explore Our Sweet Cakes
        </h1>
        <p className="text-sm text-[#4B4453]/70 dark:text-zinc-400 font-body max-w-lg mx-auto">
          Every cake is baked freshly on order with premium organic ingredients and absolute love. Click on any cake to see full weight and flavor customizer.
        </p>
        <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
      </div>

      {/* Search & Control Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters - Desktop */}
        <aside className="hidden lg:block bg-white dark:bg-[#241F23] rounded-[32px] p-6 border border-pink-50 dark:border-zinc-800 h-fit space-y-6 shadow-sm">
          <div className="flex items-center space-x-2 text-[#4B4453] dark:text-zinc-200 border-b border-pink-50/50 dark:border-zinc-800 pb-3">
            <SlidersHorizontal className="h-4 w-4 text-[#F78FB3]" />
            <span className="font-display text-sm font-bold uppercase tracking-wider">Refine Options</span>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-[#F78FB3] uppercase tracking-wider">Category</h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`block w-full py-2 px-3 text-left rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-[#FFDDEB] text-[#F78FB3]'
                    : 'text-[#4B4453]/80 hover:bg-pink-50/50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                All Sweet Cakes
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`block w-full py-2 px-3 text-left rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#FFDDEB] text-[#F78FB3]'
                      : 'text-[#4B4453]/80 hover:bg-pink-50/50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-display font-bold text-xs text-[#F78FB3] uppercase tracking-wider">Max Price</h4>
              <span className="text-xs font-extrabold text-[#F78FB3]">{settings?.currency || '£'}{maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="150" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#F78FB3] cursor-pointer"
            />
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs text-[#F78FB3] uppercase tracking-wider">Minimum Rating</h4>
            <div className="flex space-x-2">
              {[0, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    minRating === stars
                      ? 'bg-[#F78FB3] text-white shadow-sm'
                      : 'bg-pink-50 text-[#4B4453]/85 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {stars === 0 ? 'All' : `${stars} ★`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Search Grid */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Top Search Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#4B4453]/40" />
              <input
                type="text"
                placeholder="Search by cake, flavor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:text-white"
              />
            </div>

            {/* Sorting & Filter toggle for Mobile */}
            <div className="flex space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-1 rounded-2xl bg-white border border-pink-100 px-4 py-3 text-sm font-semibold text-[#4B4453] cursor-pointer"
              >
                <Filter className="h-4.5 w-4.5 text-[#F78FB3]" />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 px-4 py-3 text-sm font-semibold text-[#4B4453] dark:text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="popular">Best Sellers</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="newest">Newest Arrival</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden bg-white rounded-3xl p-5 border border-pink-100 space-y-4 shadow-sm"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#F78FB3] uppercase tracking-wider mb-2">Category</h4>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full rounded-xl border border-pink-100 p-2 text-xs font-semibold"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F78FB3] uppercase tracking-wider mb-2">Min Rating</h4>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full rounded-xl border border-pink-100 p-2 text-xs font-semibold"
                    >
                      <option value="0">All Ratings</option>
                      <option value="3">3 ★ & Above</option>
                      <option value="4">4 ★ & Above</option>
                      <option value="5">5 ★ Only</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Max Price:</span>
                    <span className="text-[#F78FB3] font-bold">{settings?.currency || '£'}{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#F78FB3]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Catalog Grid */}
          {filteredCakes.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#241F23] rounded-[32px] border border-pink-50 dark:border-zinc-800 space-y-4 shadow-sm">
              <span className="text-5xl">🐻‍❄️</span>
              <h3 className="font-display font-bold text-lg text-[#4B4453] dark:text-zinc-200">No Cakes Match Your Filters</h3>
              <p className="text-xs text-[#4B4453]/60 max-w-sm mx-auto">
                Try adjusting your price filter or looking for another keyword. Tani is always adding new creations!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setMinRating(0);
                  setMaxPrice(100);
                }}
                className="rounded-xl bg-[#FFDDEB] px-4 py-2 text-xs font-bold text-[#F78FB3]"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCakes.map((cake) => {
                const mainImg = cake.images[0]?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300';
                const fav = isFavorite(cake.id);
                return (
                  <div
                    key={cake.id}
                    onClick={() => setSelectedCakeIdForQuickView(cake.id)}
                    className="group bg-white dark:bg-[#241F23] rounded-[28px] overflow-hidden border border-pink-50 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
                  >
                    {/* Visual Overlay Header */}
                    <div className="relative w-full aspect-square overflow-hidden bg-pink-50/25">
                      <img
                        src={mainImg}
                        alt={cake.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Bestseller/Discount flags */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1.5">
                        {cake.bestseller && (
                          <span className="rounded-full bg-[#FFDDEB] text-[#F78FB3] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider pink-glow">
                            Best Seller
                          </span>
                        )}
                        {!cake.available && (
                          <span className="rounded-full bg-zinc-800 text-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            Sold Out
                          </span>
                        )}
                        {cake.oldPrice && (
                          <span className="rounded-full bg-[#F78FB3] text-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Favorite Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(cake.id);
                        }}
                        className="absolute top-4 right-4 z-10 rounded-full bg-white/80 dark:bg-[#241F23]/80 p-2 text-[#F78FB3] hover:scale-110 transition-transform shadow-sm cursor-pointer"
                      >
                        <Heart className={`h-4.5 w-4.5 ${fav ? 'fill-[#F78FB3]' : ''}`} />
                      </button>
                    </div>

                    {/* Description Details Block */}
                    <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#F78FB3]">
                          <span>{cake.flavor}</span>
                          <div className="flex items-center space-x-0.5 text-yellow-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>{cake.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-zinc-100 group-hover:text-[#F78FB3] transition-colors truncate">
                          {cake.name}
                        </h3>

                        <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {cake.description}
                        </p>
                      </div>

                      {/* Buy Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-pink-50/50 dark:border-zinc-800/50 mt-auto">
                        <div>
                          <span className="font-display text-base font-black text-[#F78FB3]">
                            {settings?.currency || '£'}{cake.price.toFixed(2)}
                          </span>
                          {cake.oldPrice && (
                            <span className="text-xs line-through text-[#4B4453]/40 dark:text-zinc-500 ml-1.5">
                              {settings?.currency || '£'}{cake.oldPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(cake, e)}
                          disabled={!cake.available}
                          className={`flex items-center space-x-1 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                            cake.available
                              ? 'bg-[#FFDDEB] hover:bg-[#F78FB3] hover:text-white text-[#F78FB3]'
                              : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>{cake.available ? 'Quick Add' : 'Sold Out'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* QUICK VIEW DETAILS OVERLAY (Satisfies F) */}
      <AnimatePresence>
        {selectedCakeIdForQuickView && selectedCake && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A1618] rounded-[36px] p-6 sm:p-8 border border-pink-100 dark:border-zinc-800 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCakeIdForQuickView(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-pink-50 dark:bg-zinc-800 p-2 text-[#4B4453] hover:text-[#F78FB3] dark:text-white cursor-pointer"
              >
                ✕
              </button>

              {/* Nested CakeDetails component code inside overlay for maximum cohesion */}
              <CakeDetailsView cake={selectedCake} onClose={() => setSelectedCakeIdForQuickView(null)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Sub-component for Overlay Detail Customizer (Weights, flavors, message, quantity, related, add to cart, buy now)
function CakeDetailsView({ cake, onClose }: { cake: Cake; onClose: () => void }) {
  const { addToCart, navigateTo, settings } = useAppContext();
  const [activeImg, setActiveImg] = useState(cake.images[0]?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600');
  const [selectedWeight, setSelectedWeight] = useState(cake.weights[0] || '1.0kg');
  const [selectedFlavor, setSelectedFlavor] = useState(cake.flavor || 'Vanilla Bean');
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (buyNow = false) => {
    addToCart({
      cakeId: cake.id,
      cakeName: cake.name,
      cakeImage: activeImg,
      weight: selectedWeight,
      flavor: selectedFlavor,
      price: cake.price,
      quantity
    });
    onClose();
    if (buyNow) {
      navigateTo('cart');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Image Selector */}
      <div className="space-y-4">
        <div className="relative w-full aspect-square rounded-[24px] overflow-hidden bg-pink-50/10">
          <img src={activeImg} alt={cake.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {cake.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImg(img.url)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                activeImg === img.url ? 'border-[#F78FB3]' : 'border-transparent'
              }`}
            >
              <img src={img.url} alt="Cake thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right Customizer Panel */}
      <div className="space-y-5">
        <div>
          <span className="text-[10px] font-bold text-[#F78FB3] uppercase tracking-wider">Premium Selection</span>
          <h2 className="font-display text-2xl font-extrabold text-[#4B4453] dark:text-white">{cake.name}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(cake.rating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-[#4B4453]/70 dark:text-zinc-300">{cake.rating} rating</span>
          </div>
        </div>

        <p className="text-xs text-[#4B4453]/80 dark:text-zinc-300 leading-relaxed font-body">
          {cake.description}
        </p>

        {/* Weights Select */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Available Weights</label>
          <div className="flex space-x-2">
            {cake.weights.map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWeight(w)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedWeight === w
                    ? 'bg-[#F78FB3] text-white shadow-sm'
                    : 'bg-pink-50 text-[#4B4453] dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Flavors input or preset */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Cake Flavor Fillings</label>
          <select
            value={selectedFlavor}
            onChange={(e) => setSelectedFlavor(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs font-semibold focus:outline-none dark:bg-zinc-800 dark:text-white"
          >
            <option value={cake.flavor}>{cake.flavor} (Baker's Signature Choice)</option>
            <option value="Vanilla Bean Chantilly">Classic Vanilla Bean & Strawberries 🍓</option>
            <option value="Double Belgian Fudge">Double Belgian Chocolate Fudge 🍫</option>
            <option value="Salted Caramel Praline">Creamy Salted Caramel Praline 🍯</option>
            <option value="Red Velvet Cheese">Rich Red Velvet & Vanilla Cream Cheese 🎂</option>
          </select>
        </div>

        {/* Custom Piped Written Message */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">
            Custom Message (Piped on cake!) ✍️
          </label>
          <input
            type="text"
            maxLength={35}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="e.g. Happy 21st Sophie! 🩷 (Max 35 chars)"
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {/* Quantity Toggle */}
        <div className="flex items-center space-x-4 pt-2">
          <label className="text-xs font-bold text-[#F78FB3] uppercase">Quantity</label>
          <div className="flex items-center border border-pink-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-pink-50/20">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1.5 hover:bg-[#FFDDEB] text-sm text-[#F78FB3] cursor-pointer"
            >
              -
            </button>
            <span className="px-4 py-1 text-sm font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1.5 hover:bg-[#FFDDEB] text-sm text-[#F78FB3] cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Cart/Checkout actions */}
        <div className="flex space-x-3 pt-3 border-t border-pink-50 dark:border-zinc-800">
          <div className="text-left shrink-0 min-w-[80px]">
            <p className="text-[10px] text-[#4B4453]/60 uppercase font-bold">Total price</p>
            <p className="font-display text-xl font-black text-[#F78FB3]">
              {settings?.currency || '£'}{(cake.price * quantity).toFixed(2)}
            </p>
          </div>
          
          <button
            onClick={() => handleAddToCart(false)}
            className="flex-1 rounded-2xl bg-[#FFDDEB] text-[#F78FB3] font-bold text-xs py-3 hover:bg-[#F78FB3] hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-1"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
          <button
            onClick={() => handleAddToCart(true)}
            className="flex-1 rounded-2xl bg-[#F78FB3] text-white font-bold text-xs py-3 hover:bg-[#F78FB3]/90 transition-all cursor-pointer"
          >
            Buy Now ✨
          </button>
        </div>
      </div>
    </div>
  );
}
