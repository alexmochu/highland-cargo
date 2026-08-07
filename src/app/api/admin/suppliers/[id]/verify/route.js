import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/adminGuard";

export async function PATCH(
  req,
  { params }
) {
  try {
    const guard = await requireAdmin();
    if (!guard.authorized) {
      return NextResponse.json({ error: guard.message }, { status: guard.status });
    }

    const { status } = await req.json(); // "verified" or "rejected"
    if (!["verified", "rejected"].includes(status)) {
      return NextResponse.json({ error: "status must be 'verified' or 'rejected'" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("suppliers")
      .update({ onboarding_status: status })
      .eq("id", params.id);

    if (error) {
      console.error("supplier verify error", error);
      return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
