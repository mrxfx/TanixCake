import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { getCategories, getGallery, getOffers, getFAQs } from '../../lib/services/db';
import { Category, GalleryItem, Offer, FAQ } from '../../types';
import { Sparkles, Calendar, Tag, Search, ArrowRight, MapPin, Phone, Mail, Instagram, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

// ============================================================
// 1. CATEGORIES PAGE
// ============================================================
export function CategoriesPage() {
  const { navigateTo } = useAppContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data.filter(c => c.active));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="py-20 text-center shimmer rounded-3xl max-w-4xl mx-auto" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Aesthetic Choices</span>
        <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">Browse by Categories</h1>
        <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => navigateTo('cakes')}
            className="group cursor-pointer relative rounded-[32px] overflow-hidden bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
          >
            <div className="relative aspect-video overflow-hidden bg-pink-100/30">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🎂</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <h3 className="absolute bottom-4 left-4 font-display text-lg font-black text-white">{cat.name}</h3>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <p className="text-xs text-[#4B4453]/80 dark:text-zinc-300 leading-relaxed font-body">{cat.description}</p>
              <button className="flex items-center space-x-1.5 text-xs font-bold text-[#F78FB3] hover:text-[#F78FB3]/80 pt-2 cursor-pointer">
                <span>View Products</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 2. GALLERY PAGE
// ============================================================
export function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getGallery();
      setGallery(data);
      setLoading(false);
    }
    load();
  }, []);

  const categoriesList = ['All', 'Birthday', 'Anniversary', 'Bento', 'Custom', 'Special', 'Behind the Scenes'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Visual Inspiration</span>
        <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">Cake Design Gallery</h1>
        <p className="text-sm text-[#4B4453]/70 dark:text-zinc-400 font-body max-w-md mx-auto">
          Take a look at Tani’s custom creations and premium detailed piping artwork. Find the perfect design inspiration for your celebration!
        </p>
        <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
      </div>

      {/* Category selector pills */}
      <div className="flex flex-wrap gap-2.5 justify-center mb-10">
        {categoriesList.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#F78FB3] text-white shadow-sm'
                : 'bg-white text-[#4B4453]/80 border border-pink-100 dark:bg-[#241F23] dark:border-zinc-800 dark:text-zinc-300 hover:bg-pink-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square shimmer rounded-3xl" />
          ))}
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#241F23] border rounded-[32px] border-pink-50 dark:border-zinc-800 space-y-4">
          <span className="text-5xl">🐻‍❄️</span>
          <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400">Our gallery is currently baking, check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div 
              key={item.id}
              className="group relative aspect-square rounded-[24px] overflow-hidden border border-pink-50 dark:border-zinc-800 shadow-sm"
            >
              <img src={item.url} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs font-bold text-white bg-[#F78FB3] rounded-full px-3 py-1">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 3. OFFERS PAGE
// ============================================================
export function OffersPage() {
  const { applyCoupon, settings } = useAppContext();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getOffers();
      setOffers(data.filter(o => o.active));
      setLoading(false);
    }
    load();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return <div className="py-20 text-center shimmer rounded-3xl max-w-4xl mx-auto" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Savings 💖</span>
        <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">Special Campaigns & Coupons</h1>
        <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#241F23] border border-pink-50 dark:border-zinc-800 rounded-[32px] space-y-4">
          <span className="text-5xl">🥺</span>
          <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400">No active coupon codes right now. Please message Tani for custom quotes!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="relative bg-gradient-to-br from-white to-[#FFDDEB]/20 dark:from-[#241F23] dark:to-zinc-900 border border-pink-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-[#FFDDEB] text-[#F78FB3] dark:bg-zinc-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                Active Offer
              </div>

              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFDDEB]/50 text-[#F78FB3]">
                  <Tag className="h-5 w-5" />
                </div>
                <h3 className="font-display font-black text-xl text-[#4B4453] dark:text-zinc-100">{offer.title}</h3>
                <p className="text-xs text-[#4B4453]/70 dark:text-zinc-300 leading-relaxed font-body">{offer.description}</p>
              </div>

              {/* Coupon Box */}
              <div className="mt-6 flex items-center justify-between bg-white dark:bg-[#1A1618] border border-dashed border-pink-300 dark:border-zinc-700 p-3.5 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold text-[#4B4453]/50 uppercase block">Coupon Code</span>
                  <span className="font-mono text-sm font-black text-[#F78FB3] tracking-wider">{offer.code}</span>
                </div>
                <button
                  onClick={() => handleCopy(offer.code)}
                  className="flex items-center space-x-1 rounded-xl bg-pink-50 hover:bg-[#FFDDEB] p-2 text-xs font-bold text-[#F78FB3] cursor-pointer transition-colors"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 4. ABOUT PAGE
// ============================================================
export function AboutPage() {
  const { settings } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Story details */}
        <div className="space-y-6">
          <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Our Baker 👩‍🍳</span>
          <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">The Story of Sweet by Tani</h1>
          <p className="text-sm text-[#4B4453]/85 dark:text-zinc-300 leading-relaxed font-body">
            Welcome to Sweet by Tani! What started in Tani’s small London flat as a passion for aesthetic pastry-making has turned into London’s favorite artisanal bakery for bespoke bento, birthday, and celebration cakes.
          </p>
          <p className="text-sm text-[#4B4453]/85 dark:text-zinc-300 leading-relaxed font-body">
            Tani is inspired by the delicate, whimsical, minimalist aesthetic of South Korean and Japanese boutique bakeries. We believe that cakes shouldn’t just look like gorgeous works of art; they must taste absolutely heavenly. That is why Tani uses organic British strawberries, rich organic butter, free-range local eggs, and real vanilla pods.
          </p>
          
          <div className="p-4 rounded-3xl bg-pink-50/50 dark:bg-zinc-800/40 border border-pink-100/50 flex items-center space-x-4">
            <span className="text-4xl">🩷</span>
            <div>
              <p className="text-xs font-bold text-[#F78FB3]">Baked Freshly to Order</p>
              <p className="text-[11px] text-[#4B4453]/70 dark:text-zinc-400">Everything is whipped up from scratch. Zero frozen premixes or artificial stabilizers.</p>
            </div>
          </div>
        </div>

        {/* Visual Story image */}
        <div className="relative justify-self-center">
          <div className="absolute w-full h-full bg-[#FFDDEB]/50 rounded-[48px] blur-xl -rotate-6" />
          <div className="relative rounded-[40px] overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl max-w-sm aspect-square bg-pink-100">
            <img 
              src="https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80" 
              alt="Baking custom pastel bows" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================================
// 5. FAQ PAGE
// ============================================================
export function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getFAQs();
      setFaqs(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredFAQs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 min-h-[70vh]">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Help Center 🐻‍❄️</span>
        <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">Frequently Asked Questions</h1>
        <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
      </div>

      {/* Search FAQ */}
      <div className="relative mb-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#4B4453]/40" />
        <input 
          type="text"
          placeholder="Search questions (e.g., storage, ingredients, delivery)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:text-white"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 shimmer rounded-2xl" />)}
        </div>
      ) : filteredFAQs.length === 0 ? (
        <p className="text-center text-xs text-[#4B4453]/60 dark:text-zinc-400">No matching questions found.</p>
      ) : (
        <div className="space-y-4">
          {filteredFAQs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-white dark:bg-[#241F23] border border-pink-50 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 flex justify-between items-center font-display font-bold text-sm text-[#4B4453] dark:text-zinc-200 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className="text-[#F78FB3] text-lg">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-pink-50/50 dark:border-zinc-850 text-xs text-[#4B4453]/80 dark:text-zinc-300 leading-relaxed font-body">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 6. CONTACT PAGE
// ============================================================
export function ContactPage() {
  const { settings, showToast } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill out all fields! 🐻‍❄️', 'error');
      return;
    }
    showToast('Your message has been sent successfully! Tani will reply within 24 hours. 🩷', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Connect with Us</span>
        <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">Get in Touch</h1>
        <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact details */}
        <div className="space-y-8 bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-8 rounded-[32px] shadow-sm">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-[#4B4453] dark:text-white">Store Information</h2>
            <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400">Feel free to call, email, or message Tani directly on Instagram or WhatsApp!</p>
          </div>

          <div className="space-y-4 text-xs text-[#4B4453]/80 dark:text-zinc-300">
            <div className="flex items-center space-x-3.5">
              <MapPin className="h-5 w-5 text-[#F78FB3]" />
              <span>{settings?.address || '15 Bakery Lane, London, UK'}</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <Phone className="h-5 w-5 text-[#F78FB3]" />
              <span>{settings?.phone || '+44 7123 456789'}</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <Mail className="h-5 w-5 text-[#F78FB3]" />
              <span>{settings?.email || 'hello@sweetbytani.com'}</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <Instagram className="h-5 w-5 text-[#F78FB3]" />
              <span>{settings?.instagramUrl || '@sweetbytani'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-pink-50 dark:border-zinc-800">
            <h4 className="font-bold text-xs text-[#4B4453] dark:text-white uppercase tracking-wider mb-2">Bake Kitchen Hours</h4>
            <p className="text-xs text-[#4B4453]/80 dark:text-zinc-300">
              {settings?.openingHours || 'Mon-Sat: 09:00 AM - 07:00 PM, Sun: 10:00 AM - 04:00 PM'}
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <a 
              href={`https://wa.me/${settings?.whatsappNumber || '447123456789'}?text=Hello%20Sweet%20by%20Tani%20👋`} 
              target="_blank" 
              rel="noreferrer" 
              className="rounded-2xl bg-[#25D366] text-white text-center py-3 font-bold text-xs hover:scale-102 transition-transform duration-200 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Message Tani on WhatsApp 💬</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-8 rounded-[32px] shadow-sm">
          <h2 className="font-display text-xl font-bold text-[#4B4453] dark:text-white">Send Tani a Message</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#F78FB3] uppercase">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#F78FB3] uppercase">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#F78FB3] uppercase">Subject</label>
            <input 
              type="text" 
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#F78FB3] uppercase">Message Content</label>
            <textarea 
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <button 
            type="submit"
            className="w-full rounded-xl bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white font-bold text-xs py-3.5 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            Send Message 🎀
          </button>
        </form>

      </div>
    </div>
  );
}
