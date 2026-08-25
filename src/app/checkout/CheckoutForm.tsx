"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/currency";

// TODO: replace with your actual store/studio address.
const PICKUP_LOCATION = "The Dutchman Studio, 12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria";

export default function CheckoutForm() {
  const { cart, subtotal, user, authLoading, showToast } = useCart();
  const router = useRouter();

  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth?next=/checkout");
      return;
    }
    if (cart.length === 0) {
      router.replace("/cart");
    }
  }, [authLoading, user, cart.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentMethod: method,
          fullName,
          phone,
          address: method === "delivery" ? address : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.authorizationUrl;
    } catch {
      showToast("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (authLoading || !user || cart.length === 0) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black p-6 font-sans">
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex justify-between items-end mb-10">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Checkout</h1>
          <Link
            href="/cart"
            className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1"
          >
            Back to Bag
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-16">
          <form onSubmit={handleSubmit} className="flex-[2] space-y-10">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest mb-4">Fulfillment</h2>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMethod("delivery")}
                  className={`flex-1 border py-4 text-[10px] font-bold uppercase tracking-widest transition ${
                    method === "delivery"
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 hover:border-black"
                  }`}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("pickup")}
                  className={`flex-1 border py-4 text-[10px] font-bold uppercase tracking-widest transition ${
                    method === "pickup"
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 hover:border-black"
                  }`}
                >
                  Pickup
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-[11px] font-bold uppercase tracking-widest">Contact</h2>
              <input
                type="text"
                placeholder="FULL NAME"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black normal-case"
              />
              <input
                type="tel"
                placeholder="PHONE NUMBER"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black normal-case"
              />

              {method === "delivery" ? (
                <textarea
                  placeholder="DELIVERY ADDRESS"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full border-b border-black py-3 text-[10px] tracking-widest focus:outline-none font-bold bg-transparent text-black normal-case resize-none"
                />
              ) : (
                <div className="bg-neutral-50 p-4 text-[10px] uppercase tracking-widest text-neutral-500">
                  Pickup location: {PICKUP_LOCATION}
                </div>
              )}
            </div>

            <button
              disabled={submitting}
              className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] hover:opacity-80 transition disabled:opacity-50"
            >
              {submitting ? "Redirecting to Paystack..." : "Pay with Paystack"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="flex-1 bg-neutral-50 p-10 h-fit">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">Order Summary</h2>
            <div className="space-y-4 border-b border-neutral-200 pb-6">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex justify-between text-[10px] font-bold uppercase tracking-widest"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between py-8">
              <span className="text-xl font-black uppercase tracking-tighter">Total</span>
              <span className="text-xl font-black uppercase tracking-tighter">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
