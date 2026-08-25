"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { products, type Product } from "@/data/products";

export type CartItem = Product & {
  cartItemId: string;
  quantity: number;
};

type CartContextValue = {
  cart: CartItem[];
  user: User | null;
  authLoading: boolean;
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  signOut: () => Promise<void>;
  toast: string | null;
  showToast: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const supabase = createClient();

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchCart = useCallback(
    async (forUser: User) => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", forUser.id);

      if (error || !data) return;

      const detailedCart: CartItem[] = data
        .map((row: { id: string; product_id: string; quantity: number }) => {
          const productInfo = products.find((p) => p.id === row.product_id);
          if (!productInfo) return null;
          return {
            ...productInfo,
            cartItemId: row.id,
            quantity: row.quantity ?? 1,
          };
        })
        .filter((item): item is CartItem => item !== null);

      setCart(detailedCart);
    },
    [supabase]
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setAuthLoading(false);
      if (nextUser) {
        fetchCart(nextUser);
      } else {
        setCart([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchCart]);

  const addToCart = async (product: Product) => {
    if (!user) {
      showToast("Please sign in to add items to your bag.");
      return;
    }

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      await updateQuantity(existing.cartItemId, existing.quantity + 1);
      showToast(`${product.name} quantity updated.`);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .insert([{ user_id: user.id, product_id: product.id, quantity: 1 }]);

    if (error) {
      console.error("Sync error:", error.message);
      showToast("Couldn't add that item. Please try again.");
    } else {
      await fetchCart(user);
      showToast(`${product.name} added to bag.`);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId);

    if (!error) {
      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    } else {
      showToast("Couldn't remove that item. Please try again.");
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId);

    if (!error) {
      setCart((prev) =>
        prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
      );
    } else {
      showToast("Couldn't update quantity. Please try again.");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCart([]);
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        user,
        authLoading,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        signOut,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
