"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-paper text-ink overflow-hidden">
      <div className="container mx-auto px-4 pt-16 pb-14 lg:pt-24 lg:pb-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border border-line-strong bg-surface-raised font-manifest text-[12px] text-freight-soft">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-beacon opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-beacon" />
              </span>
              {t("hero.eyebrow")}
            </div>

            <h1 className="font-display font-extrabold text-[44px] leading-[0.96] sm:text-6xl lg:text-7xl mb-6 text-balance max-w-2xl">
              {t("hero.titleLine1")}
              <br />
              <span className="text-freight">{t("hero.titleLine2")}</span>
            </h1>

            <p className="text-base sm:text-lg text-text-2 mb-9 leading-relaxed max-w-xl">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group bg-ink hover:bg-ink text-paper text-base px-7 py-6 rounded-none transition-transform hover:-translate-y-0.5"
              >
                {t("hero.requestQuote")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-ink text-base px-1 py-6 rounded-none border-b border-line-strong hover:border-ink hover:bg-transparent"
              >
                {t("hero.trackPackage")}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="border border-line bg-surface-raised p-5"
          >
            <div className="flex items-baseline justify-between font-manifest text-[11px] tracking-wide text-text-3 mb-4">
              <span>{t("hero.routeStatusLabel").toUpperCase()}</span>
              <b className="text-text-2 font-semibold">{t("hero.routeStatusValue").toUpperCase()}</b>
            </div>

            <svg viewBox="0 0 380 170" className="w-full h-auto block">
              <path
                d="M28,34 C120,20 220,120 350,138"
                fill="none"
                stroke="var(--color-freight-soft)"
                strokeWidth="1.6"
                strokeDasharray="3 4"
                opacity="0.5"
              />
              <path
                d="M28,34 C120,20 220,120 350,138"
                fill="none"
                stroke="var(--color-beacon)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeDasharray="340"
                strokeDashoffset="340"
                style={{ animation: "hc-draw 2.6s cubic-bezier(.4,0,.2,1) 0.6s forwards" }}
              />
              <circle cx="28" cy="34" r="4" fill="var(--color-surface-raised)" stroke="var(--color-text-2)" strokeWidth="1.4" />
              <text x="14" y="20" className="font-manifest" style={{ fontSize: 9.5, fill: "var(--color-text-3)" }}>GZ</text>
              <circle cx="350" cy="138" r="5" fill="var(--color-beacon)" stroke="var(--color-beacon)" />
              <text x="322" y="158" className="font-manifest" style={{ fontSize: 9.5, fill: "var(--color-text-3)" }}>NBO</text>
            </svg>

            <div className="flex justify-between mt-3 pt-3 border-t border-dashed border-line">
              <div className="text-[10.5px] text-text-3 tracking-wide">
                {t("hero.etaLabel").toUpperCase()}
                <b className="block text-[13px] text-ink font-semibold mt-0.5">{t("hero.etaValue")}</b>
              </div>
              <div className="text-[10.5px] text-text-3 tracking-wide text-right">
                {t("hero.customsLabel").toUpperCase()}
                <b className="block text-[13px] text-ink font-semibold mt-0.5">{t("hero.customsValue")}</b>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 lg:pb-28 hc-reveal">
        <div className="flex flex-wrap gap-3.5">
          {[
            { num: t("hero.tag1Num"), label: t("hero.tag1Label") },
            { num: t("hero.tag2Num"), label: t("hero.tag2Label") },
            { num: t("hero.tag3Num"), label: t("hero.tag3Label") },
            { num: t("hero.tag4Num"), label: t("hero.tag4Label") },
          ].map((tag, i) => (
            <div key={i} className="relative flex-1 min-w-[190px] bg-surface border border-line px-5 py-4">
              <div className="font-display font-extrabold text-3xl text-freight leading-none">{tag.num}</div>
              <div className="text-[12.5px] text-text-2 mt-1.5">{tag.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
