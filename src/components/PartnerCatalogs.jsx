
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { Warehouse } from "lucide-react";

const PARTNER_REGIONS = [
  {
    region: "Dubai",
    country: "UA",
    emoji: "🇦🇪",
    desc: "Best selection of electronics, fashion and more from Dubai.",
    catalogQuery: "dubai"
  },
  {
    region: "China",
    country: "CN",
    emoji: "🇨🇳",
    desc: "Manufacturing powerhouse. Direct deals on all categories from China.",
    catalogQuery: "china"
  },
  {
    region: "UK",
    country: "GB",
    emoji: "🇬🇧",
    desc: "Premium UK products, trusted European brands and more.",
    catalogQuery: "uk"
  },
];

export const PartnerCatalogs = () => (
  <section id="partner-catalogs" className="py-16 bg-gradient-to-br from-white via-orange-50 to-blue-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900">
        Partner Product Catalogs
      </h2>
      <p className="max-w-2xl text-center mx-auto text-lg text-gray-600 mb-12">
        Explore exclusive products from our partners in Dubai, China, and the UK.
        Sign up or log in to see full details and place your order directly!
      </p>
      <div className="grid sm:grid-cols-3 gap-8">
        {PARTNER_REGIONS.map(region => (
          <Card key={region.region} className="hover:shadow-2xl transition-all">
            <CardHeader>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{region.emoji}</span>
                <CardTitle>{region.region}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Warehouse className="w-10 h-10 text-orange-500 mb-2" />
              <p className="text-gray-700 mb-4">{region.desc}</p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={`/products?region=${region.catalogQuery}`}>
                  View Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);