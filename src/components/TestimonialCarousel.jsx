import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Lucy Wangari",
    title: "Procurement Specialist, Nairobi",
    review: "Highland Cargo made international shipping smooth and fast. The team is responsive and trustworthy!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "David Musoke",
    title: "Retail Business Owner, Kampala",
    review: "Superb local delivery and tracking. I always get my goods on time.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/43.jpg",
  },
  {
    name: "Elizabeth Chen",
    title: "Ecommerce Operations, Shanghai",
    review: "Professional, efficient, and reliable in warehousing and customs help.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  }
];

export const TestimonialCarousel = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-full mb-6">
          <div className="w-2 h-2 bg-slate-600 rounded-full" />
          <span className="text-sm font-semibold text-slate-700">Testimonials</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">What Our Clients Say</h2>
      </motion.div>
      <Carousel opts={{ loop: true, align: "center" }} className="max-w-3xl mx-auto">
        <CarouselContent>
          {testimonials.map((t, i) => (
            <CarouselItem key={i} className="px-3 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mx-auto w-full max-w-2xl space-y-6 border border-slate-200"
              >
                <div className="bg-amber-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  <Quote className="w-6 h-6 text-amber-600" />
                </div>
                <p className="italic text-lg text-slate-700 leading-relaxed">&quot;{t.review}&quot;</p>
                <div className="flex gap-1 mb-2">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />)}
                  {[...Array(5 - t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-slate-300" />)}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center font-bold text-lg text-slate-800">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-lg">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.title}</div>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-white border-slate-300 hover:bg-slate-100" />
        <CarouselNext className="bg-white border-slate-300 hover:bg-slate-100" />
      </Carousel>
    </div>
  </section>
);
