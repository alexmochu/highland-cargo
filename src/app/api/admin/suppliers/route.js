import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("get suppliers error", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
  }

  return NextResponse.json({ suppliers: data });
}
