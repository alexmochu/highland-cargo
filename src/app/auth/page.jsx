"use client"

import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let unsub;
//     async function checkSession() {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session) {
//         navigate("/", { replace: true });
//       } else {
//         setLoading(false);
//       }
//     }
//     checkSession();
//     unsub = supabase.auth.onAuthStateChange((_evt, session) => {
//       if (session) {
//         navigate("/", { replace: true });
//       }
//     });
//     return () => {
//       if (unsub && typeof unsub.subscription?.unsubscribe === "function") {
//         unsub.subscription.unsubscribe();
//       }
//     };
//   }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-gradient-to-tr from-orange-50 via-blue-50 to-orange-100">
      <AuthForm />
    </div>
  );
}
