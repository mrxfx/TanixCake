import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Home, Cake, ShoppingBag, ClipboardList, User } from 'lucide-react';

export default function MobileNav() {
  const { currentPage, navigateTo, cart, userProfile } = useAppContext();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const items = [
    { label: 'Home', icon: Home, page: 'home' },
    { label: 'Cakes', icon: Cake, page: 'cakes' },
    { label: 'Cart', icon: ShoppingBag, page: 'cart', badge: cartCount },
    { label: 'Orders', icon: ClipboardList, page: 'orders' },
    { label: 'Profile', icon: User, page: 'profile' }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#241F23]/90 backdrop-blur-lg border-t border-pink-100 dark:border-zinc-800 px-4 py-2 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.page || (item.page === 'orders' && currentPage.startsWith('order-'));
        
        return (
          <button
            key={item.page}
            onClick={() => navigateTo(item.page)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              isActive 
                ? 'text-[#F78FB3] scale-110 font-bold' 
                : 'text-[#4B4453]/70 dark:text-zinc-400'
            }`}
            id={`mobile-nav-${item.page}`}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#F78FB3] text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-wide font-medium">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#F78FB3]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
