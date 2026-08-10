"use client";

import { Button } from "@/components/ui/button";
import { Search, Truck, Package, FileText, Phone, CreditCard, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const Support = () => {
  const { t } = useTranslation();
  const icons = [Search, Truck, Package, FileText, Phone, CreditCard];
  const supportItems = t("support.items").map((item, i) => ({
    ...item,
    icon: icons[i],
    code: `SUP-0${i + 1}`,
  }));

  return (
    <section id="support" className="py-24 lg:py-32 bg-surface border-t border-line">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 hc-reveal">
          <div className="font-manifest text-[12px] text-freight-soft tracking-wide mb-4">
            {t("support.badge").toUpperCase()}
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4 text-balance">{t("support.title")}</h2>
          <p className="text-lg text-text-2 max-w-2xl mx-auto leading-relaxed">
            {t("support.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line mb-14">
          {supportItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group bg-surface p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-11 h-11 flex items-center justify-center border border-line-strong">
                  <item.icon className="w-5 h-5 text-freight" strokeWidth={1.75} />
                </div>
                <span className="font-manifest text-[11px] text-text-3">{item.code}</span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-text-2 leading-relaxed mb-6 flex-1">{item.description}</p>
              <Button
                variant="ghost"
                className="w-full justify-start px-0 rounded-none text-ink hover:bg-transparent hover:text-freight border-t border-line pt-4"
              >
                {t("support.clickToKnowMore")}
                <ArrowUpRight className="ml-auto w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-ink text-paper p-10 md:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-beacon" />
          <h3 className="font-display font-extrabold text-2xl md:text-3xl mb-4 text-balance">{t("support.vatTitle")}</h3>
          <p className="text-paper/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("support.vatText")}
          </p>
          <Button variant="ghost" className="border border-paper/25 text-paper hover:bg-paper/10 hover:text-paper rounded-none px-7">
            {t("support.viewFaqs")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
