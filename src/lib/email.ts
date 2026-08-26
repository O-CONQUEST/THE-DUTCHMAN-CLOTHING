import { Resend } from "resend";
import { formatCurrency } from "@/lib/currency";

type OrderEmailItem = { name: string; price: number; quantity: number; size: string };

type SendOrderConfirmationParams = {
  to: string;
  orderId: string;
  items: OrderEmailItem[];
  total: number;
  fulfillmentMethod: "delivery" | "pickup";
  address: string | null;
};

export async function sendOrderConfirmationEmail(params: SendOrderConfirmationParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured; skipping order confirmation email.");
    return;
  }

  const resend = new Resend(apiKey);

  const itemsHtml = params.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0;">${item.name} (${item.size}) &times; ${item.quantity}</td><td style="padding:6px 0; text-align:right;">${formatCurrency(item.price * item.quantity)}</td></tr>`
    )
    .join("");

  const fulfillmentLine =
    params.fulfillmentMethod === "delivery"
      ? `Delivering to: ${params.address ?? ""}`
      : "Ready for pickup at your store location.";

  try {
    await resend.emails.send({
      // resend.dev only delivers to the account owner's own email until a
      // custom domain is verified in the Resend dashboard. Swap this once
      // you've verified your own sending domain.
      from: "The Dutchman <onboarding@resend.dev>",
      to: params.to,
      subject: `Order Confirmed — #${params.orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
          <h1 style="font-size: 20px; text-transform: uppercase; letter-spacing: 0.05em;">Order Confirmed</h1>
          <p>Thanks for shopping with The Dutchman. Here's what you bought:</p>
          <table style="width:100%; border-collapse: collapse;">${itemsHtml}</table>
          <p style="font-weight:bold; margin-top:16px;">Total: ${formatCurrency(params.total)}</p>
          <p>${fulfillmentLine}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}
