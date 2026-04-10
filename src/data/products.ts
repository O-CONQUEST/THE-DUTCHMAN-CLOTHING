export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "The Mist Beanie",
    price: 10000,
    image: "/clothes/item-1.jpeg",
    description: "Cloud-grey tie-dye knit. A soft, shifting veil for the wanderer who prefers the shadows."
  },
  {
    id: "2",
    name: "The Void Beanie",
    price: 10000,
    image: "/clothes/item-2.jpeg",
    description: "Deep obsidian cotton. A sharp, minimalist crown for navigating the midnight city."
  },
  {
    id: "3",
    name: "The Trinity",
    price: 28000,
    image: "/clothes/item-3.jpeg",
    description: "The essential headwear collection. Three distinct textures to suit every phase of the journey."
  },
  {
    id: "4",
    name: "The Shadow Flares",
    price: 15000,
    image: "/clothes/item-4.jpeg",
    description: "Obsidian flares etched with the mark. Movement in its darkest, most elegant form."
  },
  {
    id: "5",
    name: "The Slate Sweats",
    price: 15000,
    image: "/clothes/item-5.jpeg",
    description: "Understated grey for the modern wanderer. Even in neutral tones, the Dutchman’s presence is absolute."
  }
  // Keep adding up to item-8 here...
];