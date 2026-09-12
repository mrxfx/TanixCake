import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { getCakes, getCategories, getReviews } from '../../lib/services/db';
import { Cake, Category, Review } from '../../types';
import { Sparkles, Heart, ArrowRight, Star, Quote, ChevronLeft, ChevronRight, Cake as CakeIcon, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export default function Homepage() {
  const { navigateTo, toggleFavorite, isFavorite, settings } = useAppContext();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [allCakes, allCats, allReviews] = await Promise.all([
          getCakes(),
          getCategories(),
          getReviews()
        ]);
        setCakes(allCakes.filter(c => c.available));
        setCategories(allCats.filter(cat => cat.active));
        setReviews(allReviews.filter(r => r.approved && r.featured));
      } catch (e) {
        console.error('Error loading homepage data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const featuredCakes = cakes.filter(c => c.featured).slice(0, 3);
  const bestSellers = cakes.filter(c => c.bestseller).slice(0, 3);

  const nextReview = () => {
    setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
  };
  const prevReview = () => {
    setActiveReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <div className="relative text-5xl teddy-float">🐻‍❄️</div>
        <div className="h-6 w-32 shimmer rounded-xl" />
        <p className="text-xs text-[#4B4453]/60">Baking something magical...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#FFDDEB]/40 via-[#FFF8FB] to-[#FFB6C1]/20 py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        {/* Floating Sparkles & Hearts */}
        <div className="absolute top-10 left-10 text-pink-300 animate-bounce delay-100 text-xl">✨</div>
        <div className="absolute bottom-10 left-20 text-pink-300 animate-pulse text-xl">💖</div>
        <div className="absolute top-20 right-10 text-pink-400 teddy-float text-2xl">🎀</div>
        <div className="absolute bottom-12 right-20 text-pink-300 animate-bounce text-xl">✨</div>
        
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Text */}
          <div className="space-y-6 text-center lg:text-left z-10">
            <span className="inline-flex items-center space-x-2 rounded-full bg-[#FFDDEB] px-4 py-1.5 text-xs font-bold text-[#F78FB3] pink-glow">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sweet by Tani Bakery</span>
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#4B4453] dark:text-zinc-100 leading-tight">
              Freshly Baked <br />
              <span className="text-[#F78FB3] relative inline-block">
                with Love 🩷
                <svg className="absolute left-0 -bottom-2 w-full h-2 text-[#FFDDEB]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#4B4453]/80 dark:text-zinc-300 max-w-lg mx-auto lg:mx-0 font-body">
              {settings?.tagline || 'Beautiful cakes made specially for your sweetest moments.'} Experience the authentic elegance of Korean/Pinterest aesthetic bento bakes, luxury custom details, and premium British-sourced ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigateTo('cakes')} 
                className="flex items-center justify-center space-x-2 rounded-2xl bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                <span>Order a Cake</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => navigateTo('gallery')} 
                className="flex items-center justify-center space-x-2 rounded-2xl bg-white hover:bg-[#FFDDEB]/20 text-[#4B4453] dark:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-pink-100 dark:border-zinc-700 px-8 py-4 font-semibold transition-all duration-200 cursor-pointer"
              >
                <span>Explore Cake Gallery</span>
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative flex justify-center items-center">
            {/* Visual Back Drop */}
            <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-gradient-to-r from-[#FFB6C1]/30 to-[#FFDDEB]/30 rounded-full blur-3xl" />
            
            <div className="relative z-10 w-full max-w-[420px] aspect-square rounded-[32px] bg-white dark:bg-[#241F23] p-4 shadow-xl border-4 border-white dark:border-[#241F23]">
              <img 
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80" 
                alt="Sweet Teddy Birthday Cake" 
                className="w-full h-full object-cover rounded-[24px]"
              />
              {/* Cute Float Teddy Tag */}
              <div className="absolute -top-6 -left-6 teddy-float bg-white dark:bg-[#352328] border border-pink-100 dark:border-zinc-800 p-3 rounded-2xl shadow-lg flex items-center space-x-2">
                <span className="text-3xl">🐻‍❄️</span>
                <div>
                  <p className="text-[10px] font-bold text-[#F78FB3] uppercase tracking-wider">Meet Tani</p>
                  <p className="text-[11px] font-semibold text-[#4B4453] dark:text-zinc-200">Your Personal Baker</p>
                </div>
              </div>

              {/* Float Premium Badge */}
              <div className="absolute -bottom-6 -right-6 pulse-glow bg-[#FFDDEB] dark:bg-[#522935] p-3 rounded-2xl shadow-lg border border-white dark:border-zinc-800 flex items-center space-x-1">
                <span className="text-lg">🎀</span>
                <span className="text-xs font-extrabold text-[#F78FB3] uppercase tracking-wide">100% Handcrafted</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORIES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Select Category</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">
            Browse Our Sweet Categories
          </h2>
          <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => navigateTo(`categories`)}
              className="group cursor-pointer bg-white dark:bg-[#241F23] rounded-[24px] p-4 text-center border border-pink-50 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative mx-auto w-16 h-16 rounded-full bg-[#FFDDEB]/50 flex items-center justify-center overflow-hidden mb-3">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <CakeIcon className="h-6 w-6 text-[#F78FB3]" />
                )}
              </div>
              <h4 className="font-display font-bold text-xs text-[#4B4453] dark:text-zinc-200 truncate group-hover:text-[#F78FB3]">
                {cat.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section className="bg-pink-50/30 dark:bg-zinc-900/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Baked Fresh Daily</span>
              <h2 className="font-display text-3xl font-extrabold text-[#4B4453] dark:text-zinc-100 mt-1">
                Sweetest Bestsellers
              </h2>
            </div>
            <button 
              onClick={() => navigateTo('cakes')}
              className="flex items-center space-x-1 text-sm font-bold text-[#F78FB3] hover:text-[#F78FB3]/80 cursor-pointer"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((cake) => {
              const mainImg = cake.images[0]?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600';
              const fav = isFavorite(cake.id);
              return (
                <div 
                  key={cake.id} 
                  className="group relative bg-white dark:bg-[#241F23] rounded-[28px] overflow-hidden border border-pink-50 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Badge */}
                  <span className="absolute top-4 left-4 z-10 rounded-full bg-[#FFDDEB] text-[#F78FB3] px-3 py-1 text-[10px] font-bold uppercase tracking-wider pink-glow">
                    Bestseller
                  </span>

                  {/* Favorite trigger */}
                  <button 
                    onClick={() => toggleFavorite(cake.id)}
                    className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 text-[#F78FB3] hover:scale-110 transition-transform cursor-pointer shadow-sm"
                  >
                    <Heart className={`h-4.5 w-4.5 ${fav ? 'fill-[#F78FB3]' : ''}`} />
                  </button>

                  {/* Image container */}
                  <div className="relative w-full aspect-square overflow-hidden cursor-pointer" onClick={() => navigateTo(`cakes`)}>
                    <img src={mainImg} alt={cake.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-[#F78FB3] tracking-widest">{cake.flavor}</span>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-bold text-[#4B4453] dark:text-zinc-300">{cake.rating}</span>
                      </div>
                    </div>
                    <h3 
                      onClick={() => navigateTo('cakes')} 
                      className="font-display font-bold text-lg text-[#4B4453] dark:text-zinc-100 hover:text-[#F78FB3] cursor-pointer truncate"
                    >
                      {cake.name}
                    </h3>
                    <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {cake.description}
                    </p>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-pink-50/50 dark:border-zinc-800/50">
                      <div>
                        <span className="text-[#F78FB3] font-display text-lg font-black">{settings?.currency || '£'}{cake.price.toFixed(2)}</span>
                        {cake.oldPrice && (
                          <span className="text-xs line-through text-[#4B4453]/40 dark:text-zinc-500 ml-2">{settings?.currency || '£'}{cake.oldPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => navigateTo('cakes')}
                        className="rounded-xl bg-[#FFDDEB] hover:bg-[#F78FB3] hover:text-white px-3 py-1.5 text-xs font-bold text-[#F78FB3] transition-colors cursor-pointer"
                      >
                        Order Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Pure Craftsmanship</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">
            Why Sweet by Tani is Special 🎀
          </h2>
          <p className="text-sm text-[#4B4453]/80 dark:text-zinc-300 leading-relaxed font-body">
            Every layer, piped petal, and custom sketch is designed in Tani’s professional bakery with passion and attention to detail. We combine aesthetics with luxury, mouth-watering flavor.
          </p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: Sparkles, title: "Elegant Korean Designs", desc: "Pinterest-worthy pastel bento boxes, Lambeth vintage pipings, and custom hand-drawn character illustrations." },
            { icon: HeartHandshake, title: "Baked on Order", desc: "We never freeze or store pre-made cakes. Every single order is mixed, baked, and detailed fresh 48 hours before delivery." },
            { icon: ShieldCheck, title: "Dietary Customization", desc: "Select eggless, gluten-free, or lower-sugar bases with premium fresh local raspberries and strawberries." },
            { icon: Star, title: "Tani’s Golden Ratio", desc: "Finely balanced buttercream that is velvety and fluffy without being overly sweet. Real vanilla pods and luxury Belgian fudge." }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white dark:bg-[#241F23] border border-pink-50 dark:border-zinc-800 p-6 rounded-[24px] shadow-sm flex space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFDDEB]/50 text-[#F78FB3]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm text-[#4B4453] dark:text-zinc-200">{item.title}</h4>
                  <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS */}
      {reviews.length > 0 && (
        <section className="bg-pink-50/20 dark:bg-zinc-900/10 py-16 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Love letters</span>
            <h2 className="font-display text-3xl font-extrabold text-[#4B4453] dark:text-zinc-100">
              Approved by Cake Lovers 🩷
            </h2>
            
            <div className="relative px-8 py-6 rounded-[32px] bg-white dark:bg-[#241F23] border border-pink-50 dark:border-zinc-800 shadow-sm">
              <Quote className="h-8 w-8 text-[#FFDDEB] mx-auto opacity-50" />
              
              <div className="min-h-[100px] flex items-center justify-center pt-4">
                <p className="text-base sm:text-lg italic text-[#4B4453] dark:text-zinc-300 font-body leading-relaxed max-w-2xl">
                  "{reviews[activeReviewIdx].reviewText}"
                </p>
              </div>

              <div className="flex items-center justify-center space-x-1 text-yellow-500 pt-4">
                {Array.from({ length: reviews[activeReviewIdx].rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm font-bold text-[#F78FB3] mt-2 font-display">
                — {reviews[activeReviewIdx].customerName}
              </p>

              {/* Navigation controls */}
              <div className="flex justify-center space-x-4 pt-6">
                <button onClick={prevReview} className="rounded-full bg-pink-50 p-2 text-[#F78FB3] hover:bg-[#FFDDEB] transition-colors cursor-pointer">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={nextReview} className="rounded-full bg-pink-50 p-2 text-[#F78FB3] hover:bg-[#FFDDEB] transition-colors cursor-pointer">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. ORDER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-[40px] bg-gradient-to-r from-[#FFDDEB] to-[#FFB6C1] dark:from-[#352328] dark:to-[#522935] p-10 sm:p-16 text-center space-y-6 overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 text-9xl opacity-10">🐻‍❄️</div>
          
          <h2 className="font-display text-3xl sm:text-5xl font-black text-[#4B4453] dark:text-zinc-100">
            Design Your Dream Cake with Tani
          </h2>
          <p className="text-sm sm:text-base text-[#4B4453]/80 dark:text-zinc-200 max-w-xl mx-auto leading-relaxed font-body">
            Have a specific custom design or illustration in mind? Message us on WhatsApp or fill out our interactive custom cake form during checkout. Tani will bring your sweetest visions to life!
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigateTo('cakes')} 
              className="rounded-2xl bg-white text-[#F78FB3] px-8 py-4 font-bold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Order a Custom Cake 🎂
            </button>
            <a 
              href={`https://wa.me/${settings?.whatsappNumber || '447123456789'}?text=Hello%20Sweet%20by%20Tani%20👋%20I%20want%20to%20discuss%20a%20custom%20cake%20order!`} 
              target="_blank" 
              rel="noreferrer" 
              className="rounded-2xl bg-[#25D366] text-white px-8 py-4 font-bold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center"
            >
              Message Tani on WhatsApp 💬
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
