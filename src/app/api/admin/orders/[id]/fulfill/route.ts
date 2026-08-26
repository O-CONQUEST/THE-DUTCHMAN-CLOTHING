import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Not configured.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const { error } = await admin.from("orders").update({ fulfilled_at: new Date().toISOString() }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Couldn't update order." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
