import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  req,
  { params }
) {
  const supabase = createServerSupabaseClient();

  const supplierId = params.id;

  if (!supplierId) {
    return NextResponse.json({ error: "Missing supplier id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, onboarding_status, onboarding_step")
    .eq("id", supplierId)
    .single();

  if (error || !data) {
    console.error("supplier progress error", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    status: data.onboarding_status,
    step: data.onboarding_step,
  });
}

