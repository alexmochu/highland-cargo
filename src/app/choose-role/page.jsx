"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ChooseRolePage() {
  const supabase = useSupabase();
  const router = useRouter();

  async function chooseRole(role: "supplier" | "partner") {
    await supabase.from("profiles").update({ role }).eq("user_id", (await supabase.auth.getUser()).data.user.id);
    if (role === "supplier") router.push("/supplier-onboarding");
    else router.push("/partner-onboarding");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Join as a Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Showcase your products and unlock access to partners.</p>
            <Button className="w-full" onClick={() => chooseRole("supplier")}>
              Start Supplier Onboarding
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Join as a Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Gain access to supplier catalogs and streamline orders.</p>
            <Button className="w-full" onClick={() => chooseRole("partner")}>
              Start Partner Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
