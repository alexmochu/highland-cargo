"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const Contact = () => {
  const { t } = useTranslation();

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.officeTitle"),
      lines: ["Eastgate Rd. Mombasa Road", "Nairobi, Kenya", "P.O. Box 12345-00100"],
    },
    {
      icon: Phone,
      title: t("contact.callUsTitle"),
      lines: [
        { text: "+254 746 888 942", href: "tel:+254746888942" },
        { text: "+254 707 126 666", href: "tel:+254707126666" },
      ],
    },
    {
      icon: Mail,
      title: t("contact.emailUsTitle"),
      lines: [{ text: "support@highlandcargoafrica.com", href: "mailto:support@highlandcargoafrica.com" }],
    },
  ];

  const inputClass = "border-line-strong focus-visible:border-freight focus-visible:ring-freight/20 h-12 rounded-none bg-surface";

  return (
    <section id="contact" className="py-24 lg:py-32 bg-paper-dim border-t border-line">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 hc-reveal">
          <div className="font-manifest text-[12px] text-freight-soft tracking-wide mb-4">
            {t("contact.badge").toUpperCase()}
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4 text-balance">{t("contact.title")}</h2>
          <p className="text-lg text-text-2 max-w-2xl mx-auto leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 border border-line divide-y lg:divide-y-0 lg:divide-x divide-line mb-14 bg-surface">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-8 flex gap-5"
            >
              <item.icon className="w-6 h-6 text-freight flex-none mt-0.5" strokeWidth={1.6} />
              <div>
                <h3 className="font-semibold text-ink mb-2">{item.title}</h3>
                <div className="text-sm text-text-2 space-y-1">
                  {item.lines.map((line, lineIndex) =>
                    typeof line === "string" ? (
                      <p key={lineIndex}>{line}</p>
                    ) : (
                      <p key={lineIndex}>
                        <a href={line.href} className="hover:text-freight transition-colors">{line.text}</a>
                      </p>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-surface border border-line p-8"
          >
            <h3 className="font-display font-extrabold text-2xl mb-6">{t("contact.requestQuoteTitle")}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder={t("contact.firstName")} className={inputClass} />
                <Input placeholder={t("contact.lastName")} className={inputClass} />
              </div>
              <Input placeholder={t("contact.emailAddress")} className={inputClass} />
              <Input placeholder={t("contact.phoneNumber")} className={inputClass} />
              <Input placeholder={t("contact.serviceType")} className={inputClass} />
              <Textarea placeholder={t("contact.describeRequirements")} className="min-h-32 border-line-strong focus-visible:border-freight focus-visible:ring-freight/20 rounded-none bg-surface" />
              <Button className="w-full bg-ink hover:bg-ink/90 text-paper rounded-none h-12">
                {t("contact.requestQuoteTitle")}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-surface border border-line p-8">
              <h3 className="flex items-center gap-3 text-lg font-semibold mb-5">
                <Clock className="w-5 h-5 text-freight" />
                {t("contact.businessHoursTitle")}
              </h3>
              <div className="space-y-0 font-manifest text-[13px]">
                <div className="flex justify-between items-center py-3 border-b border-line">
                  <span className="text-text-2">{t("contact.monFri")}</span>
                  <span className="text-ink font-semibold">08:00 — 18:00</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-line">
                  <span className="text-text-2">{t("contact.sat")}</span>
                  <span className="text-ink font-semibold">09:00 — 14:00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-text-2">{t("contact.sun")}</span>
                  <span className="text-text-3 font-semibold">{t("contact.closed")}</span>
                </div>
              </div>
            </div>

            <div className="bg-ink text-paper p-8">
              <h3 className="font-display font-extrabold text-xl mb-3">{t("contact.shipWithUsTitle")}</h3>
              <p className="text-paper/70 text-sm leading-relaxed mb-6">
                {t("contact.shipWithUsText")}
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-beacon hover:bg-beacon/90 text-ink font-semibold rounded-none h-12">
                  {t("contact.createAccount")}
                </Button>
                <Button variant="ghost" className="w-full text-paper hover:bg-paper/10 hover:text-paper rounded-none h-12 border border-paper/25">
                  {t("contact.trackExistingShipment")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
