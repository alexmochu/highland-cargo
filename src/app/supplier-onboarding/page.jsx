"use client"
import Stepper from "./Stepper";
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client";

export default function SupplierOnboardingPage() {
  const supabase = createClient()
  const { user } = useAuth()

  // const auth = await supabase.auth.get;
  console.log('auth', user)
  if (!user) return <div>Please login</div>;

  //Load supplier_id from profile
  const { data: profile } = supabase
    .from("profiles")
    .select("supplier_id")
    .eq("user_id", user.id)
    .single();

  if (profile?.supplier_id) {
    // check if supplier is already verified
    const { data: supplier } = supabase
      .from("suppliers")
      .select("id, onboarding_step, supplier_status")
      .eq("id", profile.supplier_id)
      .single();

    if (supplier?.supplier_status === "verified") {
      return <div>You’re already verified ✅ Redirecting to dashboard...</div>;
    }

    return <Stepper userId={user.id} supplierId={profile.supplier_id} />;
  }

  // New supplier, start onboarding from scratch
  return <Stepper userId={user.id} supplierId={null} />;
}

