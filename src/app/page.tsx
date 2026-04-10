"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Home() {
  // Access the cart from our context to show the count in the nav
  const { cart } = useCart();

  return (
    <main className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
      
      {/* NAVIGATIONBAR */}
      <nav className="p-8 flex justify-between items-center bg-white z-50">
        <div className="flex items-center gap-3">
          {/* Small Navigation Logo */}
          <Image 
            src="/logo.png" 
            alt="The Dutchman Logo" 
            width={30} 
            height={30} 
            className="object-contain"
          />
          <h1 className="text-sm font-black uppercase tracking-tighter">The Dutchman</h1>
        </div>

        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
          <Link href="/auth" className="hover:opacity-50 transition-opacity">
            Account
          </Link>
          <Link href="/cart" className="hover:opacity-50 transition-opacity">
            Bag ({cart.length})
          </Link>
        </div>
      </nav>

      {/* HERO SECTION - THE LANDING PAGE VIEW */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-10">
        {/* Large Hero Logo */}
        <div className="mb-14 animate-in fade-in zoom-in duration-1000">
          <Image 
            src="/logo.png" 
            alt="The Dutchman Official" 
            width={480} 
            height={480} 
            priority
            className="object-contain drop-shadow-sm"
          />
        </div>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.6em] ml-1">
              Est. 2026 / Lagos
            </p>
            <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
              Durable Goods for the Modern Voyage
            </h2>
          </div>

          <Link href="/collection">
            <button className="group relative overflow-hidden border border-black bg-black text-white px-16 py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-white hover:text-black">
              <span className="relative z-10">View Collection</span>
            </button>
          </Link>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="p-10 flex justify-between items-center border-t border-gray-50">
        <p className="text-[9px] text-gray-300 uppercase tracking-widest">
          © 2026 The Dutchman Clothing Co.
        </p>
        <div className="flex gap-6 text-[9px] text-gray-300 uppercase tracking-widest">
          <span className="cursor-pointer hover:text-black transition">Instagram</span>
          <span className="cursor-pointer hover:text-black transition">Terms</span>
        </div>
      </footer>
    </main>
  );
}