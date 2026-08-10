"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export default function ChooseRolePage() {
  const supabase = createClient();
  const router = useRouter();
  const { t } = useTranslation();

  async function chooseRole(role) {
    await supabase.from("profiles").update({ role }).eq("user_id", (await supabase.auth.getUser()).data.user.id);
    if (role === "supplier") router.push("/supplier-onboarding");
    else router.push("/partner-onboarding");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-dim p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-line shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-ink">{t("chooseRole.supplierTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-text-2">{t("chooseRole.supplierDesc")}</p>
              <Button className="w-full bg-ink hover:bg-ink/90 text-paper h-12 text-lg" onClick={() => chooseRole("supplier")}>
                {t("chooseRole.supplierButton")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-line shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-ink">{t("chooseRole.partnerTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-text-2">{t("chooseRole.partnerDesc")}</p>
              <Button className="w-full bg-beacon hover:bg-beacon/90 text-ink font-semibold h-12 text-lg" onClick={() => chooseRole("partner")}>
                {t("chooseRole.partnerButton")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
