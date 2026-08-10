"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const NewsletterSignup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    if (email.length > 5 && email.includes('@')) setSubmitted(true);
  }

  return (
    <section className="py-24 bg-paper-dim">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-ink text-paper max-w-3xl mx-auto p-10 md:p-14 flex flex-col items-center text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-beacon" />
          <div className="flex items-center gap-3">
            <Mail className="text-beacon w-6 h-6" />
            <span className="font-manifest text-[12px] text-paper/60 tracking-wide">{t("newsletter.title").toUpperCase()}</span>
          </div>
          <h3 className="font-display font-extrabold text-3xl md:text-4xl text-balance">{t("newsletter.heading")}</h3>
          <form onSubmit={onSubmit} className="flex w-full max-w-md gap-3 flex-col sm:flex-row">
            <Input
              className="flex-1 h-12 rounded-none bg-paper/5 border-paper/20 text-paper placeholder:text-paper/40 focus-visible:border-beacon focus-visible:ring-beacon/30"
              disabled={submitted}
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-beacon hover:bg-beacon/90 text-ink font-semibold rounded-none h-12 px-8" disabled={submitted}>
              {submitted ? t("newsletter.subscribed") : t("newsletter.signUp")}
            </Button>
          </form>
          {submitted && <p className="text-beacon font-medium text-sm">{t("newsletter.thankYou")}</p>}
        </motion.div>
      </div>
    </section>
  );
}
