import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { getOrder } from '../../lib/services/db';
import { Order } from '../../types';
import { Sparkles, Calendar, MessageSquare, CheckCircle, Package, MapPin } from 'lucide-react';

export default function OrderSuccessPage() {
  const { settings, navigateTo } = useAppContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Get order ID from URL query parameters
  useEffect(() => {
    async function load() {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('id');
      if (orderId) {
        const data = await getOrder(orderId);
        setOrder(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const generateWhatsAppLink = () => {
    if (!order) return '#';
    const bizNum = settings?.whatsappNumber || '447123456789';
    
    const itemsText = order.items.map(i => `${i.cakeName} (${i.weight}, flavor: ${i.flavor}) x${i.quantity}`).join('\n');
    
    const text = `Hello Sweet by Tani 👋

I want to place an order.

Order ID: ${order.orderNumber}
Cake: ${order.items[0]?.cakeName || ''}
Weight: ${order.items[0]?.weight || ''}
Quantity: ${order.items[0]?.quantity || 1}
Delivery Date: ${order.deliveryDate}
Special Message: ${order.specialMessage || 'None'}

Please confirm my order.`;

    return `https://wa.me/${bizNum}?text=${encodeURIComponent(text)}`;
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <div className="text-4xl animate-spin">👩‍🍳</div>
        <p className="text-xs text-[#4B4453]/60">Securing your order coordinates...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <span className="text-5xl">🐻‍❄️</span>
        <h2 className="font-display text-xl font-bold text-[#4B4453]">Order Not Found</h2>
        <p className="text-xs text-[#4B4453]/60">We could not load your order details. If you just placed an order, please check your Profile dashboard.</p>
        <button onClick={() => navigateTo('home')} className="rounded-xl bg-[#F78FB3] px-6 py-2.5 text-xs text-white">Go Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 min-h-screen space-y-8">
      
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDDEB] text-3xl pink-glow pulse-glow">
          🎉
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Order Confirmed!</span>
          <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">Sweetness is on its Way!</h1>
          <p className="text-sm text-[#4B4453]/70 dark:text-zinc-400 font-body max-w-md mx-auto">
            Thank you for ordering from Sweet by Tani. Your unique order ID is <strong className="text-[#F78FB3]">{order.orderNumber}</strong>.
          </p>
        </div>
      </div>

      {/* WhatsApp Trigger Box */}
      <div className="bg-gradient-to-r from-[#FFDDEB] to-[#FFB6C1] dark:from-[#352328] dark:to-[#522935] border border-pink-200 dark:border-pink-900 rounded-[32px] p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white mx-auto text-[#25D366]">
          <MessageSquare className="h-6 w-6 fill-current" />
        </div>
        <h3 className="font-display font-bold text-lg text-[#4B4453] dark:text-white">Fast-Track Your Confirmation on WhatsApp!</h3>
        <p className="text-xs text-[#4B4453]/80 dark:text-zinc-200 max-w-md mx-auto leading-relaxed">
          Pinging Tani on WhatsApp guarantees a near-instant review of your reference designs and finalizes your delivery slot booking instantly.
        </p>
        <div className="pt-2">
          <a 
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 rounded-2xl bg-[#25D366] hover:scale-102 hover:shadow-lg transition-transform text-white font-bold text-xs py-3.5 px-8 cursor-pointer"
          >
            <span>Send WhatsApp Confirmation 💬</span>
          </a>
        </div>
      </div>

      {/* Order Details Brief card */}
      <div className="bg-white dark:bg-[#241F23] border border-pink-100 dark:border-zinc-800 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white border-b border-pink-50 pb-3 flex items-center">
          <Package className="h-5 w-5 text-[#F78FB3] mr-2" />
          Receipt Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#4B4453]/80 dark:text-zinc-300">
          <div className="space-y-3">
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p className="flex items-start">
              <MapPin className="h-4 w-4 text-[#F78FB3] mr-1 mt-0.5 shrink-0" />
              <span><strong>Address:</strong> {order.address}</span>
            </p>
          </div>
          <div className="space-y-3">
            <p className="flex items-center">
              <Calendar className="h-4 w-4 text-[#F78FB3] mr-1 shrink-0" />
              <span><strong>Delivery Date:</strong> {order.deliveryDate}</span>
            </p>
            <p className="flex items-center">
              <Clock className="h-4 w-4 text-[#F78FB3] mr-1 shrink-0" />
              <span><strong>Time Slot:</strong> {order.deliveryTime}</span>
            </p>
            <p><strong>Order Status:</strong> <span className="bg-[#FFDDEB] text-[#F78FB3] px-2.5 py-0.5 rounded-full font-bold">{order.status}</span></p>
            {order.specialMessage && <p><strong>Instructions:</strong> "{order.specialMessage}"</p>}
          </div>
        </div>

        <hr className="border-pink-50 dark:border-zinc-800" />

        {/* Item List */}
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-pink-100/30 border border-pink-50 shrink-0">
                  <img src={item.cakeImage} alt={item.cakeName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4B4453] dark:text-white">{item.cakeName}</h4>
                  <p className="text-[10px] text-[#4B4453]/60 dark:text-zinc-400 font-bold">{item.weight} • {item.flavor} x{item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-[#F78FB3]">{settings?.currency || '£'}{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <hr className="border-pink-50 dark:border-zinc-800" />

        {/* Total Cost */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#4B4453]/60 uppercase">Paid Amount</span>
          <span className="font-display text-xl font-black text-[#F78FB3]">{settings?.currency || '£'}{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Go Home button */}
      <div className="text-center pt-4">
        <button 
          onClick={() => navigateTo('home')}
          className="rounded-2xl bg-white hover:bg-pink-50 text-[#F78FB3] border border-pink-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white px-8 py-3.5 font-bold text-xs shadow-sm transition-transform cursor-pointer"
        >
          Return to Homepage
        </button>
      </div>

    </div>
  );
}
