import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { products } from "@/data/products";
import { initializePaystackTransaction } from "@/lib/paystack";

type CheckoutBody = {
  fulfillmentMethod: "delivery" | "pickup";
  fullName: string;
  phone: string;
  address?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "You must be signed in to check out." }, { status: 401 });
  }

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { fulfillmentMethod, fullName, phone, address } = body;

  if (fulfillmentMethod !== "delivery" && fulfillmentMethod !== "pickup") {
    return NextResponse.json({ error: "Invalid fulfillment method." }, { status: 400 });
  }
  if (!fullName?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }
  if (fulfillmentMethod === "delivery" && !address?.trim()) {
    return NextResponse.json({ error: "Delivery address is required." }, { status: 400 });
  }

  const { data: rows, error: cartError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id);

  if (cartError || !rows || rows.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const items = rows
    .map((row: { product_id: string; quantity: number }) => {
      const product = products.find((p) => p.id === row.product_id);
      if (!product) return null;
      return {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: row.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (items.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = crypto.randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    user_id: user.id,
    status: "pending",
    fulfillment_method: fulfillmentMethod,
    full_name: fullName.trim(),
    phone: phone.trim(),
    address: fulfillmentMethod === "delivery" ? address!.trim() : null,
    items,
    subtotal: total,
    total,
    paystack_reference: orderId,
  });

  if (orderError) {
    return NextResponse.json(
      { error: "Couldn't create your order. Please try again." },
      { status: 500 }
    );
  }

  const origin = new URL(request.url).origin;

  try {
    const transaction = await initializePaystackTransaction({
      email: user.email,
      amountKobo: Math.round(total * 100),
      reference: orderId,
      callbackUrl: `${origin}/api/checkout/verify`,
      metadata: { order_id: orderId },
    });

    return NextResponse.json({ authorizationUrl: transaction.authorization_url });
  } catch (err) {
    await supabase.from("orders").update({ status: "failed" }).eq("id", orderId);
    const message = err instanceof Error ? err.message : "Payment initialization failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
