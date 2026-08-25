"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, user, authLoading } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/auth?next=/collection/${product.id}`);
      return;
    }
    await addToCart(product);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-6xl mx-auto px-10 pt-6">
        <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest">
          ← Back to Collection
        </Link>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 p-10 mt-4">
        <div className="flex-1 aspect-[3/4] bg-neutral-50 relative border border-neutral-100 overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority />
        </div>

        <div className="flex-1 space-y-10 py-6">
          <header>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{product.name}</h1>
            <p className="text-xl font-medium text-neutral-600 mt-4">{formatCurrency(product.price)}</p>
          </header>

          <p className="text-sm leading-relaxed text-neutral-500 max-w-md">{product.description}</p>

          <button
            onClick={handleAddToCart}
            disabled={authLoading}
            className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {user ? "Add to Bag" : "Sign In to Add to Bag"}
          </button>
        </div>
      </div>
    </main>
  );
}
