"use client"
import Stepper from "./Stepper";
import { useAuth } from "@/components/auth-provider"
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function SupplierOnboardingPage() {
  const supabase = createClient()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadData() {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("supplier_id")
        .eq("user_id", user.id)
        .single();
      
      setProfile(profileData);

      if (profileData?.supplier_id) {
        const { data: supplierData } = await supabase
          .from("suppliers")
          .select("id, onboarding_step, onboarding_status")
          .eq("id", profileData.supplier_id)
          .single();
        setSupplier(supplierData);
      }
      
      setLoading(false);
    }
    loadData();
  }, [supabase, user]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-lg text-slate-600">Loading...</p>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-lg text-slate-600">Please login</p>
    </div>
  );

  if (supplier?.onboarding_status === "verified") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">You’re already verified ✅</h1>
          <p className="text-lg text-slate-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (profile?.supplier_id) {
    return <Stepper userId={user.id} supplierId={profile.supplier_id} />;
  }

  return <Stepper userId={user.id} supplierId={null} />;
}

