import { createClient } from "@supabase/supabase-js";
import { getURL } from "@/utils/helpers";
import ProductDetailClient from "./ProductDetailClient";

// Read-only, anon-key client for server-side metadata generation only.
// Product data is public, so no session/cookies are needed here.
function publicSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  const { data: product } = await publicSupabase()
    .from("products")
    .select("name, description, product_images(image_url)")
    .eq("id", id)
    .maybeSingle();

  if (!product) {
    return { title: "Product Not Found — Highland Cargo Africa" };
  }

  const title = `${product.name} — Highland Cargo Africa`;
  const description = product.description?.slice(0, 160) || "Moving Anything Anywhere, Fast";
  const image = product.product_images?.[0]?.image_url || getURL("/highland-cargo.png");

  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
