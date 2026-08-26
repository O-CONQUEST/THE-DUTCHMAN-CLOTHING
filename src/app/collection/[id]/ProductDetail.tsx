"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";

type Props = {
  product: Product;
  inventory: Record<string, number>;
  related: Product[];
};

export default function ProductDetail({ product, inventory, related }: Props) {
  const { addToCart, user, authLoading } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );

  const isSoldOut = (size: string) => inventory[size] !== undefined && inventory[size] <= 0;
  const allSoldOut = product.sizes.every((size) => isSoldOut(size));

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/auth?next=/collection/${product.id}`);
      return;
    }
    if (!selectedSize) return;
    await addToCart(product, selectedSize);
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-6xl mx-auto px-10 pt-6">
        <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest">
          ← Back to Collection
        </Link>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 p-10 mt-4">
        <div className="flex-1">
          <div className="aspect-[3/4] bg-neutral-50 relative border border-neutral-100 overflow-hidden">
            <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" priority />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 relative border overflow-hidden ${
                    i === activeImage ? "border-black" : "border-neutral-200"
                  }`}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-10 py-6">
          <header>
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{product.name}</h1>
            <p className="text-xl font-medium text-neutral-600 mt-4">{formatCurrency(product.price)}</p>
          </header>

          <p className="text-sm leading-relaxed text-neutral-500 max-w-md">{product.description}</p>

          {allSoldOut ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Sold Out</p>
          ) : (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3">Size</h2>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => {
                  const soldOut = isSoldOut(size);
                  return (
                    <button
                      key={size}
                      disabled={soldOut}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition ${
                        soldOut
                          ? "border-neutral-100 text-neutral-300 line-through cursor-not-allowed"
                          : selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-neutral-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={authLoading || allSoldOut || (Boolean(user) && !selectedSize)}
            className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition disabled:opacity-40"
          >
            {allSoldOut ? "Sold Out" : user ? "Add to Bag" : "Sign In to Add to Bag"}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-10 pb-20">
          <h2 className="text-[11px] font-bold uppercase tracking-widest mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((item) => (
              <Link href={`/collection/${item.id}`} key={item.id} className="group">
                <div className="aspect-[3/4] bg-neutral-50 border border-neutral-100 mb-4 overflow-hidden relative">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-tight">{item.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1">{formatCurrency(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
