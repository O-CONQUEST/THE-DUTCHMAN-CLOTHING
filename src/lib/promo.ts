import { createAdminClient } from "@/utils/supabase/admin";

export type PromoResult =
  | { valid: true; code: string; discountPercent: number }
  | { valid: false; reason: string };

export async function validatePromoCode(rawCode: unknown): Promise<PromoResult> {
  if (typeof rawCode !== "string" || !rawCode.trim()) {
    return { valid: false, reason: "No code provided." };
  }
  const code = rawCode.trim().toUpperCase();

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { valid: false, reason: "Promo codes aren't available right now." };
  }

  const { data, error } = await admin
    .from("promo_codes")
    .select("code, discount_percent, active, expires_at")
    .eq("code", code)
    .single();

  if (error || !data) return { valid: false, reason: "Invalid promo code." };
  if (!data.active) return { valid: false, reason: "This code is no longer active." };
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, reason: "This code has expired." };
  }

  return { valid: true, code: data.code, discountPercent: data.discount_percent };
}
