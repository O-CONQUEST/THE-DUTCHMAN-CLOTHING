"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/lib/currency";

type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  fulfillment_method: "delivery" | "pickup";
  address: string | null;
  items: OrderItem[];
  total: number;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single()
      .then(({ data }) => {
        setOrder(data);
        setLoading(false);
      });
  }, [orderId]);

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center text-center px-10 py-20 font-sans">
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.6em] mb-6">Thank You</p>
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
        Order Confirmed
      </h1>
      <p className="text-sm text-neutral-500 max-w-md mb-10">
        Your payment was successful. A confirmation will be sent to your email shortly.
      </p>

      {loading ? null : order ? (
        <div className="w-full max-w-sm bg-neutral-50 p-8 text-left mb-14">
          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-4">
            {order.fulfillment_method === "delivery" ? `Delivery to ${order.address}` : "Store Pickup"}
          </p>
          <div className="space-y-2 border-t border-neutral-200 pt-4">
            {order.items.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between text-[10px] font-bold uppercase tracking-widest"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t border-neutral-200 text-[11px] font-black uppercase tracking-widest">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      ) : null}

      <Link href="/collection">
        <button className="border border-black bg-black text-white px-16 py-5 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-white hover:text-black">
          Continue Shopping
        </button>
      </Link>
    </main>
  );
}

export default function SuccessView() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
