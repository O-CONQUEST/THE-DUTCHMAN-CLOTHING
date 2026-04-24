"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, subtotal } = useCart();

  return (
    <main className="min-h-screen bg-white text-black p-6 font-sans">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex justify-between items-end mb-10">
          <h1 className="text-6xl font-black uppercase tracking-tighter italic">Your Bag</h1>
          <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Items List */}
          <div className="flex-[2] border-t border-black">
            {cart.length === 0 ? (
              <p className="py-20 text-[10px] uppercase tracking-widest text-neutral-400">Your bag is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-6 py-10 border-b border-neutral-100 items-center">
                  <div className="w-24 h-32 bg-neutral-50 relative">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[12px] font-bold uppercase tracking-widest">{item.name || "Original Fit"}</h2>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[9px] uppercase tracking-widest text-red-500 mt-2 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-[12px] font-bold">${item.price || "0"}.00</div>
                </div>
              ))
            )}
          </div>

          {/* Summary Section */}
          <div className="flex-1 bg-neutral-50 p-10 h-fit">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Summary</h2>
            <div className="space-y-4 border-b border-neutral-200 pb-6">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span>${subtotal}.00</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="flex justify-between py-8">
              <span className="text-2xl font-black uppercase tracking-tighter">Total</span>
              <span className="text-2xl font-black uppercase tracking-tighter">${subtotal}.00</span>
            </div>
            <button className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-80 transition">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}