'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Simulated product data, would be fetched from backend in production.
const PRODUCT_PREVIEW = {
  dubai: [
    { name: "Smartphone X-Pro", price: "$199+", info: "Latest Dubai tech, limited view" },
    { name: "Designer Bag", price: "from $80", info: "Trendy Dubai fashion, limited view" },
  ],
  china: [
    { name: "Bluetooth Earbuds", price: "$15+", info: "Factory price, limited view" },
    { name: "LED Light Strips", price: "$8+", info: "Top China manufacturer, limited view" },
  ],
  uk: [
    { name: "Organic Tea", price: "from $5", info: "UK original, limited view" },
    { name: "Premium Sneakers", price: "$120+", info: "British brand, limited details" },
  ],
};

const regionName = (region) => {
  if (region === "dubai") return "Dubai";
  if (region === "china") return "China";
  if (region === "uk") return "UK";
  return "";
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const region = searchParams.get("region") || "dubai";
  const products = PRODUCT_PREVIEW[region] || [];

  return (
    <div className="min-h-screen py-14 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">Product Catalog: {regionName(region)}</h1>
        <p className="text-gray-700 text-lg">
          The products below are just a sneak peek! <br/>
          Sign up or log in to access full product details, specifications, and make orders.
        </p>
      </div>
      <div className="grid gap-8 max-w-2xl mx-auto">
        {products.map((p, i) => (
          <Card key={i} className="border-blue-200 shadow hover:shadow-xl">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 font-bold mb-2">{p.price}</div>
              <div className="text-gray-600 mb-4">{p.info}</div>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                <Link href="/signup">Sign Up to View</Link>
              </Button>
              <div className="mt-2 text-center text-xs">
                Already have an account? <Link href="/login" className="text-blue-700 underline">Login</Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
