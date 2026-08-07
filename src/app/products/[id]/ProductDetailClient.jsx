'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from "framer-motion";

export default function ProductDetailClient() {
    return (
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <ProductDetailContent />
        </Suspense>
    );
}

function ProductDetailContent() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const supabase = useMemo(() => createClient(), []);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (!id) return;

        (async () => {
            const { data, error } = await supabase
                .from("products")
                .select(`
                    *,
                    suppliers(id, name, contact_email, phone),
                    product_categories(name),
                    product_pricing(min_quantity, max_quantity, price),
                    product_images(image_url)
                `)
                .eq("id", id)
                .single();

            if (error) {
                console.error("Error fetching product:", error);
            } else {
                setProduct(data);
            }
            setLoading(false);
        })();
    }, [id, supabase]);

    const handleChatClick = (supplierId) => {
        if (!user) {
            router.push(`/auth?redirect=/products/${id}`);
        } else {
            router.push(`/chat?supplier=${supplierId}`);
        }
    };

    if (loading) return <div className="min-h-screen grid place-items-center">Loading product details...</div>;
    if (!product) return <div className="min-h-screen grid place-items-center">Product not found</div>;

    const supplierName = product.suppliers?.name || "Highland Cargo";

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Products
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm p-6 lg:p-10">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-100">
                            {product.product_images?.length > 0 ? (
                                <Image
                                    src={product.product_images[activeImage]?.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <Image src="/highland-cargo.png" alt={product.name} fill className="object-contain p-8" />
                            )}
                        </div>
                        {product.product_images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.product_images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img.image_url} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase tracking-wide">
                                    {product.product_categories?.name || "Uncategorized"}
                                </span>
                                {product.region && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium uppercase tracking-wide">
                                        {product.region}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
                            <p className="text-lg text-gray-500 mt-2">by {supplierName}</p>
                        </div>

                        <div className="prose prose-blue text-gray-600 max-w-none">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="whitespace-pre-wrap leading-relaxed">{product.description}</p>
                        </div>

                        {product.product_pricing?.length > 0 && (
                            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                                <h3 className="font-semibold text-gray-900 mb-4">Pricing Values</h3>
                                <div className="space-y-3">
                                    {product.product_pricing.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
                                            <span className="text-gray-600 font-medium">{p.min_quantity} - {p.max_quantity} pcs</span>
                                            <span className="text-xl font-bold text-blue-700">${p.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button asChild size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                                <a href="tel:+254707126666">Call Us · +254 707 126 666</a>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                <button type="button" onClick={() => handleChatClick(product.suppliers?.id)}>
                                    Chat with Supplier
                                </button>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
