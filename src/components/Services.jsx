"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Ship, Warehouse, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const Services = () => {
  const { t } = useTranslation();
  const icons = [Plane, Ship, Warehouse, Truck];
  const colors = [
    { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100" },
    { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  ];
  const services = t("services.items").map((item, i) => ({
    ...item,
    icon: icons[i],
    color: colors[i],
  }));

  return (
    <section id="services" className="py-24 bg-slate-50">
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
            <span className="text-sm font-semibold text-slate-700">{t("services.badge")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">{t("services.title")}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className={`border-2 ${service.color.border} bg-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="text-center pb-4">
                  <div className={`${service.color.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                    <service.icon className={`w-10 h-10 ${service.color.text}`} />
                  </div>
                  <CardTitle className="text-xl text-slate-800 font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-slate-600 mt-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <div className={`w-2 h-2 ${service.color.text} rounded-full mr-3 opacity-70`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700">
                    {t("services.learnMore")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};