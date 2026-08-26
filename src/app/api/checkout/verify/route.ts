import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { sendOrderConfirmationEmail } from "@/lib/email";

type OrderItem = { product_id: string; name: string; price: number; quantity: number; size: string };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/checkout/failed", url.origin));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth", url.origin));
  }

  try {
    const admin = createAdminClient();

    const { data: order } = await admin
      .from("orders")
      .select("*")
      .eq("id", reference)
      .eq("user_id", user.id)
      .single();

    if (!order) {
      return NextResponse.redirect(new URL("/checkout/failed", url.origin));
    }

    if (order.status === "paid") {
      return NextResponse.redirect(new URL(`/checkout/success?order=${order.id}`, url.origin));
    }

    const transaction = await verifyPaystackTransaction(reference);
    const amountMatches = transaction.amount === Math.round(Number(order.total) * 100);

    if (transaction.status === "success" && amountMatches) {
      await admin.from("orders").update({ status: "paid" }).eq("id", order.id);
      await supabase.from("cart_items").delete().eq("user_id", user.id);

      const items = (order.items as OrderItem[]) ?? [];
      await Promise.all(
        items.map((item) =>
          admin.rpc("decrement_inventory", {
            p_product_id: item.product_id,
            p_size: item.size,
            p_qty: item.quantity,
          })
        )
      );

      await sendOrderConfirmationEmail({
        to: user.email!,
        orderId: order.id,
        items,
        total: Number(order.total),
        fulfillmentMethod: order.fulfillment_method,
        address: order.address,
      });

      return NextResponse.redirect(new URL(`/checkout/success?order=${order.id}`, url.origin));
    }

    await admin.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.redirect(new URL("/checkout/failed", url.origin));
  } catch {
    return NextResponse.redirect(new URL("/checkout/failed", url.origin));
  }
}
