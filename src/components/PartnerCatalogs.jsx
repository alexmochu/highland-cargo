"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link"
import { Warehouse, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const PARTNER_REGIONS = [
  {
    region: "Dubai",
    code: "HUB-DXB",
    emoji: "🇦🇪",
    desc: "Best selection of electronics, fashion and more from Dubai.",
    catalogQuery: "dubai",
  },
  {
    region: "China",
    code: "HUB-CAN",
    emoji: "🇨🇳",
    desc: "Manufacturing powerhouse. Direct deals on all categories from China.",
    catalogQuery: "china",
  },
  {
    region: "UK",
    code: "HUB-LON",
    emoji: "🇬🇧",
    desc: "Premium UK products, trusted European brands and more.",
    catalogQuery: "uk",
  },
];

export const PartnerCatalogs = () => (
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
          GLOBAL PARTNERS
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4 text-balance">
          Partner product catalogs
        </h2>
        <p className="max-w-2xl text-center mx-auto text-lg text-text-2 leading-relaxed">
          Explore exclusive products from our partners in Dubai, China, and the UK.
          Sign up or log in to see full details and place your order directly.
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-3 gap-px bg-line border border-line">
        {PARTNER_REGIONS.map((region, index) => (
          <motion.div
            key={region.region}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group bg-surface p-7 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none">{region.emoji}</span>
                <span className="font-display font-extrabold text-2xl">{region.region}</span>
              </div>
              <span className="font-manifest text-[11px] text-text-3">{region.code}</span>
            </div>
            <div className="w-11 h-11 flex items-center justify-center border border-line-strong mb-5">
              <Warehouse className="w-5 h-5 text-freight" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-text-2 mb-7 leading-relaxed flex-1">{region.desc}</p>
            <Button asChild className="w-full bg-ink hover:bg-ink/90 text-paper rounded-none">
              <Link href={`/products?region=${region.catalogQuery}`}>
                View products
                <ArrowUpRight className="ml-auto w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
