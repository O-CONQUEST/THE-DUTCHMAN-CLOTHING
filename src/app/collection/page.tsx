"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products"; // Import your list

export default function CollectionPage() {
  const { cart } = useCart();

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <nav className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-50">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={25} height={25} />
          <span className="font-black uppercase text-sm tracking-tighter italic">The Dutchman</span>
        </Link>
        <Link href="/cart" className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Bag ({cart.length})
        </Link>
      </nav>

      <div className="p-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">The Catalog</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <Link href={`/collection/${product.id}`} key={product.id} className="group">
              <div className="aspect-[3/4] bg-neutral-50 border border-neutral-100 mb-4 overflow-hidden relative">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-tight">{product.name}</h3>
              <p className="text-[10px] text-gray-500 mt-1">${product.price}.00</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}