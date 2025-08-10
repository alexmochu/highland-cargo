import { createClient } from '@supabase/supabase-js';

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email." }, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase environment variables not set." }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data: userData, error: userError } = await supabase.auth.admin.inviteUserByEmail(email);

    if (userError) {
      console.error("Invite error:", userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const user_id = userData?.user?.id;
    if (!user_id) {
      return NextResponse.json({ error: "User ID not returned." }, { status: 500 });
    }

    return NextResponse.json({ user_id });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
