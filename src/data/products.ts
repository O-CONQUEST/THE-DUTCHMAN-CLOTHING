export type Category = "Headwear" | "Bottoms";

export interface Product {
  id: string;
  name: string;
  price: number;
  /** First image is the primary/cover photo. Add more paths here to enable the gallery. */
  images: string[];
  description: string;
  category: Category;
  sizes: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "The Mist Beanie",
    price: 10000,
    images: ["/clothes/item-1.jpeg"],
    description: "Cloud-grey tie-dye knit. A soft, shifting veil for the wanderer who prefers the shadows.",
    category: "Headwear",
    sizes: ["One Size"]
  },
  {
    id: "2",
    name: "The Void Beanie",
    price: 10000,
    images: ["/clothes/item-2.jpeg"],
    description: "Deep obsidian cotton. A sharp, minimalist crown for navigating the midnight city.",
    category: "Headwear",
    sizes: ["One Size"]
  },
  {
    id: "3",
    name: "The Trinity",
    price: 28000,
    images: ["/clothes/item-3.jpeg"],
    description: "The essential headwear collection. Three distinct textures to suit every phase of the journey.",
    category: "Headwear",
    sizes: ["One Size"]
  },
  {
    id: "4",
    name: "The Shadow Flares",
    price: 15000,
    images: ["/clothes/item-4.jpeg"],
    description: "Obsidian flares etched with the mark. Movement in its darkest, most elegant form.",
    category: "Bottoms",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "5",
    name: "The Slate Sweats",
    price: 15000,
    images: ["/clothes/item-5.jpeg"],
    description: "Understated grey for the modern wanderer. Even in neutral tones, the Dutchman’s presence is absolute.",
    category: "Bottoms",
    sizes: ["S", "M", "L", "XL"]
  }
];
