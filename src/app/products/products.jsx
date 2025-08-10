'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { debounce } from 'lodash';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from "@/components/auth-provider";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from 'next/link';

const regions = ['dubai', 'china', 'uk'];

const regionName = (region) => {
  if (region === "dubai") return "Dubai";
  if (region === "china") return "China";
  if (region === "uk") return "UK";
  return "";
};

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient()
  const initialRegion = searchParams.get("region") || "dubai";
  const { user } = useAuth(); // 👈 Detect logged in user

  const [region, setRegion] = useState(initialRegion);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchProducts = useCallback(
    debounce(async (term, region, sort) => {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*")
        .eq("region", region)
        .order("numeric_price", { ascending: sort === "asc" });

      if (term) {
        query = query.ilike("name", `%${term}%`);
      }

      const { data, error } = await query;

      if (!error) {
        setProducts(data || []);
      }
      setLoading(false);
    }, 400),
    []
  );

  useEffect(() => {
    fetchProducts(searchTerm, region, sortOrder);
  }, [region, searchTerm, sortOrder, fetchProducts]);

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setRegion(value);
    router.push(`/products?region=${value}`);
  };

  return (
    <Suspense>
      <div className="min-h-screen py-14 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-5xl mx-auto mb-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
            Product Catalog: {regionName(region)}
          </h1>

          {!user && (
            <p className="text-gray-700 text-lg">
              These are previews. Sign up or log in to access full product details and request quotes.
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              placeholder="Search products..."
              className="max-w-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={region}
              onChange={handleRegionChange}
              className="border border-gray-300 rounded px-3 py-2"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {regionName(r)}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div colSpan={5} className="text-center py-4">No products found</div>
        ) :  (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-blue-200 shadow hover:shadow-xl transition">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-900 font-bold mb-2">{product.price}</div>
                    <div className="text-gray-600 mb-3">{product.description}</div>

                    {user ? (
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Request Quote
                      </Button>
                    ) : (
                      <>
                        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                          <Link href="/signup">Sign Up to View</Link>
                        </Button>
                        <div className="mt-2 text-center text-xs">
                          Already have an account?{" "}
                          <Link href="/login" className="text-blue-700 underline">
                            Login
                          </Link>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}
