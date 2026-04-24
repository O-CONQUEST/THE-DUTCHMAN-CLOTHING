"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const supabase = createClient();

  // 1. Fetch cart from Supabase when the user logs in
  useEffect(() => {
    const fetchCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id);

        if (data && !error) {
          setCart(data);
        }
      }
    };
    fetchCart();
  }, []);

  // 2. Add to Cart (Syncs to Database)
  const addToCart = async (product: any) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Optimistic Update: Update UI immediately
      setCart((prev) => [...prev, product]);

      // Sync to Supabase
      const { error } = await supabase
        .from("cart_items")
        .insert([{ 
          user_id: user.id, 
          product_id: product.id, 
          quantity: 1 
        }]);

      if (error) {
        console.error("Sync error:", error.message);
        alert("Could not sync cart to account.");
      }
    } else {
      alert("Please login to save items to your bag.");
    }
  };

  const removeFromCart = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    setCart((prev) => prev.filter((item) => item.product_id !== productId));

    if (user) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);