"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Truck, Package, FileText, Phone, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const Support = () => {
  const { t } = useTranslation();
  const icons = [Search, Truck, Package, FileText, Phone, CreditCard];
  const colors = [
    { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
    { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  ];
  const supportItems = t("support.items").map((item, i) => ({
    ...item,
    icon: icons[i],
    color: colors[i],
  }));

  return (
    <section id="support" className="py-24 bg-white">
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
            <span className="text-sm font-semibold text-slate-700">{t("support.badge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">{t("support.title")}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t("support.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {supportItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card key={index} className={`border-2 ${item.color.border} bg-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${item.color.bg} shadow-inner`}>
                    <item.icon className={`w-8 h-8 ${item.color.text}`} />
                  </div>
                  <CardTitle className="text-xl text-slate-800 font-bold">{item.title}</CardTitle>
                  <CardDescription className="text-slate-600 mt-2">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="bg-slate-800 hover:bg-slate-700 text-white">
                    {t("support.clickToKnowMore")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl p-8 md:p-12 text-white text-center shadow-xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("support.vatTitle")}</h3>
          <p className="text-lg mb-8 text-slate-200 max-w-2xl mx-auto">
            {t("support.vatText")}
          </p>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-800">
            {t("support.viewFaqs")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
