import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { createClient } from "@/utils/supabase/server";
import ProductDetail from "./ProductDetail";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) return { title: "Product Not Found | The Dutchman" };

  return {
    title: `${product.name} | The Dutchman`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  const supabase = await createClient();
  const { data: inventoryRows } = await supabase
    .from("product_inventory")
    .select("size, quantity")
    .eq("product_id", product.id);

  const inventory: Record<string, number> = {};
  inventoryRows?.forEach((row: { size: string; quantity: number }) => {
    inventory[row.size] = row.quantity;
  });

  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category);
  const related = (sameCategory.length > 0 ? sameCategory : products.filter((p) => p.id !== product.id)).slice(
    0,
    4
  );

  return <ProductDetail product={product} inventory={inventory} related={related} />;
}
