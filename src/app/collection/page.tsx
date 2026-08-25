import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { formatCurrency } from "@/lib/currency";

export const metadata: Metadata = {
  title: "The Catalog | The Dutchman",
  description: "Browse the full collection of durable, minimalist essentials from The Dutchman.",
};

export default function CollectionPage() {
  return (
    <main className="min-h-screen bg-white text-black font-sans">
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
              <p className="text-[10px] text-gray-500 mt-1">{formatCurrency(product.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
