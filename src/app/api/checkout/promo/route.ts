import { NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await validatePromoCode(body?.code);

  if (!result.valid) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({ code: result.code, discountPercent: result.discountPercent });
}
