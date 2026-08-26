"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/data/products";
import { formatCurrency } from "@/lib/currency";

const CATEGORIES: (Category | "All")[] = ["All", "Headwear", "Bottoms"];

export default function CollectionGrid({
  products,
  soldOutMap,
}: {
  products: Product[];
  soldOutMap: Record<string, boolean>;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
        <input
          type="text"
          placeholder="SEARCH"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-b border-black py-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none bg-transparent flex-1 max-w-xs"
        />
        <div className="flex gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition ${
                category === c ? "border-black bg-black text-white" : "border-neutral-200 hover:border-black"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 py-20">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((product) => {
            const soldOut = soldOutMap[product.id];
            return (
              <Link href={`/collection/${product.id}`} key={product.id} className="group">
                <div className="aspect-[3/4] bg-neutral-50 border border-neutral-100 mb-4 overflow-hidden relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className={`object-cover group-hover:scale-105 transition-transform duration-1000 ${
                      soldOut ? "opacity-40" : ""
                    }`}
                  />
                  {soldOut && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1">
                      Sold Out
                    </span>
                  )}
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-tight">{product.name}</h3>
                <p className="text-[10px] text-gray-500 mt-1">{formatCurrency(product.price)}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
