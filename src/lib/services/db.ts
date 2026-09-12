import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Cake, 
  Order, 
  Category, 
  GalleryItem, 
  Review, 
  FAQ, 
  Offer, 
  BusinessSettings,
  Notification,
  UserProfile
} from '../../types';

// Helper: collection references
const cakesCol = () => collection(db, 'cakes');
const categoriesCol = () => collection(db, 'categories');
const ordersCol = () => collection(db, 'orders');
const galleryCol = () => collection(db, 'gallery');
const reviewsCol = () => collection(db, 'reviews');
const faqsCol = () => collection(db, 'faqs');
const offersCol = () => collection(db, 'offers');
const settingsCol = () => collection(db, 'settings');
const notificationsCol = () => collection(db, 'notifications');
const usersCol = () => collection(db, 'users');

// ============================================================
// A. USER PROFILE SERVICES
// ============================================================
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  try {
    const docRef = doc(db, 'users', profile.uid);
    await setDoc(docRef, profile);
  } catch (e) {
    console.error('Error creating user profile:', e);
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { ...data, updatedAt: new Date().toISOString() });
  } catch (e) {
    console.error('Error updating user profile:', e);
  }
}

export async function getCustomers(): Promise<UserProfile[]> {
  try {
    const q = query(usersCol(), where('role', '==', 'customer'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as UserProfile);
  } catch (e) {
    console.error('Error fetching customers:', e);
    return [];
  }
}


// ============================================================
// B. CAKES SERVICES
// ============================================================
export async function getCakes(): Promise<Cake[]> {
  try {
    const snap = await getDocs(cakesCol());
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Cake);
  } catch (e) {
    console.error('Error fetching cakes:', e);
    return [];
  }
}

export async function getCake(id: string): Promise<Cake | null> {
  try {
    const docRef = doc(db, 'cakes', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Cake;
    }
    // Try finding by slug
    const q = query(cakesCol(), where('slug', '==', id));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return { id: querySnap.docs[0].id, ...querySnap.docs[0].data() } as Cake;
    }
    return null;
  } catch (e) {
    console.error('Error fetching cake:', e);
    return null;
  }
}

export async function createCake(cake: Omit<Cake, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const newCake = {
      ...cake,
      createdAt: now,
      updatedAt: now
    };
    const docRef = await addDoc(cakesCol(), newCake);
    return docRef.id;
  } catch (e) {
    console.error('Error creating cake:', e);
    throw e;
  }
}

export async function updateCake(id: string, data: Partial<Cake>): Promise<void> {
  try {
    const docRef = doc(db, 'cakes', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error updating cake:', e);
    throw e;
  }
}

export async function deleteCake(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'cakes', id));
  } catch (e) {
    console.error('Error deleting cake:', e);
    throw e;
  }
}


// ============================================================
// C. CATEGORIES SERVICES
// ============================================================
export async function getCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(categoriesCol());
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Category);
  } catch (e) {
    console.error('Error fetching categories:', e);
    return [];
  }
}

export async function createCategory(cat: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const newCat = {
      ...cat,
      createdAt: now,
      updatedAt: now
    };
    const docRef = await addDoc(categoriesCol(), newCat);
    return docRef.id;
  } catch (e) {
    console.error('Error creating category:', e);
    throw e;
  }
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  try {
    await updateDoc(doc(db, 'categories', id), {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error updating category:', e);
    throw e;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (e) {
    console.error('Error deleting category:', e);
    throw e;
  }
}


// ============================================================
// D. ORDERS SERVICES
// ============================================================
export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(ordersCol(), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Order);
  } catch (e) {
    console.error('Error fetching orders:', e);
    return [];
  }
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const q = query(ordersCol(), where('customerId', '==', customerId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Order);
  } catch (e) {
    console.error('Error fetching customer orders:', e);
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, 'orders', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Order;
    }
    // Try finding by order number SBT-XXXX-XXXXXX
    const q = query(ordersCol(), where('orderNumber', '==', id));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return { id: querySnap.docs[0].id, ...querySnap.docs[0].data() } as Order;
    }
    return null;
  } catch (e) {
    console.error('Error fetching order:', e);
    return null;
  }
}

export async function createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  try {
    const now = new Date().toISOString();
    
    // Generate order number SBT-YYYY-XXXXXX
    const year = new Date().getFullYear();
    const countSnap = await getDocs(ordersCol());
    const orderIndex = String(countSnap.size + 1).padStart(6, '0');
    const orderNumber = `SBT-${year}-${orderIndex}`;

    const newOrder: Omit<Order, 'id'> = {
      ...order,
      orderNumber,
      createdAt: now,
      updatedAt: now
    };

    const docRef = await addDoc(ordersCol(), newOrder);
    
    // Trigger internal notification for Admin
    await createNotification({
      title: 'New Order Received! 🎂',
      body: `Order ${orderNumber} placed by ${order.customerName} for ${order.total} ${order.items[0]?.cakeName ? '(' + order.items[0].cakeName + ')' : ''}`,
      orderId: docRef.id,
      read: false,
      createdAt: now
    });

    return { id: docRef.id, ...newOrder } as Order;
  } catch (e) {
    console.error('Error creating order:', e);
    throw e;
  }
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'orders', id), {
      status,
      updatedAt: now
    });

    const order = await getOrder(id);
    if (order && order.customerId) {
      // Notify customer of order status updates
      let statusEmoji = '✨';
      if (status === 'Confirmed') statusEmoji = '💖';
      if (status === 'Preparing') statusEmoji = '👩‍🍳';
      if (status === 'Ready') statusEmoji = '🎂';
      if (status === 'Out for Delivery') statusEmoji = '🚚';
      if (status === 'Completed') statusEmoji = '🎉';
      if (status === 'Cancelled') statusEmoji = '😢';

      await createNotification({
        userId: order.customerId,
        title: `Order Update! ${statusEmoji}`,
        body: `Your Sweet by Tani order ${order.orderNumber} is now: ${status}!`,
        orderId: id,
        read: false,
        createdAt: now
      });
    }
  } catch (e) {
    console.error('Error updating order status:', e);
    throw e;
  }
}


// ============================================================
// E. GALLERY SERVICES
// ============================================================
export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const snap = await getDocs(galleryCol());
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as GalleryItem);
  } catch (e) {
    console.error('Error fetching gallery:', e);
    return [];
  }
}

export async function addGalleryImage(item: Omit<GalleryItem, 'id' | 'uploadedAt'>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(galleryCol(), {
      ...item,
      uploadedAt: now
    });
    return docRef.id;
  } catch (e) {
    console.error('Error adding gallery image:', e);
    throw e;
  }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (e) {
    console.error('Error deleting gallery image:', e);
    throw e;
  }
}


// ============================================================
// F. REVIEWS SERVICES
// ============================================================
export async function getReviews(): Promise<Review[]> {
  try {
    const snap = await getDocs(reviewsCol());
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Review);
  } catch (e) {
    console.error('Error fetching reviews:', e);
    return [];
  }
}

export async function addReview(review: Omit<Review, 'id' | 'createdAt' | 'approved' | 'featured'>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(reviewsCol(), {
      ...review,
      createdAt: now,
      approved: false, // Moderated by default
      featured: false
    });
    return docRef.id;
  } catch (e) {
    console.error('Error adding review:', e);
    throw e;
  }
}

export async function updateReviewStatus(id: string, data: { approved?: boolean; featured?: boolean }): Promise<void> {
  try {
    await updateDoc(doc(db, 'reviews', id), data);
  } catch (e) {
    console.error('Error updating review status:', e);
    throw e;
  }
}

export async function deleteReview(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (e) {
    console.error('Error deleting review:', e);
    throw e;
  }
}


// ============================================================
// G. FAQ SERVICES
// ============================================================
export async function getFAQs(): Promise<FAQ[]> {
  try {
    const snap = await getDocs(faqsCol());
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as FAQ);
  } catch (e) {
    console.error('Error fetching FAQs:', e);
    return [];
  }
}

export async function addFAQ(faq: Omit<FAQ, 'id' | 'createdAt'>): Promise<string> {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(faqsCol(), { ...faq, createdAt: now });
    return docRef.id;
  } catch (e) {
    console.error('Error adding FAQ:', e);
    throw e;
  }
}

export async function updateFAQ(id: string, data: Partial<FAQ>): Promise<void> {
  try {
    await updateDoc(doc(db, 'faqs', id), data);
  } catch (e) {
    console.error('Error updating FAQ:', e);
    throw e;
  }
}

export async function deleteFAQ(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'faqs', id));
  } catch (e) {
    console.error('Error deleting FAQ:', e);
    throw e;
  }
}


// ============================================================
// H. OFFERS SERVICES
// ============================================================
export async function getOffers(): Promise<Offer[]> {
  try {
    const snap = await getDocs(offersCol());
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Offer);
  } catch (e) {
    console.error('Error fetching offers:', e);
    return [];
  }
}

export async function addOffer(offer: Omit<Offer, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(offersCol(), offer);
    return docRef.id;
  } catch (e) {
    console.error('Error adding offer:', e);
    throw e;
  }
}

export async function updateOffer(id: string, data: Partial<Offer>): Promise<void> {
  try {
    await updateDoc(doc(db, 'offers', id), data);
  } catch (e) {
    console.error('Error updating offer:', e);
    throw e;
  }
}

export async function deleteOffer(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'offers', id));
  } catch (e) {
    console.error('Error deleting offer:', e);
    throw e;
  }
}


// ============================================================
// I. BUSINESS SETTINGS SERVICES
// ============================================================
export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'Sweet by Tani',
  tagline: 'Freshly Baked with Love 🩷',
  phone: '+44 7123 456789',
  whatsappNumber: '447123456789',
  email: 'hello@sweetbytani.com',
  address: '15 Bakery Lane, London, UK',
  instagramUrl: 'https://instagram.com/sweetbytani',
  facebookUrl: 'https://facebook.com/sweetbytani',
  openingHours: 'Mon-Sat: 09:00 AM - 07:00 PM, Sun: 10:00 AM - 04:00 PM',
  deliveryInfo: 'Standard delivery takes place within London. Minimum notice 2 days prior to celebration.',
  currency: '£',
  deliveryCharge: 5.00,
  minimumOrder: 15.00,
  orderNoticeDays: 2,
  activeImageProvider: 'imgbb' // fall back to ImgBB by default
};

export async function getBusinessSettings(): Promise<BusinessSettings> {
  try {
    const docRef = doc(db, 'settings', 'business');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const settings = { ...DEFAULT_SETTINGS, ...snap.data() } as BusinessSettings;
      localStorage.setItem('sbt_business_settings', JSON.stringify(settings));
      return settings;
    } else {
      // Save default settings
      try {
        await setDoc(docRef, DEFAULT_SETTINGS);
      } catch (saveErr) {
        // Suppress write errors when offline during initial boot
      }
      localStorage.setItem('sbt_business_settings', JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
  } catch (e: any) {
    const isOffline = e?.message?.toLowerCase().includes('offline') || e?.code === 'unavailable';
    if (isOffline) {
      console.warn('Could not get business settings (client offline). Using cached settings.');
    } else {
      console.error('Error getting settings:', e);
    }
    
    try {
      const cached = localStorage.getItem('sbt_business_settings');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (cacheErr) {
      // ignore
    }
    return DEFAULT_SETTINGS;
  }
}

export async function updateBusinessSettings(data: Partial<BusinessSettings>): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'business');
    await setDoc(docRef, data, { merge: true });
  } catch (e) {
    console.error('Error updating settings:', e);
    throw e;
  }
}


// ============================================================
// J. NOTIFICATIONS SERVICES
// ============================================================
export async function getNotifications(userId?: string): Promise<Notification[]> {
  try {
    let q;
    if (userId) {
      // Customers see their custom notifications
      q = query(notificationsCol(), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    } else {
      // Admin notifications have no userId
      q = query(notificationsCol(), where('userId', '==', null), orderBy('createdAt', 'desc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Notification);
  } catch (e) {
    console.error('Error fetching notifications:', e);
    // If complex query fails due to index, fetch all notifications and filter
    try {
      const snap = await getDocs(notificationsCol());
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Notification);
      const filtered = all.filter(n => userId ? n.userId === userId : !n.userId);
      return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (err) {
      console.error('Fallback fetch notifications error:', err);
      return [];
    }
  }
}

export async function createNotification(notif: Omit<Notification, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(notificationsCol(), notif);
    return docRef.id;
  } catch (e) {
    console.error('Error creating notification:', e);
    throw e;
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  } catch (e) {
    console.error('Error marking notification read:', e);
  }
}


// ============================================================
// K. AUTOMATIC SELF-SEEDING ENGINE
// ============================================================
export async function seedDatabaseIfNeeded(): Promise<void> {
  try {
    // 1. Seed Categories if empty
    const catSnap = await getDocs(categoriesCol());
    let categoriesList: Category[] = [];

    if (catSnap.empty) {
      console.log('Seeding categories...');
      const defaultCats: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { name: 'Birthday Cakes', slug: 'birthday-cakes', description: 'Make birthdays magical with our elegant cute cakes.', active: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80' },
        { name: 'Bento Cakes', slug: 'bento-cakes', description: 'Trendy mini Korean-style lunchbox cakes, perfect for sweet messages.', active: true, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80' },
        { name: 'Anniversary Cakes', slug: 'anniversary-cakes', description: 'Celebrate love and milestones with luxury minimalist layers.', active: true, image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80' },
        { name: 'Chocolate Cakes', slug: 'chocolate-cakes', description: 'Decadent chocolate layers for deep chocolate lovers.', active: true, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80' },
        { name: 'Strawberry Cakes', slug: 'strawberry-cakes', description: 'Light, fluffy cakes whipped with real fresh British strawberries.', active: true, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80' },
        { name: 'Custom Cakes', slug: 'custom-cakes', description: 'Tailored designs, custom messages, drawings, and special figures.', active: true, image: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?w=600&auto=format&fit=crop&q=80' }
      ];

      const batch = writeBatch(db);
      for (const cat of defaultCats) {
        const id = cat.slug; // use slug as ID to make reference easier
        const docRef = doc(db, 'categories', id);
        const data = {
          ...cat,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        batch.set(docRef, data);
        categoriesList.push(data as Category);
      }
      await batch.commit();
      console.log('Categories seeded successfully!');
    } else {
      categoriesList = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Category);
    }

    // 2. Seed Cakes if empty
    const cakeSnap = await getDocs(cakesCol());
    if (cakeSnap.empty) {
      console.log('Seeding cakes...');
      
      const defaultCakes: Omit<Cake, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'Lovely Pink Bow Bento Cake',
          slug: 'lovely-pink-bow-bento',
          description: 'A adorable mini Korean bento cake decorated with custom piped borders, soft pink ribbons, and a cute hand-painted message. Ideal for mini milestones or spontaneous surprises!',
          price: 18.00,
          oldPrice: 22.00,
          categoryId: 'bento-cakes',
          flavor: 'Vanilla Bean & Fresh Strawberries',
          weights: ['0.5kg', '1.0kg'],
          images: [
            { url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80', provider: 'imgbb', uploadedAt: new Date().toISOString() },
            { url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=600&auto=format&fit=crop&q=80', provider: 'imgbb', uploadedAt: new Date().toISOString() }
          ],
          featured: true,
          bestseller: true,
          available: true,
          rating: 4.9
        },
        {
          name: 'Sweet Teddy Sparkle Birthday Cake',
          slug: 'sweet-teddy-sparkle-birthday',
          description: 'Our signature birthday cake! Adorned with a handcrafted edible teddy bear figurine, floating mini hearts, and a premium silk pink ribbon. Filled with light vanilla cream and raspberries.',
          price: 45.00,
          categoryId: 'birthday-cakes',
          flavor: 'Chantilly Cream & Raspberries',
          weights: ['1.0kg', '1.5kg', '2.0kg'],
          images: [
            { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80', provider: 'imgbb', uploadedAt: new Date().toISOString() }
          ],
          featured: true,
          bestseller: true,
          available: true,
          rating: 5.0
        },
        {
          name: 'Luxury Vintage Heart Anniversary Cake',
          slug: 'luxury-vintage-heart',
          description: 'Exquisite, French-piped heart cake styled in the classic vintage Lambeth design. Styled with rich white piping, soft pastel pink pearls, and custom gold sparkles.',
          price: 55.00,
          oldPrice: 65.00,
          categoryId: 'anniversary-cakes',
          flavor: 'Red Velvet with Cream Cheese',
          weights: ['1.5kg', '2.0kg', '3.0kg'],
          images: [
            { url: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?w=600&auto=format&fit=crop&q=80', provider: 'imgbb', uploadedAt: new Date().toISOString() }
          ],
          featured: true,
          bestseller: false,
          available: true,
          rating: 4.8
        },
        {
          name: 'Fudge Chocolate Drip Dream',
          slug: 'fudge-chocolate-drip-dream',
          description: 'Rich, moist double-chocolate cake layered with homemade chocolate fudge, topped with a gorgeous glossy chocolate drip, chocolate curls, and hand-dusted gold glitter.',
          price: 38.00,
          categoryId: 'chocolate-cakes',
          flavor: 'Belgian Chocolate Fudge',
          weights: ['1.0kg', '1.5kg', '2.0kg'],
          images: [
            { url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', provider: 'imgbb', uploadedAt: new Date().toISOString() }
          ],
          featured: false,
          bestseller: true,
          available: true,
          rating: 4.7
        },
        {
          name: 'Strawberry Whipped Blossom Cake',
          slug: 'strawberry-whipped-blossom',
          description: 'Soft sponge cake infused with organic elderflower, layered with mountain-fresh strawberry compote, and topped with delicate floral blossom piping and real strawberry crowns.',
          price: 36.00,
          categoryId: 'strawberry-cakes',
          flavor: 'Vanilla Elderflower & Strawberries',
          weights: ['1.0kg', '1.5kg'],
          images: [
            { url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80', provider: 'imgbb', uploadedAt: new Date().toISOString() }
          ],
          featured: false,
          bestseller: false,
          available: true,
          rating: 4.9
        },
        {
          name: 'Pastel Dream Custom Painting Cake',
          slug: 'pastel-dream-custom',
          description: 'A completely customized cake! Upload an illustration or describe your dream scenario, and Tani will paint it directly onto the velvety buttercream frosting.',
          price: 49.00,
          categoryId: 'custom-cakes',
          flavor: 'Cookies & Cream Oreo',
          weights: ['1.0kg', '1.5kg', '2.0kg'],
          images: [
            { url: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80', provider: 'imgbb', uploadedAt: new Date().toISOString() }
          ],
          featured: true,
          bestseller: false,
          available: true,
          rating: 5.0
        }
      ];

      for (const cake of defaultCakes) {
        await createCake(cake);
      }
      console.log('Cakes seeded successfully!');
    }

    // 3. Seed FAQs if empty
    const faqSnap = await getDocs(faqsCol());
    if (faqSnap.empty) {
      console.log('Seeding FAQs...');
      const defaultFAQs: Omit<FAQ, 'id' | 'createdAt'>[] = [
        { question: 'How far in advance should I place my order?', answer: 'We require a minimum of 2 days (48 hours) notice for standard cakes, and 4-5 days notice for fully custom-sculpted designs, as everything is baked fresh to order by Tani 🩷', category: 'Ordering' },
        { question: 'Do you offer eggless, gluten-free, or vegan cakes?', answer: 'Yes! We can make most of our cakes eggless or gluten-free. Please select your preference or leave a note in the Special Message box during checkout.', category: 'Dietary Requirements' },
        { question: 'How should I store my cake after delivery?', answer: 'We recommend storing the cake in its box in a cool fridge. Take it out 30-45 minutes before serving to let the buttercream soften to its perfect, velvety consistency 🐻‍❄️', category: 'Storage' },
        { question: 'What is a Bento Cake?', answer: 'Bento cakes are cute, lunchbox-sized mini cakes (about 4 inches wide) originating from South Korea. They are perfect for sharing between 1-2 people and come in standard cute eco-boxes with a candle!', category: 'Cake Information' }
      ];
      for (const faq of defaultFAQs) {
        await addFAQ(faq);
      }
    }

    // 4. Seed Reviews if empty
    const reviewSnap = await getDocs(reviewsCol());
    if (reviewSnap.empty) {
      console.log('Seeding Reviews...');
      const defaultReviews: Omit<Review, 'id' | 'createdAt' | 'approved' | 'featured'>[] = [
        { customerName: 'Charlotte P.', rating: 5, reviewText: 'I ordered the Sweet Teddy Sparkle cake for my sister’s 21st and we were absolutely blown away! The design was so elegant and cute, and the sponge inside was incredibly light and moist! Highly recommended! 🐻‍❄️🎀' },
        { customerName: 'Liam G.', rating: 5, reviewText: 'The pink bow bento cake was so delicious. Tani is an artist! The custom message was written beautifully. Best cake shop in town.' },
        { customerName: 'Sophie M.', rating: 5, reviewText: 'Beautiful Lambeth vintage cake. Red velvet was filled with rich cream cheese and tasted like heaven. Will order again for sure!' }
      ];
      for (const rev of defaultReviews) {
        const id = await addReview(rev);
        await updateReviewStatus(id, { approved: true, featured: true });
      }
    }

    // 5. Seed Offers if empty
    const offerSnap = await getDocs(offersCol());
    if (offerSnap.empty) {
      console.log('Seeding Offers...');
      const defaultOffers: Omit<Offer, 'id'>[] = [
        {
          title: 'Welcome Discount 💖',
          description: 'Get 10% off your very first order at Sweet by Tani!',
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          startDate: new Date().toISOString(),
          endDate: '2027-12-31T23:59:59.000Z',
          active: true
        },
        {
          title: 'Bento Love Bundle 🎀',
          description: 'Save £5 when you order any Bento Cake with a custom topper.',
          code: 'BENTOLOVE',
          discountType: 'fixed',
          discountValue: 5.00,
          startDate: new Date().toISOString(),
          endDate: '2027-12-31T23:59:59.000Z',
          active: true
        }
      ];
      for (const offer of defaultOffers) {
        await addOffer(offer);
      }
    }
    
    // 6. Ensure default settings exist
    await getBusinessSettings();

  } catch (e) {
    console.error('Error in self-seeding engine:', e);
  }
}
