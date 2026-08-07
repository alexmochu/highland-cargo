import { createClient } from "@/lib/supabase";

// Verifies the caller has a valid session AND an admin profile.
// Must run before any handler touches the service-role client.
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { authorized: false, status: 401, message: "Authentication required" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile?.is_admin) {
    return { authorized: false, status: 403, message: "Admin access required" };
  }

  return { authorized: true, user };
}
