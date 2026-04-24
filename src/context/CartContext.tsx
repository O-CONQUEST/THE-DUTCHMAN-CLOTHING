"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { products } from "@/data/products"; // Ensure this path matches your products file

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const supabase = createClient();

  // 1. Fetch and Sync Cart from Supabase
  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id);

      if (data && !error) {
        // MATCHING LOGIC: Link database product_id to the local products data
        const detailedCart = data.map((item: any) => {
          const productInfo = products.find((p) => p.id === item.product_id);
          return {
            ...item,
            ...productInfo, // This adds name, price, and image to the item
          };
        });
        setCart(detailedCart);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Add to Cart Logic
  const addToCart = async (product: any) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to add items to your bag.");
      return;
    }

    // Save to Supabase
    const { error } = await supabase
      .from("cart_items")
      .insert([{ 
        user_id: user.id, 
        product_id: product.id, 
        quantity: 1 
      }]);

    if (error) {
      console.error("Sync error:", error.message);
    } else {
      // Refresh cart to get the most updated data
      fetchCart();
      alert(`${product.name} added to bag.`);
    }
  };

  // 3. Remove from Cart Logic
  const removeFromCart = async (dbId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", dbId);

    if (!error) {
      setCart((prev) => prev.filter((item) => item.id !== dbId));
    }
  };

  // 4. Calculate Total (Prevents NaN)
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);