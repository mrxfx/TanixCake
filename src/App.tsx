import React, { Suspense, lazy } from 'react';
import { AppProvider, useAppContext } from './hooks/useAppContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

// Lazy-loaded heavy page components
const Homepage = lazy(() => import('./components/pages/Homepage'));
const CakesCatalog = lazy(() => import('./components/pages/CakesCatalog'));
const CartPage = lazy(() => import('./components/pages/CartPage'));
const CheckoutPage = lazy(() => import('./components/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./components/pages/OrderSuccessPage'));
const ProfilePage = lazy(() => import('./components/pages/ProfilePage'));
const AdminConsole = lazy(() => import('./components/admin/AdminConsole'));

import { 
  CategoriesPage, 
  GalleryPage, 
  OffersPage, 
  AboutPage, 
  FAQPage, 
  ContactPage 
} from './components/pages/StaticPages';

// Dynamic high-performance inline loading placeholder
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
    <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-xs font-medium text-pink-600/70 animate-pulse">Preparing delicious cakes...</p>
  </div>
);

function AppContent() {
  const { currentPage } = useAppContext();

  // Client-side visual page router
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage />;
      case 'cakes':
        return <CakesCatalog />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'profile':
      case 'orders': // route orders directly to profile orders tab
        return <ProfilePage />;
      case 'admin':
        return <AdminConsole />;
      case 'categories':
        return <CategoriesPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'offers':
        return <OffersPage />;
      case 'about':
        return <AboutPage />;
      case 'faq':
        return <FAQPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin-login': // route directly to profile login which has demo keys
        return <ProfilePage />;
      default:
        return <Homepage />;
    }
  };

  // Admin Console page does not show global client Header/Footer for clean dedicated SaaS feel
  const isAdminView = currentPage === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-pink-50/10 dark:bg-[#1A1618] text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Dynamic Toast Notifications container */}
      <ToastContainer />

      {/* Header */}
      {!isAdminView && <Navbar />}

      {/* Main Container with dynamic lazy loading context */}
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>

      {/* Footer */}
      {!isAdminView && <Footer />}

      {/* Mobile Floating Bottom Nav Bar */}
      {!isAdminView && <MobileNav />}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
