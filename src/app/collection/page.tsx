import type { Metadata } from "next";
import { products } from "@/data/products";
import { createClient } from "@/utils/supabase/server";
import CollectionGrid from "./CollectionGrid";

export const metadata: Metadata = {
  title: "The Catalog | The Dutchman",
  description: "Browse the full collection of durable, minimalist essentials from The Dutchman.",
};

export default async function CollectionPage() {
  const supabase = await createClient();
  const { data: allInventory } = await supabase
    .from("product_inventory")
    .select("product_id, size, quantity");

  const invMap: Record<string, Record<string, number>> = {};
  allInventory?.forEach((row: { product_id: string; size: string; quantity: number }) => {
    invMap[row.product_id] = invMap[row.product_id] || {};
    invMap[row.product_id][row.size] = row.quantity;
  });

  const soldOutMap: Record<string, boolean> = {};
  products.forEach((product) => {
    const sizes = invMap[product.id];
    soldOutMap[product.id] = sizes
      ? product.sizes.every((size) => (sizes[size] ?? Infinity) <= 0)
      : false;
  });

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <div className="p-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">The Catalog</h2>
        <CollectionGrid products={products} soldOutMap={soldOutMap} />
      </div>
    </main>
  );
}
