"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export function AuthForm() {
  const supabase = createClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleMagicLink(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email) {
      setError(t("auth.emailRequired"));
      setLoading(false);
      return;
    }
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      setError(error.message);
    } else {
      toast({
        title: t("auth.magicLinkSentTitle"),
        description: t("auth.magicLinkSentDesc")
      });
      setEmail("");
    }
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 md:p-10 space-y-8"
    >
      <div className="flex justify-center items-center gap-3">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white p-3 rounded-2xl">
          <div className="w-10 h-10 flex items-center justify-center font-bold text-xl tracking-tight">
            HC
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-slate-800">Highland</span>
          <span className="text-2xl font-bold text-amber-500">Cargo</span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleMagicLink}>
        <div>
          <label className="block text-sm mb-2 font-semibold text-slate-700" htmlFor="otp-email">
            {t("auth.emailLabel")}
          </label>
          <Input
            id="otp-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
            required
            className="h-12 border-slate-300 focus:border-amber-500"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-white h-12 text-lg" type="submit" disabled={loading}>
          {loading ? t("auth.sending") : t("auth.sendMagicLink")}
        </Button>
      </form>
    </motion.div>
  );
}
