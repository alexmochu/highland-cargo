"use client";

import { Button } from "@/components/ui/button";
import { Plane, Ship, Warehouse, Truck, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const Services = () => {
  const { t } = useTranslation();
  const icons = [Plane, Ship, Warehouse, Truck];
  const services = t("services.items").map((item, i) => ({
    ...item,
    icon: icons[i],
    code: `SVC-0${i + 1}`,
  }));

  return (
    <section id="services" className="py-24 lg:py-32 bg-paper-dim border-t border-line">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 hc-reveal">
          <div>
            <div className="font-manifest text-[12px] text-freight-soft tracking-wide mb-4">
              {t("services.badge").toUpperCase()}
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-[0.98] text-balance max-w-xl">
              {t("services.title")}
            </h2>
          </div>
          <p className="text-text-2 max-w-md leading-relaxed">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative bg-surface p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-manifest text-[11px] text-text-3">{service.code}</span>
                <ArrowUpRight className="w-4 h-4 text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-freight" />
              </div>

              <div className="w-12 h-12 flex items-center justify-center border border-line-strong mb-6">
                <service.icon className="w-5 h-5 text-freight" strokeWidth={1.75} />
              </div>

              <h3 className="font-display font-bold text-xl mb-2.5 leading-tight">{service.title}</h3>
              <p className="text-sm text-text-2 leading-relaxed mb-6">{service.description}</p>

              <ul className="space-y-2 mb-8 mt-auto">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-[12.5px] text-text-2 font-manifest">
                    <span className="w-1 h-1 bg-beacon mr-2.5 flex-none" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant="ghost"
                className="w-full justify-start px-0 rounded-none text-ink hover:bg-transparent hover:text-freight border-t border-line pt-4"
              >
                {t("services.learnMore")}
                <ArrowUpRight className="ml-auto w-4 h-4" />
              </Button>

              <div className="absolute left-0 bottom-0 h-[3px] w-0 bg-beacon transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
