export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface CakeImage {
  url: string;
  provider: 'imagekit' | 'imgbb';
  fileId?: string; // used for deletion or tracking
  fileName?: string;
  uploadedAt: string;
}

export interface Cake {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  flavor: string;
  weights: string[]; // e.g. ["0.5kg", "1.5kg", "2kg"]
  images: CakeImage[];
  featured: boolean;
  bestseller: boolean;
  available: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  cakeId: string;
  cakeName: string;
  cakeImage: string;
  weight: string;
  flavor: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SBT-2026-000001
  customerId?: string; // empty if guest
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  deliveryDate: string;
  deliveryTime: string;
  specialMessage?: string;
  referenceImage?: string;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  provider: 'imagekit' | 'imgbb';
  fileId?: string;
  fileName?: string;
  category: 'Birthday' | 'Anniversary' | 'Bento' | 'Custom' | 'Special' | 'Behind the Scenes';
  featured: boolean;
  uploadedAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  reviewText: string;
  cakeId?: string;
  cakeName?: string;
  createdAt: string;
  approved: boolean;
  featured: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  instagramUrl?: string;
  facebookUrl?: string;
  openingHours: string;
  deliveryInfo: string;
  currency: string;
  deliveryCharge: number;
  minimumOrder: number;
  orderNoticeDays: number; // minimum notice required before delivery
  activeImageProvider: 'imagekit' | 'imgbb';
  imagekitPublicKey?: string;
  imagekitUrlEndpoint?: string;
}

export interface Notification {
  id: string;
  userId?: string; // empty if for admin
  title: string;
  body: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
}
