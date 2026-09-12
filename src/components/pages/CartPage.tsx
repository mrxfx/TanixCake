import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Trash2, ArrowRight, Tag, Gift, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    cartTotal, 
    appliedDiscount, 
    applyCoupon, 
    couponCode,
    navigateTo,
    settings
  } = useAppContext();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    const code = promoInput.trim().toUpperCase();
    if (code === 'WELCOME10') {
      applyCoupon(code, 'percentage', 10);
    } else if (code === 'BENTOLOVE') {
      applyCoupon(code, 'fixed', 5.00);
    } else {
      setPromoError('Invalid promo code 🥺 Please try WELCOME10!');
    }
  };

  const deliveryCharge = settings ? settings.deliveryCharge : 5;
  const minOrder = settings ? settings.minimumOrder : 15;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="relative text-7xl teddy-float">🐻‍❄️</div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-black text-[#4B4453] dark:text-zinc-100">Your Bento Box is Empty!</h2>
          <p className="text-xs text-[#4B4453]/70 dark:text-zinc-400">
            Tani’s oven is hot and ready. Explore our delicious custom bento designs and premium cupcakes!
          </p>
        </div>
        <button 
          onClick={() => navigateTo('cakes')} 
          className="rounded-2xl bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white font-bold text-xs py-3.5 px-8 shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          Explore Sweet Cakes Catalog
        </button>
      </div>
    );
  }

  const isBelowMinOrder = cartSubtotal < minOrder;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">My Selection</span>
        <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">Shopping Cart</h1>
        <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-pink-100 dark:border-zinc-800">
            <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-zinc-200">Selected Items</h3>
            <button 
              onClick={clearCart}
              className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>

          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div 
                key={`${item.cakeId}-${item.weight}-${item.flavor}`}
                className="bg-white dark:bg-[#241F23] rounded-3xl p-4 sm:p-5 border border-pink-50 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between"
              >
                {/* Image & Description details */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-pink-100/30 shrink-0 border border-pink-50">
                    <img src={item.cakeImage} alt={item.cakeName} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 truncate">
                    <h4 className="font-display font-bold text-sm text-[#4B4453] dark:text-white truncate">{item.cakeName}</h4>
                    <p className="text-[10px] text-[#4B4453]/60 dark:text-zinc-400 font-semibold uppercase tracking-wide">
                      {item.weight} • {item.flavor}
                    </p>
                    {item.quantity > 0 && (
                      <p className="text-[10px] text-[#F78FB3] font-bold">
                        Unit price: {settings?.currency || '£'}{item.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity Toggle */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-pink-100 dark:border-zinc-800 rounded-xl bg-pink-50/10">
                    <button
                      onClick={() => updateCartQuantity(item.cakeId, item.weight, item.flavor, item.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-[#FFDDEB] text-sm text-[#F78FB3] font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-0.5 text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cakeId, item.weight, item.flavor, item.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-[#FFDDEB] text-sm text-[#F78FB3] font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cakeId, item.weight, item.flavor)}
                    className="p-2 text-zinc-400 hover:text-red-500 rounded-full cursor-pointer"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Single sub total price */}
                <div className="text-right shrink-0">
                  <p className="font-display text-sm font-black text-[#F78FB3]">
                    {settings?.currency || '£'}{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white border-b border-pink-50 pb-3 uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between text-[#4B4453]/80 dark:text-zinc-300">
                <span>Subtotal</span>
                <span className="font-bold">{settings?.currency || '£'}{cartSubtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#F78FB3] font-bold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-{settings?.currency || '£'}{appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#4B4453]/80 dark:text-zinc-300">
                <span>Delivery Charge</span>
                <span className="font-bold">{settings?.currency || '£'}{deliveryCharge.toFixed(2)}</span>
              </div>
              
              <hr className="border-pink-50 dark:border-zinc-800 my-2" />

              <div className="flex justify-between text-sm text-[#4B4453] dark:text-white">
                <span className="font-bold uppercase font-display tracking-wide">Grand Total</span>
                <span className="font-display text-lg font-black text-[#F78FB3]">
                  {settings?.currency || '£'}{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Minimum order notice */}
            {isBelowMinOrder && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-200 border border-red-100 rounded-2xl text-[10px] leading-relaxed">
                ⚠️ Minimum order total to check out is <strong>{settings?.currency || '£'}{minOrder.toFixed(2)}</strong> (Excluding delivery). Your subtotal is currently {settings?.currency || '£'}{cartSubtotal.toFixed(2)}.
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={() => navigateTo('checkout')}
              disabled={isBelowMinOrder}
              className={`w-full rounded-2xl py-3.5 font-bold text-xs shadow-md flex items-center justify-center space-x-1 transition-all ${
                isBelowMinOrder
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800'
                  : 'bg-[#F78FB3] hover:bg-[#F78FB3]/90 text-white hover:shadow-lg cursor-pointer'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-xs text-[#F78FB3] uppercase tracking-wider flex items-center">
              <Tag className="h-4 w-4 mr-1.5" />
              Apply Promo Code
            </h4>
            <div className="flex space-x-2">
              <input 
                type="text"
                placeholder="e.g. WELCOME10"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none dark:bg-zinc-800 dark:text-white uppercase font-bold"
              />
              <button 
                type="submit"
                className="rounded-xl bg-[#FFDDEB] text-[#F78FB3] font-bold text-xs px-4 hover:bg-[#F78FB3] hover:text-white transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-[10px] text-red-500 font-semibold">{promoError}</p>}
            {couponCode && <p className="text-[10px] text-green-500 font-bold flex items-center"><Gift className="h-3 w-3 mr-1" /> Promo code '{couponCode}' is active!</p>}
          </form>
        </div>

      </div>
    </div>
  );
}
