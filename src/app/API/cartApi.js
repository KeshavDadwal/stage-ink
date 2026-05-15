/**
 * API utilities for managing the shopping cart
 */
import { getPortalBaseUrl } from "@/app/API/portalBaseUrl";

const API_BASE_URL = `${getPortalBaseUrl()}/api/v1/public/cart`;

/**
 * Gets or creates a session ID for the cart
 * @returns {string} - The session ID
 */
export const getSessionId = () => {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("bluone_cart_session");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("bluone_cart_session", sessionId);
  }
  return sessionId;
};

/**
 * Fetches all items in the cart
 * @returns {Promise<Array>} - Promise resolving to an array of cart items
 */
export async function fetchCartItems() {
  const sessionId = getSessionId();
  try {
    const response = await fetch(`${API_BASE_URL}?sessionId=${sessionId}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

/**
 * Adds a book to the cart
 * @param {number} bookId - The ID of the book to add
 * @param {number} quantity - The quantity to add (default: 1)
 * @returns {Promise<Object>} - Promise resolving to the created/updated cart item
 */
export async function addToCart(bookId, quantity = 1) {
  const sessionId = getSessionId();
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId,
        quantity,
        sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to add to cart: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the quantity of a cart item
 * @param {number} cartItemId - The ID of the cart item to update
 * @param {number} quantity - The new quantity
 * @returns {Promise<Object>} - Promise resolving to the updated cart item
 */
export async function updateCartItemQuantity(cartItemId, quantity) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItemId,
        quantity,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update cart: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
}

/**
 * Removes an item from the cart
 * @param {number} cartItemId - The ID of the cart item to remove
 * @returns {Promise<Object>} - Promise resolving to the deletion result
 */
export async function removeFromCart(cartItemId) {
  try {
    const response = await fetch(`${API_BASE_URL}?cartItemId=${cartItemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to remove from cart: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

/**
 * Clears the entire cart
 * @returns {Promise<Object>} - Promise resolving to the result
 */
export async function clearCart() {
  const sessionId = getSessionId();
  try {
    const response = await fetch(`${API_BASE_URL}?sessionId=${sessionId}&clear=true`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to clear cart: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}

/**
 * Creates a Razorpay order
 * @param {number|null} userId - The ID of the user (optional)
 * @param {Object|null} shippingData - The shipping details (optional)
 * @returns {Promise<Object>} - Promise resolving to the order details
 */
export async function createPaymentOrder(userId = null, shippingData = null, couponCode = null) {
  const sessionId = getSessionId();
  try {
    const response = await fetch(`${getPortalBaseUrl()}/api/v1/public/payment/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        sessionId,
        ...shippingData,
        couponCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create payment order: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating payment order:", error);
    throw error;
  }
}

/**
 * Verifies a Razorpay payment
 * @param {Object} paymentData - The payment data from Razorpay
 * @param {number|null} userId - The ID of the user (optional)
 * @returns {Promise<Object>} - Promise resolving to the verification result
 */
export async function verifyPayment(paymentData, userId = null) {
  const sessionId = getSessionId();
  try {
    const response = await fetch(`${getPortalBaseUrl()}/api/v1/public/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...paymentData,
        userId,
        sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to verify payment: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}
