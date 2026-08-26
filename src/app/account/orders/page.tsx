import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { formatCurrency } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Order History | The Dutchman",
  robots: { index: false, follow: false },
};

type OrderItem = { product_id: string; name: string; price: number; quantity: number; size: string };

type Order = {
  id: string;
  status: "pending" | "paid" | "failed";
  fulfillment_method: "delivery" | "pickup";
  address: string | null;
  items: OrderItem[];
  total: number;
  created_at: string;
};

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/account/orders");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  const list = (orders ?? []) as Order[];

  return (
    <main className="min-h-screen bg-white text-black p-6 font-sans">
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex justify-between items-end mb-10">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Your Orders</h1>
          <Link
            href="/collection"
            className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1"
          >
            Continue Shopping
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="py-20 text-[10px] uppercase tracking-widest text-neutral-400">
            You haven&apos;t placed any orders yet.
          </p>
        ) : (
          <div className="space-y-8">
            {list.map((order) => (
              <div key={order.id} className="border border-neutral-100 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                    {order.fulfillment_method === "delivery" ? "Delivery" : "Pickup"}
                  </p>
                </div>

                <div className="space-y-2 border-t border-neutral-100 pt-4">
                  {order.items.map((item) => (
                    <div
                      key={`${item.product_id}-${item.size}`}
                      className="flex justify-between text-[10px] font-bold uppercase tracking-widest"
                    >
                      <span>
                        {item.name} ({item.size}) × {item.quantity}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 mt-4 border-t border-neutral-100 text-[11px] font-black uppercase tracking-widest">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
