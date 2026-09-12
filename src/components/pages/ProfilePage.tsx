import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { getCustomerOrders, updateUserProfile, getCakes } from '../../lib/services/db';
import { Order, Cake } from '../../types';
import { Heart, ClipboardList, Settings, User, Eye, Sparkles, MapPin, Phone, Lock, Mail, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfilePage() {
  const { 
    user, 
    userProfile, 
    authLoading, 
    login, 
    register, 
    favorites, 
    toggleFavorite,
    settings,
    showToast
  } = useAppContext();

  // Authentication states
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'settings'>('orders');

  // Customer DB records
  const [orders, setOrders] = useState<Order[]>([]);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile fields editing
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editName, setEditName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Sync profile fields
  useEffect(() => {
    if (userProfile) {
      setEditPhone(userProfile.phone || '');
      setEditAddress(userProfile.address || '');
      setEditName(userProfile.name || '');
    }
  }, [userProfile]);

  // Load orders and cakes on mount/login
  useEffect(() => {
    async function loadDashboardData() {
      if (user) {
        setOrdersLoading(true);
        try {
          const [customerOrders, allCakes] = await Promise.all([
            getCustomerOrders(user.uid),
            getCakes()
          ]);
          setOrders(customerOrders);
          setCakes(allCakes);
        } catch (e) {
          console.error('Error loading dashboard data:', e);
        } finally {
          setOrdersLoading(false);
        }
      }
    }
    loadDashboardData();
  }, [user]);

  // Auth form submissions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLoginView && !name)) {
      showToast('Please fill out all fields 🐻‍❄️', 'error');
      return;
    }

    setAuthSubmitting(true);
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await register(email, name, password);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProfileSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name: editName,
        phone: editPhone,
        address: editAddress
      });
      showToast('Profile updated successfully! ✨', 'success');
    } catch (err) {
      showToast('Could not update profile', 'error');
    } finally {
      setProfileSaving(false);
    }
  };



  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <span className="text-4xl animate-spin">🥞</span>
        <p className="text-xs text-[#4B4453]/60">Checking authentication state...</p>
      </div>
    );
  }

  // ============================================================
  // UNAUTHENTICATED: LOGIN / REGISTER FORMS
  // ============================================================
  if (!user || !userProfile) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 min-h-[80vh] flex flex-col justify-center">
        <div className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 rounded-[40px] p-8 shadow-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="text-4xl teddy-float inline-block">🐻‍❄️</div>
            <h1 className="font-display text-2xl font-extrabold text-[#4B4453] dark:text-white">
              {isLoginView ? 'Welcome to Sweet by Tani' : 'Create Customer Account'}
            </h1>
            <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400">
              {isLoginView ? 'Sign in to access order tracking & favorites!' : 'Join our sweet baking club!'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLoginView && (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#F78FB3] uppercase tracking-wider">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-300" />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 pl-10 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#F78FB3] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-300" />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 pl-10 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-[#F78FB3] uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-300" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 pl-10 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full rounded-xl bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white font-bold text-xs py-3.5 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              {authSubmitting ? 'Processing...' : isLoginView ? 'Login 💖' : 'Join Club 🎀'}
            </button>
          </form>

          {/* Direct toggles */}
          <div className="text-center text-xs">
            <button 
              onClick={() => setIsLoginView(!isLoginView)} 
              className="text-[#F78FB3] font-bold hover:underline cursor-pointer"
            >
              {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>



        </div>
      </div>
    );
  }

  // ============================================================
  // AUTHENTICATED: CUSTOMER ACCOUNT DASHBOARD
  // ============================================================
  const favoriteCakes = cakes.filter(c => favorites.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Profile summary header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 rounded-[36px] p-6 mb-10 gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-[#FFDDEB] text-4xl flex items-center justify-center border-2 border-white pink-glow">
            👩‍🍳
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="font-display text-xl font-extrabold text-[#4B4453] dark:text-white">{userProfile.name}</h2>
              {userProfile.role === 'admin' && (
                <span className="rounded-full bg-pink-100 text-[#F78FB3] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">Admin</span>
              )}
            </div>
            <p className="text-xs text-[#4B4453]/60 dark:text-zinc-400 font-body">{userProfile.email}</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2">
          {[
            { id: 'orders', label: 'My Orders', icon: ClipboardList },
            { id: 'favorites', label: 'My Favorites', icon: Heart },
            { id: 'settings', label: 'My Details', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition-all ${
                  active
                    ? 'bg-[#F78FB3] text-white shadow-sm'
                    : 'bg-pink-50 text-[#4B4453]/80 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-pink-100/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab content router */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: ORDER TRACKING */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            <h3 className="font-display text-xl font-bold text-[#4B4453] dark:text-white flex items-center">
              <ClipboardList className="h-5 w-5 text-[#F78FB3] mr-2" />
              Order Status & History
            </h3>

            {ordersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-32 shimmer rounded-3xl" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 rounded-[32px] space-y-4">
                <span className="text-5xl">🥺</span>
                <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400">You haven't placed any orders yet. Tani is waiting to bake for you!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord) => {
                  
                  // Status steps for tracking bar
                  const steps = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Completed'];
                  const statusIdx = steps.indexOf(ord.status);
                  
                  return (
                    <div 
                      key={ord.id}
                      className="bg-white dark:bg-[#241F23] border border-pink-50 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm space-y-6"
                    >
                      {/* Summary top row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-pink-50/50 pb-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#F78FB3] uppercase block">Order Code</span>
                          <span className="font-display font-bold text-sm text-[#4B4453] dark:text-white">{ord.orderNumber}</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-bold text-[#4B4453]/50 uppercase block">Delivery Date</span>
                          <span className="text-xs font-bold text-[#4B4453] dark:text-zinc-200">{ord.deliveryDate} @ {ord.deliveryTime}</span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-bold text-[#4B4453]/50 uppercase block">Total Price</span>
                          <span className="font-display font-black text-sm text-[#F78FB3]">{settings?.currency || '£'}{ord.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="space-y-3">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-[#4B4453]/85 dark:text-zinc-300">
                            <span>{item.cakeName} ({item.weight}, {item.flavor}) x{item.quantity}</span>
                            <span className="font-semibold">{settings?.currency || '£'}{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Tracker progress bar */}
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-[#F78FB3] uppercase tracking-wider">
                          <span>Status: <strong>{ord.status}</strong></span>
                        </div>
                        
                        {/* Progress Bar */}
                        {ord.status === 'Cancelled' ? (
                          <div className="h-2 bg-red-100 rounded-full w-full">
                            <div className="h-full bg-red-500 rounded-full w-full" />
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="h-2 bg-pink-50 dark:bg-zinc-800 rounded-full w-full overflow-hidden">
                              <div 
                                className="h-full bg-[#F78FB3]" 
                                style={{ width: `${((statusIdx + 1) / steps.length) * 100}%` }}
                              />
                            </div>
                            {/* Circle dots */}
                            <div className="hidden sm:flex justify-between mt-1 text-[8px] font-bold uppercase text-[#4B4453]/50">
                              {steps.map((st, i) => {
                                const current = i <= statusIdx;
                                return (
                                  <span key={st} className={current ? 'text-[#F78FB3]' : ''}>
                                    {st}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: FAVORITES GRID */}
        {activeTab === 'favorites' && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6"
          >
            <h3 className="font-display text-xl font-bold text-[#4B4453] dark:text-white flex items-center">
              <Heart className="h-5 w-5 text-[#F78FB3] mr-2" />
              My Saved Cakes
            </h3>

            {favoriteCakes.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 rounded-[32px] space-y-4">
                <span className="text-5xl">🤍</span>
                <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400">Your favorites folder is empty. Browse cakes to save your targets!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteCakes.map((cake) => {
                  const mainImg = cake.images[0]?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300';
                  return (
                    <div 
                      key={cake.id}
                      className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 rounded-3xl overflow-hidden p-3 shadow-sm relative group"
                    >
                      <button
                        onClick={() => toggleFavorite(cake.id)}
                        className="absolute top-4.5 right-4.5 z-10 rounded-full bg-white/80 p-1.5 text-[#F78FB3] cursor-pointer"
                      >
                        <Heart className="h-4 w-4 fill-[#F78FB3]" />
                      </button>
                      <div className="aspect-square rounded-2xl overflow-hidden bg-pink-100/10">
                        <img src={mainImg} alt={cake.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="font-display font-bold text-sm text-[#4B4453] dark:text-white truncate">{cake.name}</h4>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs font-black text-[#F78FB3]">{settings?.currency || '£'}{cake.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: ACCOUNT DETAILS */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="max-w-xl"
          >
            <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-8 rounded-[32px] shadow-sm space-y-5">
              <h3 className="font-display text-xl font-bold text-[#4B4453] dark:text-white flex items-center">
                <Settings className="h-5 w-5 text-[#F78FB3] mr-2" />
                Account Settings
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Display Name</label>
                <input 
                  type="text" 
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  disabled
                  value={userProfile.email}
                  className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 p-2.5 text-xs text-zinc-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase font-body">Phone Number</label>
                <input 
                  type="tel" 
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Default Shipping Address</label>
                <input 
                  type="text" 
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Street details, London"
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full rounded-xl bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white font-bold text-xs py-3.5 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
              >
                {profileSaving ? 'Saving...' : 'Update My Details 🌸'}
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
