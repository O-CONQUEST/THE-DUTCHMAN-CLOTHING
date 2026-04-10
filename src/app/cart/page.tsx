"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function BagPage() {
  const { cart } = useCart();
  const total = cart.reduce((acc: number, item: any) => acc + item.price, 0);

  return (
    <main className="min-h-screen bg-white text-black p-8 md:p-20 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b pb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Your Bag</h1>
          <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest border-b border-black">
            Continue Shopping
          </Link>
        </header>

        {cart.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-6">Your bag is currently empty.</p>
            <Link href="/collection" className="bg-black text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              {cart.map((item: any, index: number) => (
                <div key={index} className="flex gap-6 border-b pb-6 items-center">
                  
                  {/* REAL IMAGE IN THE BAG */}
                  <div className="w-20 h-24 bg-neutral-50 flex-shrink-0 relative border border-neutral-100 overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex justify-between">
                    <div>
                      <h3 className="font-bold uppercase text-xs tracking-tight">{item.name}</h3>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest font-medium">Original Fit</p>
                    </div>
                    <p className="font-bold text-sm">${item.price}.00</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-neutral-50 p-8 h-fit border border-neutral-100">
              <h2 className="text-lg font-black uppercase tracking-tighter mb-6">Summary</h2>
              <div className="space-y-4 border-b pb-6 text-[10px] uppercase tracking-widest font-bold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total}.00</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="flex justify-between py-6 font-bold text-xl tracking-tighter">
                <span>Total</span>
                <span>${total}.00</span>
              </div>
              <button className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}