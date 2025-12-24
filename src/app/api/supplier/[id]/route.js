// import { NextResponse } from "next/server";
// import { createServerSupabaseClient } from "@/lib/supabase/server";

// export async function GET(
//   req,
//   { params }
// ) {
//   const supabase = createServerSupabaseClient();

//   // The supplier_id passed in the URL
//   const supplierId = params.id;

//   if (!supplierId) {
//     return NextResponse.json({ error: "Missing supplier id" }, { status: 400 });
//   }

//   // Example: you have a suppliers table with onboarding progress fields
//   const { data, error } = await supabase
//     .from("suppliers")
//     .select("id, onboarding_status, onboarding_step")
//     .eq("id", supplierId)
//     .single();

//   if (error) {
//     console.error("supplier progress error", error);
//     return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
//   }

//   // fallback: if no explicit status, assume not started
//   const response = {
//     id: data.id,
//     status: data.onboarding_status || "not_started", // "not_started" | "in_progress" | "verified"
//     step: data.onboarding_step || null,              // optional: last completed step
//   };

//   return NextResponse.json(response);
// }

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

