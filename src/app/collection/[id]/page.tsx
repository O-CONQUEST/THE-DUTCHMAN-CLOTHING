"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { createClient } from "@/utils/supabase/client";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const { addToCart, cart } = useCart();
  const router = useRouter();
  const supabase = createClient();

  // Find the product data
  const product = products.find((p) => p.id === id);

  if (!product) return <div className="p-20 text-center uppercase font-bold">Product Not Found</div>;

  const handleAddToCart = async () => {
    // Check if user is logged in via Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Not logged in: Alert and redirect to Auth with a 'next' destination
      alert("Please login or create an account to add items to your bag.");
      router.push(`/auth?next=/collection/${id}`);
      return;
    }

    // Logged in: Add to cart
    addToCart(product);
    alert(`${product.name} added to bag.`);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <nav className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-50">
        <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest">← Back</Link>
        {/* LOGO FIX: Using /logo.png with priority for Vercel */}
        <Image src="/logo.png" alt="Logo" width={25} height={25} priority />
        <Link href="/cart" className="text-[10px] font-bold uppercase tracking-widest">Bag ({cart.length})</Link>
      </nav>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 p-10 mt-10">
        <div className="flex-1 aspect-[3/4] bg-neutral-50 relative border border-neutral-100 overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority />
        </div>

        <div className="flex-1 space-y-10 py-6">
          <header>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{product.name}</h1>
            <p className="text-xl font-medium text-neutral-600 mt-4">${product.price}.00</p>
          </header>

          <p className="text-sm leading-relaxed text-neutral-500 max-w-md">{product.description}</p>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </main>
  );
}