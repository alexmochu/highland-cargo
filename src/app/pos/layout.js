"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { canViewModule } from "@/lib/permissions";
import { Loader2, ShieldAlert } from "lucide-react";

export default function POSLayout({ children }) {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [rolesByName, setRolesByName] = useState({});
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.push("/auth");
  }, [authLoading, user, router]);

  useEffect(() => {
    let active = true;
    supabase.from("roles").select("*").then(({ data }) => {
      if (!active) return;
      const map = {};
      (data || []).forEach(r => { map[r.name] = r; });
      setRolesByName(map);
      setRolesLoading(false);
    });
    return () => { active = false; };
  }, [supabase]);

  if (authLoading || rolesLoading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-slate-800 animate-spin mb-3" />
        <p className="text-slate-500 font-medium">Loading POS terminal...</p>
      </div>
    );
  }

  if (!canViewModule(profile, rolesByName, "pos")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <ShieldAlert className="w-14 h-14 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-500 text-center max-w-md">You don&apos;t have permission to use the POS terminal.</p>
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-100">{children}</div>;
}
