import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { 
  UserProfile, 
  OrderItem, 
  Cake, 
  BusinessSettings, 
  Notification 
} from '../types';
import { getBusinessSettings, getUserProfile, createUserProfile, seedDatabaseIfNeeded } from '../lib/services/db';

/**
 * Translates Firebase Auth error codes into clear, beautifully friendly, 
 * and actionable instructions for the user (specifically guiding on new project setups).
 */
function formatAuthError(error: any): string {
  if (!error) return 'Authentication failed';
  const code = error.code || '';
  const message = error.message || '';

  if (code === 'auth/invalid-credential' || message.includes('invalid-credential')) {
    return 'Incorrect email/password. Note: If this is a new Firebase project, please ensure the "Email/Password" sign-in provider is enabled in your Firebase Console under Authentication > Sign-in Method! 🐻‍❄️';
  }
  if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
    return 'Email/Password sign-in is disabled. Please go to your Firebase Console > Authentication > Sign-in Method and enable "Email/Password" to allow user logins! 🌸';
  }
  if (code === 'auth/email-already-in-use' || message.includes('email-already-in-use')) {
    return 'This email address is already registered. Try logging in instead! 🎀';
  }
  if (code === 'auth/weak-password' || message.includes('weak-password')) {
    return 'Your password is too weak. Please use a password of at least 6 characters! 🔑';
  }
  if (code === 'auth/invalid-email' || message.includes('invalid-email')) {
    return 'Please check your email formatting and try again! ✉️';
  }
  if (code === 'auth/too-many-requests' || message.includes('too-many-requests')) {
    return 'Too many failed login attempts. This account is temporarily locked. Please try again shortly! ⏳';
  }
  return error.message || 'Authentication error occurred';
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Auth
  user: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Cart
  cart: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (cakeId: string, weight: string, flavor: string) => void;
  updateCartQuantity: (cakeId: string, weight: string, flavor: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  appliedDiscount: number;
  applyCoupon: (code: string, discountType: 'percentage' | 'fixed', value: number) => boolean;
  couponCode: string;

  // Favorites
  favorites: string[]; // cakeIds
  toggleFavorite: (cakeId: string) => Promise<void>;
  isFavorite: (cakeId: string) => boolean;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Business Settings
  settings: BusinessSettings | null;
  refreshSettings: () => Promise<void>;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Navigation
  currentPage: string;
  navigateTo: (page: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState<OrderItem[]>(() => {
    const local = localStorage.getItem('sbt_cart');
    return local ? JSON.parse(local) : [];
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const local = localStorage.getItem('sbt_favorites');
    return local ? JSON.parse(local) : [];
  });

  // Theme State
  const isDarkMode = false;
  const toggleTheme = () => {};

  // Business Settings Cache
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Simple Client Router State
  const [currentPage, setCurrentPage] = useState('home');

  // Load Settings and Seed DB on mount
  useEffect(() => {
    async function initApp() {
      // Seed if empty (extremely useful for immediate visual pleasure)
      await seedDatabaseIfNeeded();
      
      const bizSettings = await getBusinessSettings();
      setSettings(bizSettings);
    }
    initApp();
  }, []);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('sbt_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Favorites to LocalStorage (for guest fallback)
  useEffect(() => {
    localStorage.setItem('sbt_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Apply Dark Mode Class to HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    localStorage.setItem('sbt_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Sync user profile from Firestore
          let profile = await getUserProfile(firebaseUser.uid);
          
          if (!profile) {
            // If profile doesn't exist yet, create it
            profile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Sweet Customer',
              email: firebaseUser.email || '',
              role: firebaseUser.email === 'admin@sweetbytani.com' ? 'admin' : 'customer',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await createUserProfile(profile);
          }
          setUserProfile(profile);
        } catch (profileErr: any) {
          console.warn('Could not sync online user profile (client offline), using local fallback profile:', profileErr);
          // High quality in-memory local fallback profile so checkout & navigation don't freeze or crash
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Sweet Customer',
            email: firebaseUser.email || '',
            role: firebaseUser.email === 'admin@sweetbytani.com' ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setUserProfile(fallbackProfile);
        }

        // SYNC GUEST FAVORITES WITH FIRESTORE
        const guestFavs = JSON.parse(localStorage.getItem('sbt_favorites') || '[]');
        if (guestFavs.length > 0) {
          try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            // Fetch profile again or use current list
            const currentProfileSnap = await getDoc(userRef);
            const currentProfileData = currentProfileSnap.data();
            const currentFavs = currentProfileData?.favorites || [];
            
            // Merge unique
            const mergedFavs = Array.from(new Set([...currentFavs, ...guestFavs]));
            await updateDoc(userRef, { favorites: mergedFavs });
            setFavorites(mergedFavs);
            localStorage.removeItem('sbt_favorites'); // clear guest favorites now that they are synced
            showToast('Merged your favorites list successfully! 💖', 'success');
          } catch (e) {
            console.error('Error merging favorites:', e);
          }
        } else {
          // Just load user's existing favorites from Firestore
          try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(userRef);
            if (snap.exists() && snap.data().favorites) {
              setFavorites(snap.data().favorites);
            }
          } catch (e) {
            console.error('Error loading favorites:', e);
          }
        }

      } else {
        setUserProfile(null);
        // Load favorites from local storage
        const localFavs = localStorage.getItem('sbt_favorites');
        setFavorites(localFavs ? JSON.parse(localFavs) : []);
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // AUTH ACTIONS
  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Welcome back! 🌸', 'success');
    } catch (e: any) {
      showToast(formatAuthError(e), 'error');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    setAuthLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const profile: UserProfile = {
        uid: cred.user.uid,
        name,
        email,
        role: email === 'admin@sweetbytani.com' ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await createUserProfile(profile);
      setUserProfile(profile);
      showToast('Account created successfully! 🎀', 'success');
    } catch (e: any) {
      showToast(formatAuthError(e), 'error');
      throw e;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    showToast('Goodbye! Hope to bake for you again soon! 🐻‍❄️', 'success');
    setCurrentPage('home');
  };

  // Quick Demo Admin Login Action for AI Studio review/testing ease


  // CART ACTIONS
  const addToCart = (item: OrderItem) => {
    setCart((prev) => {
      // Match by cakeId, weight and flavor
      const existingIdx = prev.findIndex(
        (i) => i.cakeId === item.cakeId && i.weight === item.weight && i.flavor === item.flavor
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    showToast(`${item.cakeName} added to your cart! 🎂`, 'success');
  };

  const removeFromCart = (cakeId: string, weight: string, flavor: string) => {
    setCart((prev) => prev.filter((i) => !(i.cakeId === cakeId && i.weight === weight && i.flavor === flavor)));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cakeId: string, weight: string, flavor: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cakeId, weight, flavor);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.cakeId === cakeId && i.weight === weight && i.flavor === flavor ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string, discountType: 'percentage' | 'fixed', value: number): boolean => {
    setCouponCode(code);
    if (discountType === 'percentage') {
      const discount = (cartSubtotal * value) / 100;
      setCouponDiscount(discount);
    } else {
      setCouponDiscount(Math.min(cartSubtotal, value));
    }
    showToast(`Promo code '${code}' applied! 🎉`, 'success');
    return true;
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = settings ? settings.deliveryCharge : 5;
  const appliedDiscount = couponDiscount;
  const cartTotal = Math.max(0, cartSubtotal + deliveryCharge - appliedDiscount);

  // FAVORITES ACTIONS
  const toggleFavorite = async (cakeId: string) => {
    const isFav = favorites.includes(cakeId);
    let updated: string[];

    if (isFav) {
      updated = favorites.filter((id) => id !== cakeId);
      showToast('Removed from favorites 🤍', 'info');
    } else {
      updated = [...favorites, cakeId];
      showToast('Added to favorites! 💖', 'success');
    }
    setFavorites(updated);

    // If logged in, update Firestore
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          favorites: isFav ? arrayRemove(cakeId) : arrayUnion(cakeId)
        });
      } catch (e) {
        console.error('Error saving favorite to Firestore:', e);
      }
    }
  };

  const isFavorite = (cakeId: string) => favorites.includes(cakeId);

  // REFRESH SETTINGS
  const refreshSettings = async () => {
    const bizSettings = await getBusinessSettings();
    setSettings(bizSettings);
  };

  // TOAST ACTIONS
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // SIMPLE ROUTER CLIENT NAVIGATOR
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        userProfile,
        authLoading,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        appliedDiscount,
        applyCoupon,
        couponCode,
        favorites,
        toggleFavorite,
        isFavorite,
        isDarkMode,
        toggleTheme,
        settings,
        refreshSettings,
        toasts,
        showToast,
        removeToast,
        currentPage,
        navigateTo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
