"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import Script from "next/script";
import { createPaymentOrder, verifyPayment } from "@/app/API/cartApi";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, loading, cartCount, updateQuantity, removeFromCart, clearCart, refreshCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  const shipping = 0; // Free shipping for now
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (isProcessing) return;
    
    // Validate shipping data
    if (!shippingData.customerName || !shippingData.customerEmail || !shippingData.customerPhone || !shippingData.shippingAddress || !shippingData.shippingPincode) {
      alert("Please fill in all required shipping details.");
      return;
    }

    try {
      setIsProcessing(true);
      
      // 1. Create order on backend
      const orderData = await createPaymentOrder(null, shippingData);
      
      // 2. Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Ink Portal",
        description: "Book Purchase",
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            alert("Payment successful! Your order has been placed.");
            await refreshCart();
            setIsProcessing(false);
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification failed. Please contact support.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingData.customerName,
          email: shippingData.customerEmail,
          contact: shippingData.customerPhone,
        },
        theme: {
          color: "#241B6D",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(error.message || "Failed to initiate checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#241B6D]"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-100 p-8 rounded-full">
            <FiShoppingBag size={64} className="text-gray-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added any books to your cart yet. Explore our collection and find your next great read!
        </p>
        <Link 
          href="/books" 
          className="inline-flex items-center gap-2 bg-[#241B6D] text-white px-8 py-3 rounded-full font-bold hover:bg-[#FFDE7C] hover:text-[#241B6D] transition-colors"
        >
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-[#241B6D]">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="col-span-1 md:col-span-6 flex gap-4">
                    <div className="relative w-20 h-28 shrink-0 bg-gray-50 rounded overflow-hidden">
                      <Image 
                        src={item.book.thumbnailUrl || "/images/book-placeholder.png"} 
                        alt={item.book.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-lg text-[#241B6D] line-clamp-1">
                        <Link href={`/books/${item.book.slug}`} className="hover:underline">
                          {item.book.title}
                        </Link>
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-red-500 text-sm mt-2 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 text-center">
                    <span className="md:hidden font-bold mr-2 text-gray-500">Price:</span>
                    <span className="font-medium text-gray-900">₹{item.book.price}</span>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:text-[#241B6D] transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-[#241B6D]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:text-[#241B6D] transition-colors"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 text-right">
                    <span className="md:hidden font-bold mr-2 text-gray-500">Total:</span>
                    <span className="font-bold text-[#241B6D] text-lg">₹{item.book.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-gray-50 flex justify-between items-center">
              <Link 
                href="/books" 
                className="text-[#241B6D] font-bold flex items-center gap-2 hover:underline"
              >
                <FiArrowLeft /> Continue Shopping
              </Link>
              <button 
                onClick={clearCart}
                className="text-gray-500 hover:text-red-500 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Shipping Details Form */}
        <div className="lg:col-span-2 mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#241B6D]">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name *</label>
                <input 
                  type="text" 
                  name="customerName"
                  value={shippingData.customerName}
                  onChange={handleInputChange}
                  placeholder="John Doe" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#241B6D] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address *</label>
                <input 
                  type="email" 
                  name="customerEmail"
                  value={shippingData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="john@example.com" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#241B6D] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Phone Number *</label>
                <input 
                  type="tel" 
                  name="customerPhone"
                  value={shippingData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#241B6D] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Pincode *</label>
                <input 
                  type="text" 
                  name="shippingPincode"
                  value={shippingData.shippingPincode}
                  onChange={handleInputChange}
                  placeholder="110001" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#241B6D] focus:border-transparent transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700">Address *</label>
                <textarea 
                  name="shippingAddress"
                  value={shippingData.shippingAddress}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="House No., Street, Landmark" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#241B6D] focus:border-transparent transition-all"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">City *</label>
                <input 
                  type="text" 
                  name="shippingCity"
                  value={shippingData.shippingCity}
                  onChange={handleInputChange}
                  placeholder="New Delhi" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#241B6D] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">State *</label>
                <input 
                  type="text" 
                  name="shippingState"
                  value={shippingData.shippingState}
                  onChange={handleInputChange}
                  placeholder="Delhi" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#241B6D] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 text-[#241B6D]">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-[#241B6D]">Total</span>
                <span className="text-2xl font-black text-[#241B6D]">₹{total}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-[#241B6D] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#FFDE7C] hover:text-[#241B6D] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Proceed to Checkout"}
            </button>
            
            <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
              <Image src="/visa.png" alt="Visa" width={40} height={25} className="h-6 object-contain" />
              <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} className="h-6 object-contain" />
              <Image src="/upi.png" alt="UPI" width={40} height={25} className="h-6 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </>
  );
}
