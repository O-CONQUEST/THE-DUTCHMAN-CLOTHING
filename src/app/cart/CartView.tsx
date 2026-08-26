"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/currency";

export default function CartView() {
  const { cart, removeFromCart, updateQuantity, subtotal, user, authLoading } = useCart();

  return (
    <main className="min-h-screen bg-white text-black p-6 font-sans">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex justify-between items-end mb-10">
          <h1 className="text-6xl font-black uppercase tracking-tighter italic">Your Bag</h1>
          <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Items List */}
          <div className="flex-[2] border-t border-black">
            {authLoading ? (
              <p className="py-20 text-[10px] uppercase tracking-widest text-neutral-400">Loading...</p>
            ) : !user ? (
              <p className="py-20 text-[10px] uppercase tracking-widest text-neutral-400">
                <Link href="/auth?next=/cart" className="underline">Sign in</Link> to view your bag.
              </p>
            ) : cart.length === 0 ? (
              <p className="py-20 text-[10px] uppercase tracking-widest text-neutral-400">Your bag is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="flex gap-6 py-10 border-b border-neutral-100 items-center">
                  <div className="w-24 h-32 bg-neutral-50 relative flex-shrink-0">
                    {item.images[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-[12px] font-bold uppercase tracking-widest">
                      {item.name || "Original Fit"}
                    </h2>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                      Size: {item.size}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 border border-black text-[10px] font-bold hover:bg-black hover:text-white transition"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 border border-black text-[10px] font-bold hover:bg-black hover:text-white transition"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-[9px] uppercase tracking-widest text-red-500 mt-4 font-bold hover:opacity-60 transition"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-[12px] font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Section */}
          <div className="flex-1 bg-neutral-50 p-10 h-fit">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Summary</h2>
            <div className="space-y-4 border-b border-neutral-200 pb-6">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="flex justify-between py-8">
              <span className="text-2xl font-black uppercase tracking-tighter">Total</span>
              <span className="text-2xl font-black uppercase tracking-tighter">
                {formatCurrency(subtotal)}
              </span>
            </div>
            {cart.length === 0 ? (
              <button
                disabled
                className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] disabled:opacity-30"
              >
                Checkout
              </button>
            ) : (
              <Link href="/checkout">
                <button className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-80 transition">
                  Checkout
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
