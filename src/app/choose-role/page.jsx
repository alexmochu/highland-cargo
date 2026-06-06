"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ChooseRolePage() {
  const supabase = createClient();
  const router = useRouter();

  async function chooseRole(role) {
    await supabase.from("profiles").update({ role }).eq("user_id", (await supabase.auth.getUser()).data.user.id);
    if (role === "supplier") router.push("/supplier-onboarding");
    else router.push("/partner-onboarding");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800">Join as a Supplier</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-slate-600">Showcase your products and unlock access to partners.</p>
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white h-12 text-lg" onClick={() => chooseRole("supplier")}>
                Start Supplier Onboarding
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800">Join as a Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-slate-600">Gain access to supplier catalogs and streamline orders.</p>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-lg" onClick={() => chooseRole("partner")}>
                Start Partner Onboarding
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
