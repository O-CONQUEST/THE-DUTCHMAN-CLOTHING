import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { formatCurrency } from "@/lib/currency";
import FulfillButton from "./FulfillButton";

export const metadata: Metadata = {
  title: "Admin: Orders | The Dutchman",
  robots: { index: false, follow: false },
};

type OrderItem = { product_id: string; name: string; price: number; quantity: number; size: string };

type Order = {
  id: string;
  status: "pending" | "paid" | "failed";
  fulfillment_method: "delivery" | "pickup";
  full_name: string;
  phone: string;
  address: string | null;
  items: OrderItem[];
  total: number;
  fulfilled_at: string | null;
  created_at: string;
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/admin/orders");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    notFound();
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  const list = (orders ?? []) as Order[];

  return (
    <main className="min-h-screen bg-white text-black p-6 font-sans">
      <div className="max-w-5xl mx-auto mt-10">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-10">Incoming Orders</h1>

        {list.length === 0 ? (
          <p className="py-20 text-[10px] uppercase tracking-widest text-neutral-400">No paid orders yet.</p>
        ) : (
          <div className="space-y-8">
            {list.map((order) => (
              <div key={order.id} className="border border-neutral-100 p-8">
                <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                      Order #{order.id.slice(0, 8).toUpperCase()} —{" "}
                      {new Date(order.created_at).toLocaleString("en-NG")}
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-widest mt-1">{order.full_name}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">{order.phone}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      {order.fulfillment_method === "delivery"
                        ? `Delivery: ${order.address}`
                        : "Store pickup"}
                    </p>
                  </div>
                  {order.fulfilled_at ? (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-green-700">
                      Fulfilled {new Date(order.fulfilled_at).toLocaleDateString("en-NG")}
                    </span>
                  ) : (
                    <FulfillButton orderId={order.id} />
                  )}
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
