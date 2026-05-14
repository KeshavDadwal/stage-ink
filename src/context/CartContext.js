"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCartItems, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, updateCartItemQuantity as apiUpdateQuantity, clearCart as apiClearCart } from "@/app/API/cartApi";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const items = await fetchCartItems();
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (bookId, quantity = 1) => {
    console.log("Adding to cart - bookId:", bookId, "type:", typeof bookId);
    try {
      await apiAddToCart(bookId, quantity);
      await refreshCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await apiRemoveFromCart(cartItemId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await apiUpdateQuantity(cartItemId, quantity);
      await refreshCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await apiClearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
