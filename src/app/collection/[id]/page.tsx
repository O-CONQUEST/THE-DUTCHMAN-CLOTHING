import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
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
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
