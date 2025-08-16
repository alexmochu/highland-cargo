// 'use client';

// import { Suspense } from 'react';
// import Products from './products';

// export default function ProductsPage() {
//   return (
//     <Suspense>
//       <Products/>
//     </Suspense>
//   );
// }

'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from "@/components/auth-provider";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsPage() {
  return(
    <Suspense>
      <Products/>
    </Suspense>
  )
}

function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const initialRegion = searchParams.get("region") || "dubai";
  const { user } = useAuth();

  const [region, setRegion] = useState(initialRegion);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([])

  // Fetch categories for filter
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("product_categories").select("id,name");
      setCategories(data || []);
    })();
    (async () => {
      const { data } = await supabase.from("products").select(`
        *,
        suppliers(name),
        product_categories(name),
        product_pricing(min_quantity, max_quantity, price),
        product_images(image_url)
        `);
      setAllProducts(data || []);
    })();
  }, []);


  const fetchProducts = useCallback(
    debounce(async (term, region, sort) => {
      setLoading(true);

      let query = supabase
        .from("products")
        .select(`
          *,
          suppliers(name),
          product_categories(name),
          product_pricing(min_quantity, max_quantity, price),
          product_images(image_url)
        `)
        .eq("region", region)
        .order("numeric_price", { ascending: sort === "asc" });

      if (term) {
        query = query.or(`fts@@plainto_tsquery('english', '${term}'), embedding <=> (SELECT embedding FROM semantic_query('${term}')) < 0.8`);
      }

      const { data, error } = await query;
      if (!error) setProducts(data || []);
      setLoading(false);
    }, 400),
    []
  );

  useEffect(() => {
    fetchProducts(searchTerm, region, sortOrder);
  }, [region, searchTerm, sortOrder, fetchProducts]);

  const handleChatClick = (supplierId) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/chat?supplier=${supplierId}`);
    }
  };

  return (
    // <Suspense>
      <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Filters */}
          <aside className="bg-white p-4 rounded-xl shadow h-fit hidden md:block">
            <h2 className="font-bold text-lg mb-4">Filters</h2>
            <div>
              <h3 className="font-semibold">Categories</h3>
              {categories.map(cat => (
                <label key={cat.id} className="block">
                  <input type="checkbox" className="mr-2" /> {cat.name}
                </label>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="md:col-span-3 space-y-6">
            {/* Search + Sort */}
            <div className="flex flex-wrap gap-4 items-center">
              <Input placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="border rounded px-3 py-2">
                <option value="dubai">Dubai</option>
                <option value="china">China</option>
                <option value="uk">UK</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border rounded px-3 py-2">
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.map(product => {
                  const supplierName = product.suppliers?.name || "Highland Cargo";
                  const initials = supplierName.split(" ").map(w => w[0]).join("");
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="border-blue-200 shadow hover:shadow-lg transition">
                        {/* Image carousel */}
                        <div className="relative overflow-hidden">
                          <div className="flex overflow-x-auto snap-x snap-mandatory h-48">
                            {product.product_images?.slice(0,4).map((img, i) => (
                              <Image key={i} src={img.image_url} alt={product.name} width={300} height={200} className="snap-center object-cover w-full" />
                            ))}
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle>{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          <p className="text-xs mt-2 text-gray-500">{initials} - {supplierName}</p>
                          <p className="text-xs text-gray-500">Category: {product.product_categories?.name}</p>
                          {product.product_pricing?.length > 0 && (
                            <p className="text-sm text-gray-700 mt-2">
                              {product.product_pricing.map(p => `${p.min_quantity}-${p.max_quantity} pcs: $${p.price}`).join(", ")}
                            </p>
                          )}
                          <div className="mt-4 flex gap-2">
                            <Button className="bg-blue-600 text-white w-full">Request Quote</Button>
                            <Button onClick={() => handleChatClick(product.suppliers?.id)} variant="outline">Chat Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    // </Suspense>
  );
}

