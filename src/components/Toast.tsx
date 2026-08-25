"use client";

import { useCart } from "@/context/CartContext";

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
      {toast}
    </div>
  );
}
