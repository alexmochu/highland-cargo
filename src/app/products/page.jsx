'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
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
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { escapeForOrFilter } from '@/utils/helpers';
import { useTranslation } from '@/i18n/LocaleProvider';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  )
}

function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const initialRegion = searchParams.get("region") || "dubai";
  const { user } = useAuth();
  const { t } = useTranslation();

  const [region, setRegion] = useState(initialRegion);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  // Fetch filter categories once.
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("product_categories").select("id,name");
      setCategories(data || []);
    })();
  }, [supabase]);

  // Debounce raw keystrokes into a settled search term, and reset to page 1.
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => {
      setSearchTerm(value);
      setPage(1);
    }, 400),
    []
  );
  useEffect(() => () => debouncedSetSearchTerm.cancel(), [debouncedSetSearchTerm]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSetSearchTerm(e.target.value);
  };

  const handleRegionChange = (value) => {
    setRegion(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setPage(1);
  };

  const handleCategoryToggle = (id) => {
    setCategoryId((current) => (current === id ? null : id));
    setPage(1);
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("products")
        .select(`
          *,
          suppliers(id, name),
          product_categories(name),
          product_pricing(min_quantity, max_quantity, price),
          product_images(image_url)
        `, { count: "exact" })
        .eq("region", region)
        .order("numeric_price", { ascending: sortOrder === "asc" })
        .range(from, to);

      if (categoryId) query = query.eq("category_id", categoryId);

      if (searchTerm.trim()) {
        const pattern = escapeForOrFilter(`%${searchTerm.trim()}%`);
        query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`);
      }

      const { data, error, count: total } = await query;

      if (cancelled) return;
      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setCount(0);
      } else {
        setProducts(data || []);
        setCount(total || 0);
      }
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [supabase, region, searchTerm, sortOrder, categoryId, page]);

  const handleChatClick = (supplierId) => {
    if (!user) {
      router.push("/auth?redirect=/products");
    } else {
      router.push(`/chat?supplier=${supplierId}`);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Filters */}
        <aside className="bg-white p-4 rounded-xl shadow h-fit hidden md:block">
          <h2 className="font-bold text-lg mb-4">{t("products.filtersTitle")}</h2>
          <div>
            <h3 className="font-semibold">{t("products.categoriesTitle")}</h3>
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={categoryId === cat.id}
                  onChange={() => handleCategoryToggle(cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-3 space-y-6">
          {/* Search + Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            <Input placeholder={t("products.searchPlaceholder")} value={searchInput} onChange={handleSearchChange} />
            <select value={region} onChange={(e) => handleRegionChange(e.target.value)} className="border rounded px-3 py-2">
              <option value="dubai">{t("products.regionDubai")}</option>
              <option value="china">{t("products.regionChina")}</option>
              <option value="uk">{t("products.regionUk")}</option>
            </select>
            <select value={sortOrder} onChange={(e) => handleSortChange(e.target.value)} className="border rounded px-3 py-2">
              <option value="asc">{t("products.priceLowHigh")}</option>
              <option value="desc">{t("products.priceHighLow")}</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">{t("products.loading")}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500">{t("products.noMatch")}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => {
                  const supplierName = product.suppliers?.name || "Highland Cargo";
                  const initials = supplierName.split(" ").map(w => w[0]).join("");
                  return (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="border-blue-200 shadow hover:shadow-xl transition-all duration-300 h-full">
                        <Link href={`/products/${product.id}`} className="block group">
                          {/* Image carousel */}
                          <div className="relative overflow-hidden">
                            <div className="flex overflow-x-auto snap-x snap-mandatory h-48 scrollbar-hide">
                              {product.product_images && product.product_images.length > 0 ? (
                                product.product_images.slice(0, 4).map((img, i) => (
                                  <Image key={i} src={img.image_url} alt={product.name} width={300} height={200} className="snap-center object-cover w-full h-full" />
                                ))
                              ) : (
                                <Image src="/highland-cargo.png" alt={product.name} width={300} height={200} className="snap-center object-cover w-full h-full" />
                              )}
                            </div>
                          </div>
                          <CardHeader>
                            <CardTitle className="group-hover:text-blue-600 transition-colors">{product.name}</CardTitle>
                          </CardHeader>
                        </Link>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                          <p className="text-xs mt-2 text-gray-500">{initials} - {supplierName}</p>
                          <p className="text-xs text-gray-500">{t("products.categoryLabel")} {product.product_categories?.name}</p>
                          {product.product_pricing?.length > 0 && (
                            <p className="text-sm text-gray-700 mt-2">
                              {product.product_pricing.map(p => `${p.min_quantity}-${p.max_quantity} pcs: $${p.price}`).join(", ")}
                            </p>
                          )}
                          <div className="mt-4 pt-2 border-t border-gray-100 flex gap-2">
                            <Link href={`/products/${product.id}`} className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                              {t("products.viewDetails")}
                            </Link>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              aria-label={`Chat with ${supplierName}`}
                              onClick={() => handleChatClick(product.suppliers?.id)}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <ChevronLeft className="w-4 h-4 mr-1" /> {t("products.prev")}
                  </Button>
                  <span className="text-sm text-gray-600">{t("products.pageOf", { page, total: totalPages })}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                    {t("products.next")} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
