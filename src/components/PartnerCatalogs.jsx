"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link"
import { Warehouse, ArrowUpRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

const REGION_KEYS = [
  { key: "dubai", code: "HUB-DXB" },
  { key: "china", code: "HUB-CAN" },
  { key: "uk", code: "HUB-LON" },
];

export const PartnerCatalogs = () => {
  const { t } = useTranslation();
  const regions = t("partnerCatalogs.regions");

  return (
    <section id="partner-catalogs" className="py-24 lg:py-32 bg-paper-dim border-t border-line">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="font-manifest text-[12px] text-freight-soft tracking-wide mb-4">
            {t("partnerCatalogs.badge").toUpperCase()}
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4 text-balance">
            {t("partnerCatalogs.title")}
          </h2>
          <p className="max-w-2xl text-center mx-auto text-lg text-text-2 leading-relaxed">
            {t("partnerCatalogs.subtitle")}
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-px bg-line border border-line">
          {REGION_KEYS.map((region, index) => (
            <motion.div
              key={region.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group bg-surface p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-freight" strokeWidth={1.75} />
                  <span className="font-display font-extrabold text-2xl">{regions[region.key].name}</span>
                </div>
                <span className="font-manifest text-[11px] text-text-3">{region.code}</span>
              </div>
              <div className="w-11 h-11 flex items-center justify-center border border-line-strong mb-5">
                <Warehouse className="w-5 h-5 text-freight" strokeWidth={1.75} />
              </div>
              <p className="text-sm text-text-2 mb-7 leading-relaxed flex-1">{regions[region.key].desc}</p>
              <Button asChild className="w-full bg-ink hover:bg-ink/90 text-paper rounded-none">
                <Link href={`/products?region=${region.key}`}>
                  {t("partnerCatalogs.viewProducts")}
                  <ArrowUpRight className="ml-auto w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
