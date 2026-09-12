import React from 'react';
import { AppProvider, useAppContext } from './hooks/useAppContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';

// Pages
import Homepage from './components/pages/Homepage';
import CakesCatalog from './components/pages/CakesCatalog';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderSuccessPage from './components/pages/OrderSuccessPage';
import ProfilePage from './components/pages/ProfilePage';
import AdminConsole from './components/admin/AdminConsole';
import { 
  CategoriesPage, 
  GalleryPage, 
  OffersPage, 
  AboutPage, 
  FAQPage, 
  ContactPage 
} from './components/pages/StaticPages';

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

      {/* Main Container */}
      <main className="flex-grow">
        {renderPage()}
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
