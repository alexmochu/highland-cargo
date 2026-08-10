"use client";

import { Button } from "@/components/ui/button";
import { Globe, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/i18n/LocaleProvider";

export const About = () => {
  const { t } = useTranslation();
  const stats = [
    { icon: Globe, value: "05", label: t("about.statsCountries") },
    { icon: Users, value: "1K+", label: t("about.statsClients") },
    { icon: Award, value: "15+", label: t("about.statsExperience") },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 bg-surface overflow-hidden border-t border-line">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6 mt-10 lg:mt-0"
          >
            <div className="font-manifest text-[12px] text-freight-soft tracking-wide">
              {t("about.badge").toUpperCase()}
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[0.98] text-balance max-w-lg">
              {t("about.title")}
            </h2>
            <p className="text-lg text-text-2 leading-relaxed">
              {t("about.p1Prefix")}<span className="font-semibold text-freight">{t("about.p1Highlight")}</span>{t("about.p1Suffix")}
            </p>
            <p className="text-lg text-text-2 leading-relaxed">
              {t("about.p2Prefix")}<span className="font-semibold text-ink">{t("about.p2Highlight")}</span>{t("about.p2Suffix")}
            </p>
            <div className="pt-2">
              <Button className="bg-ink hover:bg-ink/90 text-paper rounded-none px-7 py-6">
                {t("about.learnMoreButton")}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop"
              alt="Our team coordinating a shipment"
              width={800}
              height={500}
              className="w-full h-[460px] object-cover grayscale-[15%]"
            />
            <div className="absolute -bottom-6 -left-6 bg-ink text-paper p-6 max-w-[240px] border border-ink">
              <p className="font-display font-extrabold text-2xl mb-1">{t("about.imageCaptionTitle")}</p>
              <p className="text-paper/70 text-sm leading-relaxed">{t("about.imageCaptionText")}</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-line divide-y md:divide-y-0 md:divide-x divide-line">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-10 flex items-center gap-6"
            >
              <stat.icon className="w-8 h-8 text-freight flex-none" strokeWidth={1.5} />
              <div>
                <div className="font-display font-extrabold text-4xl leading-none text-ink">{stat.value}</div>
                <div className="text-sm text-text-2 mt-1.5">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
