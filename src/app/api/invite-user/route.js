// app/api/admin/invite/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/adminGuard";

const ALLOWED_ROLES = ["admin", "manager", "accountant", "warehouse_staff", "sales_agent", "cashier", "supplier", "partner"];

export async function POST(req) {
  try {
    const guard = await requireAdmin();
    if (!guard.authorized) {
      return NextResponse.json({ error: guard.message }, { status: guard.status });
    }

    const body = await req.json();
    const { email, full_name, role, partner_id, supplier_id } = body;

    if (!email || !role) {
      return NextResponse.json({ error: "Missing email or role" }, { status: 400 });
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ error: `role must be one of ${ALLOWED_ROLES.join(", ")}` }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data: createdUser, error: createErr } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    });

    if (createErr) {
      console.error("create user error", createErr);
      return NextResponse.json({ error: createErr.message || "Failed to create user" }, { status: 500 });
    }

    const userId = createdUser.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "No user id returned" }, { status: 500 });
    }

    const { error: profErr } = await supabase.from("profiles").insert([{
      user_id: userId,
      email,
      full_name: full_name || null,
      role,
      partner_id: role === "partner" ? partner_id || null : null,
      supplier_id: role === "supplier" ? supplier_id || null : null,
      is_admin: role === "admin" ? true : false,
    }]);

    if (profErr) {
      console.error("profile insert error", profErr);
      return NextResponse.json({ error: profErr.message || "Failed to create profile" }, { status: 500 });
    }

    if (role === "admin") {
      await supabase.from("admin_team_members").insert([{ user_id: userId }]);
    }
    if (role === "supplier" && supplier_id) {
      await supabase.from("supplier_team_members").insert([{ user_id: userId, supplier_id }]);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("invite error", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

