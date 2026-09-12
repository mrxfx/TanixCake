import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { 
  getCakes, getCategories, getOrders, getGallery, getReviews, getFAQs, getOffers, getCustomers,
  createCake, updateCake, deleteCake,
  createCategory, updateCategory, deleteCategory,
  updateOrderStatus,
  addGalleryImage, deleteGalleryImage,
  updateReviewStatus, deleteReview,
  addFAQ, updateFAQ, deleteFAQ,
  addOffer, updateOffer, deleteOffer,
  updateBusinessSettings
} from '../../lib/services/db';
import { uploadImage, deleteImage } from '../../lib/services/image';
import { 
  Cake, Category, Order, GalleryItem, Review, FAQ, Offer, UserProfile, CakeImage 
} from '../../types';
import { 
  LayoutDashboard, Cake as CakeIcon, FolderHeart, ClipboardList, Image as ImageIcon, 
  Star, Tag, Users, HelpCircle, Settings, LogOut, Plus, Trash2, Edit3, Check, X, Eye, 
  Upload, AlertTriangle, ShieldAlert, Award, TrendingUp, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminConsole() {
  const { userProfile, navigateTo, logout, settings, refreshSettings, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cakes' | 'categories' | 'orders' | 'gallery' | 'reviews' | 'offers' | 'customers' | 'faq' | 'settings'>('dashboard');

  // Unified State Stores
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all admin datasets on mount/tab trigger
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [allCakes, allCats, allOrders, allGallery, allReviews, allFaqs, allOffers, allCustomers] = await Promise.all([
        getCakes(),
        getCategories(),
        getOrders(),
        getGallery(),
        getReviews(),
        getFAQs(),
        getOffers(),
        getCustomers()
      ]);
      setCakes(allCakes);
      setCategories(allCats);
      setOrders(allOrders);
      setGallery(allGallery);
      setReviews(allReviews);
      setFaqs(allFaqs);
      setOffers(allOffers);
      setCustomers(allCustomers);
    } catch (e) {
      console.error('Error fetching admin console data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile && userProfile.role === 'admin') {
      loadAdminData();
    }
  }, [userProfile]);

  // Auth Guard
  if (!userProfile || userProfile.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto animate-bounce" />
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-black text-[#4B4453]">Unauthorized Access</h1>
          <p className="text-xs text-[#4B4453]/70">You must be logged in as an administrator to access the Sweet by Tani Admin Console.</p>
        </div>
        <button 
          onClick={() => navigateTo('profile')} 
          className="rounded-xl bg-[#F78FB3] px-6 py-3 font-bold text-xs text-white shadow-md cursor-pointer"
        >
          Go to Customer Profile
        </button>
      </div>
    );
  }

  // Sidebar link config
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cakes', label: 'Cakes Editor', icon: CakeIcon },
    { id: 'categories', label: 'Categories', icon: FolderHeart },
    { id: 'orders', label: 'Orders Status', icon: ClipboardList },
    { id: 'gallery', label: 'Gallery Admin', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'offers', label: 'Coupons CMS', icon: Tag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'faq', label: 'FAQs CMS', icon: HelpCircle },
    { id: 'settings', label: 'Business Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-[#151113]">
      
      {/* 1. SIDEBAR - Responsive Collapsible */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#241F23] border-r border-pink-100 dark:border-zinc-800 p-5 shrink-0 justify-between">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🐻‍❄️</span>
            <div>
              <span className="font-display font-extrabold text-[#F78FB3] text-lg block">Tani's Console</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Store Operator</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center space-x-3 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#FFDDEB] text-[#F78FB3]'
                      : 'text-zinc-600 hover:bg-pink-50/50 hover:text-[#F78FB3] dark:text-zinc-300 dark:hover:bg-zinc-850'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={logout}
          className="flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Admin Mode</span>
        </button>
      </aside>

      {/* 2. MAIN DISPLAY CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 pb-28 md:pb-8">
        
        {/* Mobile Header Menu Indicator */}
        <div className="md:hidden flex justify-between items-center bg-white dark:bg-[#241F23] p-4 rounded-2xl border border-pink-100 dark:border-zinc-800">
          <span className="font-display font-black text-sm text-[#F78FB3]">Tani's Store Control Panel</span>
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="text-xs font-bold border border-pink-100 rounded-xl p-1.5 focus:outline-none dark:bg-zinc-800 dark:text-white"
          >
            {menuItems.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <span className="text-4xl animate-spin">🥞</span>
            <p className="text-xs text-zinc-400">Loading master records from Firestore...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* PANEL 1: DASHBOARD ANALYTICS */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-2xl font-extrabold text-[#4B4453] dark:text-white">Store Analytics Overview</h2>
                  <button onClick={loadAdminData} className="rounded-xl bg-pink-50 hover:bg-[#FFDDEB] px-3.5 py-2 text-xs font-bold text-[#F78FB3] transition-colors">
                    Sync Records
                  </button>
                </div>

                {/* Scorecards Deck */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Total Orders", val: orders.length, emoji: "📦", color: "bg-blue-50 text-blue-600" },
                    { title: "Pending Orders", val: orders.filter(o => o.status === 'Pending').length, emoji: "⏳", color: "bg-amber-50 text-amber-600" },
                    { title: "Active Cakes", val: cakes.length, emoji: "🎂", color: "bg-pink-50 text-pink-600" },
                    { title: "Store Revenue", val: `${settings?.currency || '£'}${orders.filter(o => o.status === 'Completed').reduce((acc, o) => acc + o.total, 0).toFixed(2)}`, emoji: "💰", color: "bg-green-50 text-green-600" }
                  ].map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#241F23] rounded-3xl p-5 border border-pink-100 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl ${card.color}`}>
                        {card.emoji}
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{card.title}</p>
                        <p className="text-lg font-black text-zinc-700 dark:text-white mt-0.5">{card.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Orders table */}
                <div className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white uppercase tracking-wider">Recent Orders Log</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-300">
                      <thead>
                        <tr className="border-b border-pink-50 dark:border-zinc-800 pb-2">
                          <th className="py-2.5">Code</th>
                          <th>Customer</th>
                          <th>Delivery Date</th>
                          <th>Grand Total</th>
                          <th>Current Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="border-b border-pink-50/50 dark:border-zinc-800/50">
                            <td className="py-3 font-mono font-bold text-[#F78FB3]">{ord.orderNumber}</td>
                            <td>{ord.customerName}</td>
                            <td>{ord.deliveryDate}</td>
                            <td className="font-bold">{settings?.currency || '£'}{ord.total.toFixed(2)}</td>
                            <td>
                              <span className="rounded-full bg-[#FFDDEB] text-[#F78FB3] px-2 py-0.5 font-bold">{ord.status}</span>
                            </td>
                            <td>
                              <button onClick={() => { setActiveTab('orders'); }} className="text-xs text-[#F78FB3] font-bold hover:underline">Manage</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PANEL 2: CAKES CRUD EDITOR */}
            {activeTab === 'cakes' && (
              <motion.div key="cakes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <CakeCrudManager cakes={cakes} categories={categories} settings={settings} onRefresh={loadAdminData} showToast={showToast} />
              </motion.div>
            )}

            {/* PANEL 3: CATEGORIES MANAGER */}
            {activeTab === 'categories' && (
              <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <CategoryCrudManager categories={categories} onRefresh={loadAdminData} showToast={showToast} />
              </motion.div>
            )}

            {/* PANEL 4: ORDERS TRACKING CONSOLE */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <OrdersConsoleManager orders={orders} settings={settings} onRefresh={loadAdminData} showToast={showToast} />
              </motion.div>
            )}

            {/* PANEL 5: GALLERY CURATOR */}
            {activeTab === 'gallery' && (
              <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <GalleryConsoleManager gallery={gallery} settings={settings} onRefresh={loadAdminData} showToast={showToast} />
              </motion.div>
            )}

            {/* PANEL 6: REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <ReviewsConsoleManager reviews={reviews} onRefresh={loadAdminData} showToast={showToast} />
              </motion.div>
            )}

            {/* PANEL 7: OFFERS & COUPONS */}
            {activeTab === 'offers' && (
              <motion.div key="offers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <OffersConsoleManager offers={offers} onRefresh={loadAdminData} showToast={showToast} />
              </motion.div>
            )}

            {/* PANEL 8: CUSTOMERS LIST */}
            {activeTab === 'customers' && (
              <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white uppercase tracking-wider">Registered Store Customers</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-300">
                      <thead>
                        <tr className="border-b border-pink-50 pb-2">
                          <th className="py-2.5">Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Registered Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((cust) => (
                          <tr key={cust.uid} className="border-b border-pink-50/50 dark:border-zinc-800/50">
                            <td className="py-3 font-bold">{cust.name}</td>
                            <td>{cust.email}</td>
                            <td>{cust.phone || 'None'}</td>
                            <td>{cust.address || 'None'}</td>
                            <td>{cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'None'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PANEL 9: FAQS */}
            {activeTab === 'faq' && (
              <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <FAQConsoleManager faqs={faqs} onRefresh={loadAdminData} showToast={showToast} />
              </motion.div>
            )}

            {/* PANEL 10: BUSINESS SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <SettingsConsoleManager settings={settings} onRefresh={refreshSettings} showToast={showToast} />
              </motion.div>
            )}

          </AnimatePresence>
        )}

      </main>
    </div>
  );
}


// ============================================================
// CAKE CRUD MANAGER SUB SECTION
// ============================================================
function CakeCrudManager({ cakes, categories, settings, onRefresh, showToast }: { cakes: Cake[]; categories: Category[]; settings: any; onRefresh: () => void; showToast: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [targetCake, setTargetCake] = useState<Partial<Cake> | null>(null);
  
  // Image list builder
  const [uploadedImages, setUploadedImages] = useState<CakeImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);

  const handleEditClick = (cake: Cake | null) => {
    if (cake) {
      setTargetCake(cake);
      setUploadedImages(cake.images || []);
    } else {
      setTargetCake({
        name: '',
        slug: '',
        description: '',
        price: 35.00,
        categoryId: categories[0]?.id || '',
        flavor: 'Vanilla & Raspberries',
        weights: ['1.0kg', '2.0kg'],
        images: [],
        featured: false,
        bestseller: false,
        available: true,
        rating: 5.0
      });
      setUploadedImages([]);
    }
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadProgress(true);
      try {
        const provider = settings?.activeImageProvider || 'imgbb';
        const uploaded = await uploadImage(e.target.files[0], provider);
        setUploadedImages([...uploadedImages, uploaded]);
        showToast('Cake image uploaded successfully! 📸', 'success');
      } catch (err) {
        showToast('Upload failed', 'error');
      } finally {
        setUploadProgress(false);
      }
    }
  };

  const handleDeleteUploadedImage = (url: string) => {
    setUploadedImages(uploadedImages.filter(img => img.url !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCake) return;

    if (!targetCake.name || !targetCake.slug || !targetCake.categoryId) {
      showToast('Name, Slug, and Category are required! 🎂', 'error');
      return;
    }

    const payload = {
      ...targetCake,
      images: uploadedImages
    } as Omit<Cake, 'id' | 'createdAt' | 'updatedAt'>;

    try {
      if (targetCake.id) {
        await updateCake(targetCake.id, payload);
        showToast('Cake updated successfully! 🌸', 'success');
      } else {
        await createCake(payload);
        showToast('New cake created! ✨', 'success');
      }
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      showToast('CRUD operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this cake? 🥺 This cannot be undone.')) {
      await deleteCake(id);
      showToast('Cake deleted', 'info');
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl font-bold text-[#4B4453] dark:text-white">Cake Catalog Operations</h2>
        {!isEditing && (
          <button 
            onClick={() => handleEditClick(null)}
            className="flex items-center space-x-1 rounded-xl bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white px-4 py-2.5 text-xs font-bold shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Cake</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing && targetCake ? (
          <motion.form 
            key="edit-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5"
          >
            <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white">
              {targetCake.id ? 'Edit Cake Listing' : 'Create New Cake Listing'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Cake Name *</label>
                <input 
                  type="text" 
                  required
                  value={targetCake.name || ''}
                  onChange={(e) => {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setTargetCake({ ...targetCake, name: e.target.value, slug });
                  }}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Slug (Auto-generated) *</label>
                <input 
                  type="text" 
                  required
                  value={targetCake.slug || ''}
                  onChange={(e) => setTargetCake({ ...targetCake, slug: e.target.value })}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase font-body">Price *</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={targetCake.price || 0}
                  onChange={(e) => setTargetCake({ ...targetCake, price: Number(e.target.value) })}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Original/Old Price (Optional)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={targetCake.oldPrice || ''}
                  onChange={(e) => setTargetCake({ ...targetCake, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Category *</label>
                <select
                  value={targetCake.categoryId || ''}
                  onChange={(e) => setTargetCake({ ...targetCake, categoryId: e.target.value })}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Signature Flavor *</label>
                <input 
                  type="text" 
                  required
                  value={targetCake.flavor || ''}
                  onChange={(e) => setTargetCake({ ...targetCake, flavor: e.target.value })}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Available Weights (Comma separated)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 0.5kg, 1.0kg, 2.0kg"
                  value={targetCake.weights?.join(', ') || ''}
                  onChange={(e) => setTargetCake({ ...targetCake, weights: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#F78FB3] uppercase">Cake Description *</label>
              <textarea 
                rows={3}
                required
                value={targetCake.description || ''}
                onChange={(e) => setTargetCake({ ...targetCake, description: e.target.value })}
                className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Toggle features */}
            <div className="flex flex-wrap gap-6 text-xs font-bold text-zinc-600 dark:text-zinc-300">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!targetCake.featured}
                  onChange={(e) => setTargetCake({ ...targetCake, featured: e.target.checked })}
                  className="accent-[#F78FB3]"
                />
                <span>Featured Cake on Home</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!targetCake.bestseller}
                  onChange={(e) => setTargetCake({ ...targetCake, bestseller: e.target.checked })}
                  className="accent-[#F78FB3]"
                />
                <span>Best Seller flag</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!targetCake.available}
                  onChange={(e) => setTargetCake({ ...targetCake, available: e.target.checked })}
                  className="accent-[#F78FB3]"
                />
                <span>In Stock & Available</span>
              </label>
            </div>

            {/* Uploaded Cake Images management */}
            <div className="space-y-3 pt-3 border-t border-pink-50 dark:border-zinc-800">
              <label className="block text-xs font-bold text-[#F78FB3] uppercase">Cake Images</label>
              
              <div className="flex flex-wrap gap-3">
                {uploadedImages.map((img) => (
                  <div key={img.url} className="relative w-16 h-16 rounded-xl overflow-hidden bg-pink-100 border">
                    <img src={img.url} alt="Cake thumb" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => handleDeleteUploadedImage(img.url)}
                      className="absolute -top-1 -right-1 bg-red-500 rounded-full text-white text-[9px] p-0.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                
                <div className="relative w-16 h-16 rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center text-[#F78FB3] bg-pink-50/10">
                  <input type="file" id="cake-img-loader" className="hidden" onChange={handleFileUpload} />
                  <label htmlFor="cake-img-loader" className="cursor-pointer text-center">
                    {uploadProgress ? '...' : <Plus className="h-5 w-5 mx-auto" />}
                  </label>
                </div>
              </div>
            </div>

            {/* Action controls */}
            <div className="flex space-x-3 pt-4 border-t border-pink-50 dark:border-zinc-800">
              <button 
                type="submit" 
                className="rounded-xl bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white font-bold text-xs px-6 py-2.5 cursor-pointer shadow-sm"
              >
                Save Cake
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold text-xs px-6 py-2.5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cakes.map((cake) => {
              const mainImg = cake.images[0]?.url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300';
              return (
                <div 
                  key={cake.id} 
                  className="bg-white dark:bg-[#241F23] rounded-3xl p-4 border border-pink-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-full"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-pink-100">
                      <img src={mainImg} alt={cake.name} className="w-full h-full object-cover" />
                      {!cake.available && <span className="absolute top-2 left-2 rounded-full bg-zinc-800 text-white text-[8px] font-bold px-2 py-0.5 uppercase">Sold Out</span>}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#4B4453] dark:text-white truncate">{cake.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-semibold">{cake.flavor}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-pink-50/50 mt-4 text-xs font-bold">
                    <span className="text-[#F78FB3] font-display text-sm font-black">{settings?.currency || '£'}{cake.price.toFixed(2)}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditClick(cake)}
                        className="text-blue-500 hover:underline flex items-center space-x-0.5"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(cake.id)}
                        className="text-red-500 hover:underline flex items-center space-x-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}


// ============================================================
// CATEGORY CRUD MANAGER SUB SECTION
// ============================================================
function CategoryCrudManager({ categories, onRefresh, showToast }: { categories: Category[]; onRefresh: () => void; showToast: any }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    try {
      if (isEditingId) {
        await updateCategory(isEditingId, { name, slug, description, image });
        showToast('Category updated!', 'success');
      } else {
        await createCategory({ name, slug, description, image, active: true });
        showToast('Category created!', 'success');
      }
      setName('');
      setDescription('');
      setImage('');
      setIsEditingId(null);
      onRefresh();
    } catch (e) {
      showToast('Action failed', 'error');
    }
  };

  const handleEditClick = (cat: Category) => {
    setIsEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image || '');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this category? 🥺')) {
      await deleteCategory(id);
      showToast('Category deleted', 'info');
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* CRUD Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white">
          {isEditingId ? 'Edit Category' : 'Create New Category'}
        </h3>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Category Name *</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase font-body">Image URL (Unsplash/ImgBB)</label>
          <input 
            type="text" 
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Description</label>
          <textarea 
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="flex space-x-2 pt-2">
          <button type="submit" className="flex-1 rounded-xl bg-[#F78FB3] text-white text-xs font-bold py-2.5 cursor-pointer">
            {isEditingId ? 'Update' : 'Create'}
          </button>
          {isEditingId && (
            <button 
              type="button" 
              onClick={() => { setIsEditingId(null); setName(''); setDescription(''); setImage(''); }}
              className="rounded-xl bg-zinc-100 text-zinc-500 text-xs font-bold px-4 py-2.5 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Categories List */}
      <div className="lg:col-span-2 bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white uppercase tracking-wider">Active Categories</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex justify-between items-center p-3 border border-pink-50/50 rounded-2xl">
              <div>
                <h4 className="font-bold text-xs text-[#4B4453] dark:text-zinc-200">{cat.name}</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{cat.description}</p>
              </div>
              <div className="flex space-x-2 text-xs font-bold">
                <button onClick={() => handleEditClick(cat)} className="text-[#F78FB3]">Edit</button>
                <button onClick={() => handleDelete(cat.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// ORDERS DISPATCH STATUS MANAGER
// ============================================================
function OrdersConsoleManager({ orders, settings, onRefresh, showToast }: { orders: Order[]; settings: any; onRefresh: () => void; showToast: any }) {
  const handleStatusChange = async (id: string, status: Order['status']) => {
    try {
      await updateOrderStatus(id, status);
      showToast('Order status updated and customer notified! ✓', 'success');
      onRefresh();
    } catch (e) {
      showToast('Failed to update order status', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-6">
      <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white uppercase tracking-wider">Store Orders Operations</h3>
      
      <div className="space-y-6">
        {orders.map((ord) => (
          <div key={ord.id} className="p-5 border border-pink-50 dark:border-zinc-800 rounded-3xl space-y-4 bg-pink-50/5 dark:bg-[#1A1618]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
              <div>
                <span className="font-mono text-[#F78FB3] font-bold text-sm block">{ord.orderNumber}</span>
                <span className="text-[10px] text-zinc-400 font-semibold">{ord.customerName} ({ord.phone})</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold text-left sm:text-right">Delivery Schedule</span>
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{ord.deliveryDate} @ {ord.deliveryTime}</span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-zinc-400 block font-bold">Total price</span>
                <span className="font-display font-black text-sm text-[#F78FB3]">{settings?.currency || '£'}{ord.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-2 text-xs">
              {ord.items.map((i, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>{i.cakeName} ({i.weight}, {i.flavor}) x{i.quantity}</span>
                  <span className="font-bold">{settings?.currency || '£'}{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Render reference design image if uploaded */}
            {ord.referenceImage && (
              <div className="pt-2 border-t border-dashed">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Customer Reference Image</span>
                <a href={ord.referenceImage} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1.5 text-[10px] text-blue-500 hover:underline mt-1 font-bold">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>View Pinned Design Diagram</span>
                </a>
              </div>
            )}

            {/* Message / instruction notes */}
            {ord.specialMessage && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-zinc-800 text-[11px] text-amber-800 dark:text-amber-200">
                <strong>Instruction Note:</strong> "{ord.specialMessage}"
              </div>
            )}

            {/* Dropdown status selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-2">
              <span className="text-xs font-bold text-zinc-500">Current Status: <strong className="text-[#F78FB3]">{ord.status}</strong></span>
              
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-extrabold text-zinc-400">Change Status</span>
                <select
                  value={ord.status}
                  onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                  className="rounded-xl border border-pink-100 dark:border-zinc-800 p-1.5 text-xs font-bold dark:bg-zinc-800 dark:text-white cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================================
// GALLERY CONSOLE MANAGER
// ============================================================
function GalleryConsoleManager({ gallery, settings, onRefresh, showToast }: { gallery: GalleryItem[]; settings: any; onRefresh: () => void; showToast: any }) {
  const [cat, setCat] = useState<GalleryItem['category']>('Birthday');
  const [uploadProgress, setUploadProgress] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadProgress(true);
      try {
        const provider = settings?.activeImageProvider || 'imgbb';
        const uploaded = await uploadImage(e.target.files[0], provider);
        
        await addGalleryImage({
          url: uploaded.url,
          provider: uploaded.provider,
          fileId: uploaded.fileId,
          fileName: uploaded.fileName,
          category: cat,
          featured: false
        });

        showToast('Image added to gallery database! ✓', 'success');
        onRefresh();
      } catch (err) {
        showToast('Upload failed', 'error');
      } finally {
        setUploadProgress(false);
      }
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (window.confirm('Delete this gallery image? 🥺')) {
      await deleteGalleryImage(item.id);
      // Programmatically delete from provider if ImageKit fileId exists
      if (item.fileId && item.provider === 'imagekit') {
        await deleteImage({ url: item.url, provider: item.provider, fileId: item.fileId, uploadedAt: item.uploadedAt });
      }
      showToast('Image deleted', 'info');
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Upload trigger */}
      <div className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white">Curate Gallery Artwork</h3>
        
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Gallery Album</label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value as any)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          >
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Bento">Bento</option>
            <option value="Custom">Custom</option>
            <option value="Special">Special</option>
            <option value="Behind the Scenes">Behind the Scenes</option>
          </select>
        </div>

        <div className="relative border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center text-[#F78FB3] bg-pink-50/10">
          <input type="file" id="gal-loader" className="hidden" onChange={handleUpload} />
          <label htmlFor="gal-loader" className="cursor-pointer space-y-1">
            <Upload className="h-6 w-6 mx-auto" />
            <p className="text-xs font-bold">{uploadProgress ? 'Curating Image...' : 'Click to Upload Image'}</p>
          </label>
        </div>
      </div>

      {/* Image previews */}
      <div className="lg:col-span-2 bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white uppercase tracking-wider">Live Gallery Curator</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {gallery.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden border">
              <img src={item.url} alt="Gallery view" className="w-full h-full object-cover" />
              <div className="absolute top-1 left-1 bg-pink-50/90 text-[#F78FB3] text-[8px] font-bold px-1.5 py-0.5 rounded-full">{item.category}</div>
              <button 
                onClick={() => handleDelete(item)}
                className="absolute top-1 right-1 bg-red-500 rounded-full text-white text-[9px] p-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// REVIEWS CONSOLE MANAGER
// ============================================================
function ReviewsConsoleManager({ reviews, onRefresh, showToast }: { reviews: Review[]; onRefresh: () => void; showToast: any }) {
  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    await updateReviewStatus(id, { approved: !currentStatus });
    showToast('Review status updated!', 'success');
    onRefresh();
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    await updateReviewStatus(id, { featured: !currentStatus });
    showToast('Review featured status updated!', 'success');
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this review? 🥺')) {
      await deleteReview(id);
      showToast('Review deleted', 'info');
      onRefresh();
    }
  };

  return (
    <div className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-4">
      <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white uppercase tracking-wider">Customer Reviews Moderation</h3>
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-4 border border-pink-50 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-yellow-500">
                {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                <span className="text-zinc-400 text-xs font-bold ml-1">({rev.rating})</span>
              </div>
              <p className="text-xs italic text-[#4B4453] dark:text-zinc-300">"{rev.reviewText}"</p>
              <p className="text-[10px] text-zinc-400 font-bold">— {rev.customerName}</p>
            </div>

            {/* Moderation Controls */}
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <button 
                onClick={() => handleToggleApproval(rev.id, rev.approved)}
                className={`px-3 py-1.5 rounded-xl cursor-pointer ${rev.approved ? 'bg-green-50 text-green-600' : 'bg-pink-50 text-[#F78FB3]'}`}
              >
                {rev.approved ? 'Approved ✓' : 'Approve'}
              </button>
              <button 
                onClick={() => handleToggleFeatured(rev.id, rev.featured)}
                className={`px-3 py-1.5 rounded-xl cursor-pointer ${rev.featured ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-500'}`}
              >
                {rev.featured ? 'Featured ⭐' : 'Feature on Home'}
              </button>
              <button 
                onClick={() => handleDelete(rev.id)}
                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-500 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================================
// OFFERS & COUPONS MANAGER
// ============================================================
function OffersConsoleManager({ offers, onRefresh, showToast }: { offers: Offer[]; onRefresh: () => void; showToast: any }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    const payload = {
      title,
      description,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      active: true
    };

    try {
      if (isEditingId) {
        await updateOffer(isEditingId, payload);
        showToast('Offer updated!', 'success');
      } else {
        await addOffer(payload);
        showToast('New coupon code created!', 'success');
      }
      setTitle('');
      setDescription('');
      setCode('');
      setIsEditingId(null);
      onRefresh();
    } catch (err) {
      showToast('Operation failed', 'error');
    }
  };

  const handleEdit = (o: Offer) => {
    setIsEditingId(o.id);
    setTitle(o.title);
    setDescription(o.description);
    setCode(o.code);
    setDiscountType(o.discountType);
    setDiscountValue(o.discountValue);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this coupon campaign? 🥺')) {
      await deleteOffer(id);
      showToast('Offer deleted', 'info');
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* CRUD Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white">
          {isEditingId ? 'Edit Promo Campaign' : 'Create New Coupon'}
        </h3>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Campaign Title *</label>
          <input 
            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase font-mono">Promo Code *</label>
          <input 
            type="text" required placeholder="e.g. SPECIAL20" value={code} onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white uppercase font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#F78FB3] uppercase">Type</label>
            <select
              value={discountType} onChange={(e) => setDiscountType(e.target.value as any)}
              className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (£)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#F78FB3] uppercase font-body">Value</label>
            <input 
              type="number" required value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Description</label>
          <textarea 
            rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="flex space-x-2 pt-2">
          <button type="submit" className="flex-1 rounded-xl bg-[#F78FB3] text-white text-xs font-bold py-2.5 cursor-pointer">
            {isEditingId ? 'Update' : 'Create'}
          </button>
          {isEditingId && (
            <button 
              type="button" onClick={() => { setIsEditingId(null); setTitle(''); setDescription(''); setCode(''); }}
              className="rounded-xl bg-zinc-100 text-zinc-500 text-xs font-bold px-4 py-2.5 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Offers list */}
      <div className="lg:col-span-2 bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white uppercase tracking-wider">Active Campaigns</h3>
        <div className="space-y-3">
          {offers.map((off) => (
            <div key={off.id} className="flex justify-between items-center p-3.5 border border-pink-50/50 rounded-2xl bg-pink-50/5">
              <div>
                <h4 className="font-bold text-xs text-[#4B4453] dark:text-zinc-200">{off.title} <span className="font-mono text-[#F78FB3] ml-2">({off.code})</span></h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">{off.description}</p>
                <p className="text-[9px] text-[#F78FB3] font-bold mt-1">Discount: {off.discountType === 'percentage' ? `${off.discountValue}%` : `£${off.discountValue.toFixed(2)}`}</p>
              </div>
              <div className="flex space-x-2 text-xs font-bold">
                <button onClick={() => handleEdit(off)} className="text-[#F78FB3]">Edit</button>
                <button onClick={() => handleDelete(off.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// FAQS CONSOLE MANAGER
// ============================================================
function FAQConsoleManager({ faqs, onRefresh, showToast }: { faqs: FAQ[]; onRefresh: () => void; showToast: any }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Ordering');
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;

    try {
      if (isEditingId) {
        await updateFAQ(isEditingId, { question, answer, category });
        showToast('FAQ updated!', 'success');
      } else {
        await addFAQ({ question, answer, category });
        showToast('New FAQ added!', 'success');
      }
      setQuestion('');
      setAnswer('');
      setIsEditingId(null);
      onRefresh();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleEdit = (f: FAQ) => {
    setIsEditingId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete FAQ? 🥺')) {
      await deleteFAQ(id);
      showToast('FAQ deleted', 'info');
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white">
          {isEditingId ? 'Edit FAQ Item' : 'Create New FAQ'}
        </h3>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Question *</label>
          <input 
            type="text" required value={question} onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">FAQ Category</label>
          <select
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          >
            <option value="Ordering">Ordering</option>
            <option value="Dietary Requirements">Dietary Requirements</option>
            <option value="Storage">Storage</option>
            <option value="Cake Information">Cake Information</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Answer *</label>
          <textarea 
            rows={3} required value={answer} onChange={(e) => setAnswer(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="flex space-x-2 pt-2">
          <button type="submit" className="flex-1 rounded-xl bg-[#F78FB3] text-white text-xs font-bold py-2.5 cursor-pointer">
            {isEditingId ? 'Update' : 'Create'}
          </button>
          {isEditingId && (
            <button 
              type="button" onClick={() => { setIsEditingId(null); setQuestion(''); setAnswer(''); }}
              className="rounded-xl bg-zinc-100 text-zinc-500 text-xs font-bold px-4 py-2.5 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* FAQs List */}
      <div className="lg:col-span-2 bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-6 rounded-[32px] shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white uppercase tracking-wider">Live FAQs List</h3>
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="p-3.5 border border-pink-50/50 rounded-2xl bg-pink-50/5">
              <div>
                <h4 className="font-bold text-xs text-[#4B4453] dark:text-zinc-200">{f.question}</h4>
                <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{f.answer}</p>
                <span className="inline-block bg-pink-100/70 text-[#F78FB3] text-[8px] font-bold px-2 py-0.5 rounded-full mt-2 uppercase">{f.category}</span>
              </div>
              <div className="flex justify-end space-x-2 text-xs font-bold border-t border-dashed mt-2 pt-2">
                <button onClick={() => handleEdit(f)} className="text-[#F78FB3]">Edit</button>
                <button onClick={() => handleDelete(f.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// BUSINESS SETTINGS MANAGER & IMAGE STORAGE SWITCHER (SBT Configs)
// ============================================================
function SettingsConsoleManager({ settings, onRefresh, showToast }: { settings: any; onRefresh: () => void; showToast: any }) {
  const [bizName, setBizName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(5.00);
  const [provider, setProvider] = useState<'imagekit' | 'imgbb'>('imgbb');
  const [saving, setSaving] = useState(false);

  // Sync state
  useEffect(() => {
    if (settings) {
      setBizName(settings.businessName || 'Sweet by Tani');
      setTagline(settings.tagline || 'Freshly Baked with Love 🩷');
      setPhone(settings.phone || '');
      setWhatsapp(settings.whatsappNumber || '');
      setEmail(settings.email || '');
      setAddress(settings.address || '');
      setDeliveryFee(settings.deliveryCharge || 5);
      setProvider(settings.activeImageProvider || 'imgbb');
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBusinessSettings({
        businessName: bizName,
        tagline,
        phone,
        whatsappNumber: whatsapp,
        email,
        address,
        deliveryCharge: deliveryFee,
        activeImageProvider: provider
      });
      showToast('Settings saved to Firestore! ⚙️', 'success');
      onRefresh();
    } catch (e) {
      showToast('Could not save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 p-8 rounded-[32px] shadow-sm space-y-6 max-w-2xl">
      <h3 className="font-display text-xl font-bold text-[#4B4453] dark:text-white flex items-center">
        <Settings className="h-5 w-5 text-[#F78FB3] mr-2" />
        Business Settings & Integrations
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Business Brand Name</label>
          <input 
            type="text" required value={bizName} onChange={(e) => setBizName(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Brand Tagline</label>
          <input 
            type="text" required value={tagline} onChange={(e) => setTagline(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Business Contact Phone</label>
          <input 
            type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase font-mono">WhatsApp Number (e.g. 447123456789)</label>
          <input 
            type="text" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Customer Support Email</label>
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#F78FB3] uppercase">Delivery Base Charge (£)</label>
          <input 
            type="number" step="0.01" required value={deliveryFee} onChange={(e) => setDeliveryFee(Number(e.target.value))}
            className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-bold text-[#F78FB3] uppercase">Physical Kitchen Address</label>
        <input 
          type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white"
        />
      </div>

      {/* Centralized Image Provider Switcher (P & Q compliance) */}
      <div className="p-5 border border-dashed border-pink-300 dark:border-zinc-700 rounded-3xl space-y-4 bg-pink-50/5">
        <div>
          <span className="text-[10px] font-bold text-[#F78FB3] uppercase tracking-widest block">Core Image Hosting Provider Switcher</span>
          <h4 className="font-display font-bold text-sm text-[#4B4453] dark:text-white mt-1">Select Active Uploader Target</h4>
          <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
            Switching provider dictates where <strong>NEW</strong> uploads are stored (ImageKit or ImgBB). 
            Existing image URLs remain active on their original networks; no database entries are broken.
          </p>
        </div>

        <div className="flex gap-4">
          {[
            { id: 'imgbb', label: 'ImgBB Public Storage' },
            { id: 'imagekit', label: 'ImageKit Private CDN' }
          ].map((prov) => {
            const active = provider === prov.id;
            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => setProvider(prov.id as any)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  active
                    ? 'bg-[#F78FB3] text-white shadow-md'
                    : 'bg-white border border-pink-100 dark:bg-zinc-800 dark:border-zinc-750 dark:text-zinc-300'
                }`}
              >
                {prov.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white font-bold text-xs py-3.5 shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
      >
        {saving ? 'Saving Config...' : 'Apply Business Modifications 🌸'}
      </button>
    </form>
  );
}
