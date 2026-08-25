import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { verifyPaystackTransaction } from "@/lib/paystack";

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

  const { data: order } = await supabase
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

  try {
    const transaction = await verifyPaystackTransaction(reference);
    const amountMatches = transaction.amount === Math.round(Number(order.total) * 100);

    if (transaction.status === "success" && amountMatches) {
      await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);
      await supabase.from("cart_items").delete().eq("user_id", user.id);
      return NextResponse.redirect(new URL(`/checkout/success?order=${order.id}`, url.origin));
    }

    await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.redirect(new URL("/checkout/failed", url.origin));
  } catch {
    return NextResponse.redirect(new URL("/checkout/failed", url.origin));
  }
}
