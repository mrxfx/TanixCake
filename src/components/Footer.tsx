import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Phone, Mail, MapPin, Instagram, Facebook, Sparkles } from 'lucide-react';

export default function Footer() {
  const { navigateTo, settings } = useAppContext();

  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FFDDEB]/30 dark:bg-[#151113] border-t border-pink-100 dark:border-zinc-900 pt-16 pb-28 lg:pb-16 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo('home')}>
              <span className="text-2xl">🐻‍❄️</span>
              <span className="font-display text-2xl font-extrabold tracking-tight text-[#F78FB3]">
                {settings?.businessName || 'Sweet by Tani'}
              </span>
            </div>
            <p className="text-sm text-[#4B4453]/80 dark:text-zinc-300 italic">
              "{settings?.tagline || 'Freshly Baked with Love 🩷'}"
            </p>
            <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400 leading-relaxed">
              Premium custom cakes, cupcakes, and bento desserts curated specially for your sweetest celebrations in London.
            </p>
            <div className="flex space-x-4 pt-2">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-[#F78FB3] hover:scale-110 transition-transform">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-[#F78FB3] hover:scale-110 transition-transform">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-bold text-[#4B4453] dark:text-zinc-100 uppercase tracking-widest mb-4">
              Explore Our Store
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Fresh Cakes Catalog', page: 'cakes' },
                { name: 'Browse Categories', page: 'categories' },
                { name: 'Cake Gallery Inspiration', page: 'gallery' },
                { name: 'Limited-Time Offers', page: 'offers' },
                { name: 'About Our Baker Tani', page: 'about' }
              ].map((link) => (
                <li key={link.page}>
                  <button 
                    onClick={() => navigateTo(link.page)} 
                    className="text-[#4B4453]/80 hover:text-[#F78FB3] transition-colors dark:text-zinc-300 dark:hover:text-[#FFB6C1] cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display text-base font-bold text-[#4B4453] dark:text-zinc-100 uppercase tracking-widest mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-sm text-[#4B4453]/80 dark:text-zinc-300">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#F78FB3] shrink-0 mt-0.5" />
                <span>{settings?.address || '15 Bakery Lane, London, UK'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#F78FB3] shrink-0" />
                <span>{settings?.phone || '+44 7123 456789'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#F78FB3] shrink-0" />
                <span>{settings?.email || 'hello@sweetbytani.com'}</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-display text-base font-bold text-[#4B4453] dark:text-zinc-100 uppercase tracking-widest mb-4">
              Bake Hours 👩‍🍳
            </h4>
            <p className="text-sm leading-relaxed text-[#4B4453]/80 dark:text-zinc-300">
              {settings?.openingHours || 'Mon-Sat: 09:00 AM - 07:00 PM, Sun: 10:00 AM - 04:00 PM'}
            </p>
            <div className="mt-4 p-3 rounded-2xl bg-[#FFDDEB]/40 dark:bg-zinc-800/40 border border-pink-100/50 dark:border-zinc-800">
              <p className="text-xs text-[#F78FB3] font-bold flex items-center">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Freshly Baked Daily
              </p>
              <p className="text-[10px] text-[#4B4453]/60 dark:text-zinc-400 mt-1">
                Every treat is handcrafted directly in Tani’s kitchen with standard safety and premium ingredients.
              </p>
            </div>
          </div>

        </div>

        <hr className="my-10 border-pink-100 dark:border-zinc-900" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4B4453]/60 dark:text-zinc-500">
          <p>© {year} Sweet by Tani. All Rights Reserved. Freshly Baked with Love 🩷</p>
          <div className="flex space-x-6">
            <button onClick={() => navigateTo('faq')} className="hover:text-[#F78FB3] cursor-pointer">FAQs</button>
            <button onClick={() => navigateTo('contact')} className="hover:text-[#F78FB3] cursor-pointer">Support</button>
            <button onClick={() => navigateTo('admin-login')} className="hover:text-[#F78FB3] cursor-pointer font-bold">Admin Console</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
