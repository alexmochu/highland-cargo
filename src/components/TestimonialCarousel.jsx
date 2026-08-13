"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LocaleProvider";

export const TestimonialCarousel = () => {
  const { t } = useTranslation();
  const testimonials = t("testimonials.items");

  return (
  <section className="py-24 lg:py-32 bg-surface border-t border-line">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="font-manifest text-[12px] text-freight-soft tracking-wide mb-4">
          {t("testimonials.badge").toUpperCase()}
        </div>
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-balance">{t("testimonials.title")}</h2>
      </motion.div>
      <Carousel opts={{ loop: true, align: "center" }} className="max-w-3xl mx-auto">
        <CarouselContent>
          {testimonials.map((item, i) => (
            <CarouselItem key={i} className="px-3 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-paper-dim p-8 md:p-12 mx-auto w-full max-w-2xl space-y-6 border border-line"
              >
                <Quote className="w-8 h-8 text-beacon" strokeWidth={1.5} />
                <p className="italic text-lg text-ink leading-relaxed">&quot;{item.review}&quot;</p>
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-freight fill-freight" />)}
                  {[...Array(5 - item.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-line-strong" />)}
                </div>
                <div className="flex items-center gap-4 pt-5 border-t border-line">
                  <div className="w-12 h-12 bg-ink text-paper flex items-center justify-center font-display font-bold text-sm flex-none">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-ink">{item.name}</div>
                    <div className="text-sm text-text-3">{item.title}</div>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-surface border-line-strong hover:bg-paper-dim rounded-none" />
        <CarouselNext className="bg-surface border-line-strong hover:bg-paper-dim rounded-none" />
      </Carousel>
    </div>
  </section>
  );
};
