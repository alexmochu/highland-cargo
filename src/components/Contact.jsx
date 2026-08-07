"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      color: { bg: "bg-blue-50", text: "text-blue-600" }
    },
    {
      icon: Phone,
      title: t("contact.callUsTitle"),
      lines: [
        { text: "+254 746 888 942", href: "tel:+254746888942" },
        { text: "+254 707 126 666", href: "tel:+254707126666" },
      ],
      color: { bg: "bg-emerald-50", text: "text-emerald-600" }
    },
    {
      icon: Mail,
      title: t("contact.emailUsTitle"),
      lines: [{ text: "support@highlandcargoafrica.com", href: "mailto:support@highlandcargoafrica.com" }],
      color: { bg: "bg-amber-50", text: "text-amber-600" }
    }
  ];

  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-full mb-6">
            <div className="w-2 h-2 bg-slate-600 rounded-full" />
            <span className="text-sm font-semibold text-slate-700">{t("contact.badge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">{t("contact.title")}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="text-center">
                  <div className={`${item.color.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                    <item.icon className={`w-8 h-8 ${item.color.text}`} />
                  </div>
                  <CardTitle className="text-xl text-slate-800 font-bold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-slate-600 space-y-1">
                  {item.lines.map((line, lineIndex) =>
                    typeof line === "string" ? (
                      <p key={lineIndex}>{line}</p>
                    ) : (
                      <p key={lineIndex}>
                        <a href={line.href} className="hover:text-slate-900 hover:underline">{line.text}</a>
                      </p>
                    )
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-800 font-bold">{t("contact.requestQuoteTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <Input placeholder={t("contact.firstName")} className="border-slate-200 focus:border-slate-400 h-12" />
                  <Input placeholder={t("contact.lastName")} className="border-slate-200 focus:border-slate-400 h-12" />
                </div>
                <Input placeholder={t("contact.emailAddress")} className="border-slate-200 focus:border-slate-400 h-12" />
                <Input placeholder={t("contact.phoneNumber")} className="border-slate-200 focus:border-slate-400 h-12" />
                <Input placeholder={t("contact.serviceType")} className="border-slate-200 focus:border-slate-400 h-12" />
                <Textarea placeholder={t("contact.describeRequirements")} className="min-h-32 border-slate-200 focus:border-slate-400" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-slate-800 font-bold">
                  <Clock className="w-6 h-6 text-amber-600" />
                  {t("contact.businessHoursTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">{t("contact.monFri")}</span>
                    <span className="text-slate-800 font-semibold">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">{t("contact.sat")}</span>
                    <span className="text-slate-800 font-semibold">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-600 font-medium">{t("contact.sun")}</span>
                    <span className="text-slate-800 font-semibold">{t("contact.closed")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 font-bold">{t("contact.shipWithUsTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">
                  {t("contact.shipWithUsText")}
                </p>
                <div className="space-y-4">
                  <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white h-12 text-lg">
                    {t("contact.createAccount")}
                  </Button>
                  <Button variant="outline" className="w-full border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 h-12 text-lg">
                    {t("contact.trackExistingShipment")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
