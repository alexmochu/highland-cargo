import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
  req,
  { params }
) {
  try {
    const { status } = await req.json(); // "verified" or "rejected"
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
