// import { createClient } from '@supabase/supabase-js';

// import { NextResponse } from 'next/server';

// export async function POST(req) {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ error: "Missing email." }, { status: 400 });
//     }

//     const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
//     const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

//     if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
//       return NextResponse.json({ error: "Supabase environment variables not set." }, { status: 500 });
//     }

//     const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

//     const { data: userData, error: userError } = await supabase.auth.admin.inviteUserByEmail(email);

//     if (userError) {
//       console.error("Invite error:", userError);
//       return NextResponse.json({ error: userError.message }, { status: 500 });
//     }

//     const user_id = userData?.user?.id;
//     if (!user_id) {
//       return NextResponse.json({ error: "User ID not returned." }, { status: 500 });
//     }

//     return NextResponse.json({ user_id });
//   } catch (err) {
//     console.error("Server error:", err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// app/api/admin/invite/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, full_name, role, partner_id, supplier_id } = body;

    if (!email || !role) {
      return NextResponse.json({ error: "Missing email or role" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // 1) Create auth user (service role) — set password to random and send invite via your own email flow if desired
    const tempPassword = Math.random().toString(36).slice(2, 10) + "A!"; // small temp pw
    const { data: createdUser, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // or false depending on your flow
      user_metadata: { full_name, role },
    });

    if (createErr) {
      console.error("create user error", createErr);
      return NextResponse.json({ error: createErr.message || "Failed to create user" }, { status: 500 });
    }

    const userId = createdUser.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "No user id returned" }, { status: 500 });
    }

    // 2) Insert profile record (profiles.user_id -> auth.users.id)
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

    // 3) Add to team tables where appropriate
    if (role === "admin") {
      await supabase.from("admin_team_members").insert([{ user_id: userId }]);
    }
    if (role === "supplier" && supplier_id) {
      await supabase.from("supplier_team_members").insert([{ user_id: userId, supplier_id }]);
    }

    // Optionally: send an email / send password reset link — not covered here

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("invite error", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

