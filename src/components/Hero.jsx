"use client"
import { Button } from "@/components/ui/button";
import { Truck, Ship, Plane, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative text-foreground py-32 overflow-hidden flex items-center min-h-[700px]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-100/50 to-transparent" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-slate-200/30 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-amber-700">{t("hero.badge")}</span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              {t("hero.titleMove")} <span className="bg-gradient-to-r from-slate-800 to-amber-500 bg-clip-text text-transparent">{t("hero.titleAnything")}</span>,
              <br />
              {t("hero.titleAnywhereWith")} <span className="text-slate-800">{t("hero.titlePrecision")}</span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white text-lg px-8 py-6 shadow-xl shadow-slate-800/20 transition-all hover:shadow-slate-800/30 hover:-translate-y-1">
                {t("hero.requestQuote")}
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-lg px-8 py-6">
                {t("hero.trackPackage")}
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Plane, label: t("hero.airFreight"), color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Ship, label: t("hero.seaFreight"), color: "text-teal-600", bg: "bg-teal-50" },
                  { icon: MapPin, label: t("hero.warehouses"), color: "text-amber-600", bg: "bg-amber-50" },
                  { icon: Truck, label: t("hero.localDelivery"), color: "text-emerald-600", bg: "bg-emerald-50" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`${item.bg} rounded-2xl p-6 text-center cursor-pointer transition-all hover:shadow-lg`}
                  >
                    <item.icon className={`w-12 h-12 mx-auto mb-3 ${item.color}`} />
                    <h3 className="font-semibold text-slate-800">{item.label}</h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="w-full flex justify-center mt-16"
        >
          <div className="animate-bounce">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};