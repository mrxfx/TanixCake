import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { createOrder } from '../../lib/services/db';
import { uploadImage } from '../../lib/services/image';
import { Upload, ClipboardCheck, Clock, Calendar, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckoutPage() {
  const { 
    cart, 
    cartSubtotal, 
    cartTotal, 
    appliedDiscount, 
    couponCode, 
    clearCart, 
    user, 
    userProfile, 
    navigateTo,
    settings,
    showToast
  } = useAppContext();

  // Customer Form Fields
  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [email, setEmail] = useState(userProfile?.email || user?.email || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('12:00 PM');
  const [specialMessage, setSpecialMessage] = useState('');
  
  // Reference Image Upload State
  const [refFile, setRefFile] = useState<File | null>(null);
  const [refImageUrl, setRefImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Drag & drop state
  const [isDragActive, setIsDragActive] = useState(false);

  // Notice Period (usually 2 days)
  const getMinDeliveryDate = () => {
    const noticeDays = settings?.orderNoticeDays || 2;
    const date = new Date();
    date.setDate(date.getDate() + noticeDays);
    return date.toISOString().split('T')[0];
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Unsupported file type. Please upload a JPG, PNG, or WEBP image 🐻‍❄️', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      showToast('File is too large. Max file size is 5MB!', 'error');
      return;
    }

    setRefFile(file);
    setUploadProgress('uploading');

    try {
      // Determine image provider from Settings
      const provider = settings?.activeImageProvider || 'imgbb';
      const uploaded = await uploadImage(file, provider);
      setRefImageUrl(uploaded.url);
      setUploadProgress('success');
      showToast('Reference design uploaded successfully! 📸', 'success');
    } catch (err) {
      console.error(err);
      setUploadProgress('error');
      showToast('Image upload failed, but you can still submit your order.', 'error');
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone || !email || !address || !deliveryDate) {
      showToast('Please fill out all required fields! 🎂', 'error');
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const orderItems = cart.map(item => ({
        cakeId: item.cakeId,
        cakeName: item.cakeName,
        cakeImage: item.cakeImage,
        weight: item.weight,
        flavor: item.flavor,
        price: item.price,
        quantity: item.quantity
      }));

      const newOrder = await createOrder({
        customerId: user?.uid || '',
        customerName: fullName,
        phone,
        email,
        address,
        items: orderItems,
        subtotal: cartSubtotal,
        discount: appliedDiscount,
        deliveryCharge: settings?.deliveryCharge || 5,
        total: cartTotal,
        deliveryDate,
        deliveryTime,
        specialMessage,
        referenceImage: refImageUrl,
        status: 'Pending'
      });

      showToast('Order received! Baking is commencing! 🎉', 'success');
      clearCart();
      navigateTo(`order-success?id=${newOrder.id}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      showToast(err.message || 'Oops, something went wrong creating your order.', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <span className="text-5xl">🐻‍❄️</span>
        <h3 className="font-display font-bold text-lg text-[#4B4453] dark:text-zinc-200 mt-4">Your cart is empty!</h3>
        <button onClick={() => navigateTo('cakes')} className="mt-4 rounded-xl bg-[#F78FB3] px-6 py-2.5 font-bold text-xs text-white">Browse Cakes</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold text-[#F78FB3] uppercase tracking-widest">Final Step</span>
        <h1 className="font-display text-4xl font-extrabold text-[#4B4453] dark:text-zinc-100">Bespoke Checkout</h1>
        <div className="w-16 h-1 bg-[#F78FB3] mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Checkout Form & Custom Uploader */}
        <form onSubmit={handleOrderSubmit} className="lg:col-span-2 space-y-8">
          
          {/* Customer Details Box */}
          <div className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 sm:p-8 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-5">
            <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white flex items-center">
              <ClipboardCheck className="h-5 w-5 text-[#F78FB3] mr-2" />
              Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Delivery Date * (Min. 2 Days Notice)</label>
                <input 
                  type="date" 
                  required
                  min={getMinDeliveryDate()}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase">Delivery Time Slot</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                >
                  <option value="09:00 AM - 12:00 PM">Morning Slot (09:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM - 03:00 PM">Midday Slot (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM - 06:00 PM">Afternoon Slot (03:00 PM - 06:00 PM)</option>
                </select>
              </div>
              <div className="space-y-1 col-span-1">
                <label className="block text-xs font-bold text-[#F78FB3] uppercase font-body">Delivery Address *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Street Address, Flat details, London"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#F78FB3] uppercase">Special Instructions / Message on Cake</label>
              <textarea 
                rows={3}
                placeholder="Write any message you want piped in frosting, or dietary preferences (e.g. eggless, lower sugar)..."
                value={specialMessage}
                onChange={(e) => setSpecialMessage(e.target.value)}
                className="w-full rounded-xl border border-pink-100 dark:border-zinc-800 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#F78FB3] dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Reference Image Drag and Drop Uploader */}
          <div className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 sm:p-8 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white flex items-center">
                <ImageIcon className="h-5 w-5 text-[#F78FB3] mr-2" />
                Upload Reference Cake Design (Optional)
              </h3>
              <p className="text-[10px] text-[#4B4453]/60 dark:text-zinc-400">
                Have a specific Pinterest cake or sketch you'd like Tani to reproduce? Drag & drop it here!
              </p>
            </div>

            {/* Drag Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
                isDragActive 
                  ? 'border-[#F78FB3] bg-pink-50/50 dark:bg-zinc-800' 
                  : 'border-pink-200 dark:border-zinc-800 hover:bg-pink-50/10'
              }`}
            >
              <input 
                type="file" 
                id="ref-img-upload" 
                accept="image/jpg,image/jpeg,image/png,image/webp"
                className="hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="ref-img-upload" className="cursor-pointer space-y-2 flex flex-col items-center">
                <Upload className="h-8 w-8 text-[#F78FB3] animate-pulse" />
                <span className="text-xs font-bold text-[#F78FB3]">Drag & Drop your Image here, or browse</span>
                <span className="text-[9px] text-[#4B4453]/50">Supports: JPG, PNG, WEBP (Max 5MB)</span>
              </label>

              {/* Progress and status indicators */}
              <AnimatePresence>
                {uploadProgress === 'uploading' && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-[#241F23]/90 rounded-2xl flex flex-col items-center justify-center space-y-2">
                    <div className="h-1.5 w-24 bg-pink-100 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-[#F78FB3] shimmer rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-[#F78FB3]">Processing & Uploading...</span>
                  </div>
                )}
                {uploadProgress === 'success' && refFile && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-[#241F23]/95 rounded-2xl flex flex-col items-center justify-center space-y-2">
                    <span className="text-2xl">📸</span>
                    <span className="text-xs font-bold text-[#F78FB3]">{refFile.name} Uploaded Successfully ✓</span>
                    <button 
                      type="button" 
                      onClick={() => { setRefFile(null); setRefImageUrl(''); setUploadProgress('idle'); }}
                      className="text-[10px] underline text-red-500 font-bold"
                    >
                      Delete and Replace
                    </button>
                  </div>
                )}
                {uploadProgress === 'error' && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-[#241F23]/95 rounded-2xl flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    <span className="text-xs font-bold text-red-500">Upload failed, please try again</span>
                    <button 
                      type="button" 
                      onClick={() => setUploadProgress('idle')}
                      className="text-[10px] underline text-[#F78FB3] font-bold"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>

        {/* Live Order Summary Review Column */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-[#241F23] rounded-[32px] p-6 border border-pink-100 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base text-[#4B4453] dark:text-white border-b border-pink-50 pb-3 uppercase tracking-wider">
              Review Your Cart
            </h3>

            {/* List items briefly */}
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex space-x-3 items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-pink-100/30 shrink-0 border border-pink-50">
                      <img src={item.cakeImage} alt={item.cakeName} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-[#4B4453] dark:text-zinc-200 truncate">{item.cakeName}</h4>
                      <p className="text-[9px] text-[#4B4453]/60 dark:text-zinc-400 font-bold">{item.weight} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#F78FB3]">
                    {settings?.currency || '£'}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-pink-50 dark:border-zinc-800" />

            {/* Live Pricing */}
            <div className="space-y-3.5 text-xs text-[#4B4453]/80 dark:text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">{settings?.currency || '£'}{cartSubtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#F78FB3] font-bold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-{settings?.currency || '£'}{appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold">{settings?.currency || '£'}{(settings?.deliveryCharge || 5).toFixed(2)}</span>
              </div>

              <hr className="border-pink-50 dark:border-zinc-800 my-2" />

              <div className="flex justify-between text-sm text-[#4B4453] dark:text-white">
                <span className="font-bold uppercase font-display">Grand Total</span>
                <span className="font-display text-lg font-black text-[#F78FB3]">
                  {settings?.currency || '£'}{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Confirmation CTA */}
            <button
              onClick={handleOrderSubmit}
              disabled={isSubmittingOrder}
              className={`w-full rounded-2xl py-3.5 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-1 transition-all ${
                isSubmittingOrder
                  ? 'bg-[#F78FB3]/60 cursor-not-allowed'
                  : 'bg-[#F78FB3] hover:bg-[#F78FB3]/90 hover:shadow-lg cursor-pointer hover:-translate-y-0.5'
              }`}
            >
              <span>{isSubmittingOrder ? 'Baking your order...' : 'Place Secure Order 🎂'}</span>
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
