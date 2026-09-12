import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { ShoppingBag, Heart, User, Sun, Moon, Sparkles, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { 
    userProfile, 
    cart, 
    favorites, 
    isDarkMode, 
    toggleTheme, 
    navigateTo, 
    currentPage, 
    logout,
    settings
  } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const favCount = favorites.length;

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Cakes', page: 'cakes' },
    { label: 'Categories', page: 'categories' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Special Offers', page: 'offers' },
    { label: 'About Us', page: 'about' },
    { label: 'FAQ', page: 'faq' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { navigateTo('home'); setIsMenuOpen(false); }} 
            className="flex cursor-pointer items-center space-x-2"
            id="brand-logo"
          >
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#FFDDEB] text-2xl font-bold text-[#F78FB3] pink-glow">
              🐻‍❄️
              <span className="absolute -top-1 -right-1 text-xs">✨</span>
            </div>
            <div>
              <span className="font-display text-2xl font-extrabold tracking-tight text-[#F78FB3] dark:text-[#FFB6C1]">
                Sweet by Tani
              </span>
              <p className="text-[10px] tracking-widest text-[#4B4453] dark:text-[#F0EAF1] uppercase font-semibold">
                {settings?.tagline || 'Freshly Baked with Love 🩷'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => navigateTo(item.page)}
                  className={`relative font-body text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
                    isActive 
                      ? 'text-[#F78FB3] font-bold' 
                      : 'text-[#4B4453] hover:text-[#F78FB3] dark:text-[#F0EAF1] dark:hover:text-[#FFB6C1]'
                  }`}
                  id={`nav-${item.page}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="navIndicator" 
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#F78FB3]" 
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-6">
            

            {/* Favorites Badge */}
            <button 
              onClick={() => navigateTo('profile')} 
              className="relative rounded-full p-2 text-[#4B4453] hover:bg-[#FFDDEB]/40 hover:text-[#F78FB3] dark:text-[#F0EAF1] dark:hover:bg-white/5 cursor-pointer transition-all duration-200"
              id="favorites-badge-btn"
            >
              <Heart className="h-5 w-5" />
              {favCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#F78FB3] text-[9px] font-bold text-white">
                  {favCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Bag */}
            <button 
              onClick={() => navigateTo('cart')} 
              className="relative rounded-full p-2 text-[#4B4453] hover:bg-[#FFDDEB]/40 hover:text-[#F78FB3] dark:text-[#F0EAF1] dark:hover:bg-white/5 cursor-pointer transition-all duration-200"
              id="cart-badge-btn"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#F78FB3] text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Droplist */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center space-x-1 rounded-full bg-[#FFDDEB]/40 px-3 py-1.5 text-sm font-medium text-[#4B4453] dark:text-[#F0EAF1] dark:bg-white/5 hover:bg-[#FFDDEB]/60 cursor-pointer transition-all duration-200"
                id="profile-dropdown-btn"
              >
                {userProfile ? (
                  <>
                    <span className="mr-1">🐻‍❄️</span>
                    <span className="max-w-[100px] truncate">{userProfile.name}</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-1" />
                    <span>Login</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white p-2 shadow-lg dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800"
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    {userProfile ? (
                      <>
                        <button 
                          onClick={() => { navigateTo('profile'); setIsProfileOpen(false); }} 
                          className="flex w-full items-center px-4 py-2 text-left text-sm text-[#4B4453] hover:bg-pink-50 hover:text-[#F78FB3] rounded-lg dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          My Dashboard
                        </button>
                        {userProfile.role === 'admin' && (
                          <button 
                            onClick={() => { navigateTo('admin'); setIsProfileOpen(false); }} 
                            className="flex w-full items-center px-4 py-2 text-left text-sm text-[#4B4453] hover:bg-pink-50 hover:text-[#F78FB3] rounded-lg font-bold dark:text-zinc-200 dark:hover:bg-zinc-800"
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4 text-[#F78FB3]" />
                            Admin Console
                          </button>
                        )}
                        <hr className="my-1 border-pink-100 dark:border-zinc-800" />
                        <button 
                          onClick={() => { logout(); setIsProfileOpen(false); }} 
                          className="flex w-full items-center px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 rounded-lg dark:hover:bg-red-950/20"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { navigateTo('profile'); setIsProfileOpen(false); }} 
                          className="flex w-full items-center px-4 py-2 text-left text-sm text-[#4B4453] hover:bg-pink-50 hover:text-[#F78FB3] rounded-lg dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          Customer Login
                        </button>
                        <button 
                          onClick={() => { navigateTo('admin-login'); setIsProfileOpen(false); }} 
                          className="flex w-full items-center px-4 py-2 text-left text-sm text-[#4B4453] hover:bg-pink-50 hover:text-[#F78FB3] rounded-lg dark:text-zinc-200 dark:hover:bg-zinc-800"
                        >
                          Admin Login
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="rounded-full p-1.5 text-[#4B4453] dark:text-[#F0EAF1] cursor-pointer"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sidebar Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-pink-100 bg-white/95 dark:bg-[#1A1618]/95 dark:border-zinc-800 overflow-hidden"
          >
            <div className="space-y-1 px-4 pt-2 pb-6">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => { navigateTo(item.page); setIsMenuOpen(false); }}
                  className="block w-full py-3 text-left font-body text-base font-medium text-[#4B4453] hover:text-[#F78FB3] border-b border-pink-50/50 dark:text-zinc-200 dark:border-zinc-800/50"
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 flex justify-between">
                <button 
                  onClick={() => { navigateTo('profile'); setIsMenuOpen(false); }}
                  className="flex items-center space-x-2 rounded-xl bg-[#FFDDEB] px-4 py-2.5 text-sm font-semibold text-[#F78FB3]"
                >
                  <User className="h-4 w-4" />
                  <span>{userProfile ? 'My Account' : 'Login / Register'}</span>
                </button>
                {userProfile?.role === 'admin' && (
                  <button 
                    onClick={() => { navigateTo('admin'); setIsMenuOpen(false); }}
                    className="flex items-center space-x-2 rounded-xl bg-zinc-800 text-white px-4 py-2.5 text-sm font-semibold dark:bg-zinc-700"
                  >
                    <span>Admin Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
