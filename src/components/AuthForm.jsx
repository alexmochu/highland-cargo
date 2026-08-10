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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md bg-surface border border-line p-8 md:p-10 space-y-8 relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[3px] bg-beacon" />
      <div className="flex justify-center items-center gap-3">
        <div className="bg-ink text-paper w-11 h-11 flex items-center justify-center font-display font-extrabold text-lg">
          HC
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display font-extrabold text-xl">HIGHLAND</span>
          <span className="font-display font-extrabold text-xl text-freight">CARGO</span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleMagicLink}>
        <div>
          <label className="block text-sm mb-2 font-semibold text-text-2" htmlFor="otp-email">
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
            className="h-12 rounded-none border-line-strong focus-visible:border-freight focus-visible:ring-freight/20"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button className="w-full mt-2 bg-ink hover:bg-ink/90 text-paper rounded-none h-12 text-base" type="submit" disabled={loading}>
          {loading ? t("auth.sending") : t("auth.sendMagicLink")}
        </Button>
      </form>
    </motion.div>
  );
}
