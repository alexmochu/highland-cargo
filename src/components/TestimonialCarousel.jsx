import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";

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
  <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-blue-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">What Our Clients Say</h2>
      <Carousel opts={{ loop: true, align: "center" }} className="max-w-2xl mx-auto">
        <CarouselContent>
          {testimonials.map((t, i) => (
            <CarouselItem key={i} className="px-3 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 mx-auto w-full max-w-lg animate-fade-in space-y-4 border border-gray-100">
                <Quote className="w-8 h-8 text-orange-400 mb-2" />
                <p className="italic text-gray-700 mb-2">&quot;{t.review}&quot;</p>
                <div className="flex gap-1 mb-1">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />)}
                  {[...Array(5 - t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-gray-300" />)}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  {/* <img src={t.image} className="w-12 h-12 rounded-full border-2 border-orange-200" alt={t.name} /> */}
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.title}</div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </section>
);
