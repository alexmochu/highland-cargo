import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { Warehouse } from "lucide-react";
import { motion } from "framer-motion";

const PARTNER_REGIONS = [
  {
    region: "Dubai",
    country: "UA",
    emoji: "🇦🇪",
    desc: "Best selection of electronics, fashion and more from Dubai.",
    catalogQuery: "dubai",
    color: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" }
  },
  {
    region: "China",
    country: "CN",
    emoji: "🇨🇳",
    desc: "Manufacturing powerhouse. Direct deals on all categories from China.",
    catalogQuery: "china",
    color: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" }
  },
  {
    region: "UK",
    country: "GB",
    emoji: "🇬🇧",
    desc: "Premium UK products, trusted European brands and more.",
    catalogQuery: "uk",
    color: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" }
  },
];

export const PartnerCatalogs = () => (
  <section id="partner-catalogs" className="py-24 bg-white">
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
          <span className="text-sm font-semibold text-slate-700">Global Partners</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Partner Product Catalogs
        </h2>
        <p className="max-w-2xl text-center mx-auto text-xl text-slate-600">
          Explore exclusive products from our partners in Dubai, China, and the UK.
          Sign up or log in to see full details and place your order directly!
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-3 gap-8">
        {PARTNER_REGIONS.map((region, index) => (
          <motion.div
            key={region.region}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card key={region.region} className={`border-2 ${region.color.border} bg-white shadow-lg hover:shadow-xl transition-all`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{region.emoji}</span>
                  <CardTitle className="text-2xl text-slate-800">{region.region}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${region.color.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-inner`}>
                  <Warehouse className={`w-8 h-8 ${region.color.text}`} />
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">{region.desc}</p>
                <Button asChild className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                  <Link href={`/products?region=${region.catalogQuery}`}>
                    View Products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);