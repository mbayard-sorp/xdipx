"use client";

import { useState, useEffect, useCallback } from "react";
import { ShopifyCart } from "@/types";
import {
  createCart,
  addCartLine,
  removeCartLine,
  updateCartLine,
  getCart,
} from "@/lib/shopify";

const CART_ID_KEY = "xdipx_cart_id";

export function useCart() {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem(CART_ID_KEY);
    if (savedCartId) {
      getCart(savedCartId)
        .then((c) => {
          if (c) setCart(c);
          else localStorage.removeItem(CART_ID_KEY);
        })
        .catch(() => localStorage.removeItem(CART_ID_KEY));
    }
  }, []);

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true);
    try {
      const cartId = localStorage.getItem(CART_ID_KEY);
      let updatedCart: ShopifyCart;

      if (cartId) {
        updatedCart = await addCartLine(cartId, variantId, quantity);
      } else {
        updatedCart = await createCart(variantId, quantity);
        localStorage.setItem(CART_ID_KEY, updatedCart.id);
      }
      setCart(updatedCart);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (lineId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    setLoading(true);
    try {
      const updatedCart = await removeCartLine(cartId, lineId);
      setCart(updatedCart);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    setLoading(true);
    try {
      const updatedCart = await updateCartLine(cartId, lineId, quantity);
      setCart(updatedCart);
    } finally {
      setLoading(false);
    }
  }, []);

  const cartCount = cart?.totalQuantity ?? 0;
  const checkoutUrl = cart?.checkoutUrl ?? null;

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    checkoutUrl,
  };
}
