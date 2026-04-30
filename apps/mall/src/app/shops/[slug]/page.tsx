import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: shop } = await supabase.from("shops").select("name, description").eq("slug", slug).single();
  if (!shop) return { title: "샵을 찾을 수 없습니다" };
  return { title: shop.name, description: shop.description ?? undefined };
}

export default async function ShopDetailPage({ params }: Props) {
  const { slug } = await params;

  const { data: shop } = await supabase
    .from("shops")
    .select("id, name, slug, description, address, phone, email")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!shop) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("shop_id", shop.id)
    .order("sort_order");

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, description, price, image_url, category_id")
    .eq("shop_id", shop.id)
    .eq("is_available", true)
    .order("sort_order");

  const productsByCategory = (categories ?? []).map((cat) => ({
    ...cat,
    products: (products ?? []).filter((p) => p.category_id === cat.id),
  }));

  const uncategorized = (products ?? []).filter((p) => !p.category_id);

  return (
    <>
      <Header />
      <main>
        {/* 샵 헤더 */}
        <div className="bg-gradient-to-br from-amber-50 to-stone-100 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-stone-900 mb-2">{shop.name}</h1>
            {shop.description && <p className="text-stone-600 text-lg">{shop.description}</p>}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-stone-500">
              {shop.address && <span>📍 {shop.address}</span>}
              {shop.phone && <span>📞 {shop.phone}</span>}
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {productsByCategory.map((cat) =>
            cat.products.length > 0 ? (
              <div key={cat.id} className="mb-12">
                <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                  {cat.name}
                </h2>
                <ProductGrid products={cat.products} />
              </div>
            ) : null
          )}
          {uncategorized.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">메뉴</h2>
              <ProductGrid products={uncategorized} />
            </div>
          )}
          {(products ?? []).length === 0 && (
            <p className="text-stone-500 text-center py-16">등록된 메뉴가 없습니다.</p>
          )}
        </div>
      </main>
    </>
  );
}

function ProductGrid({
  products,
}: {
  products: { id: string; name: string; description: string | null; price: number; image_url: string | null }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((p) => (
        <div key={p.id} className="bg-white rounded-xl border border-stone-200 p-4 flex gap-4">
          <div className="w-20 h-20 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">☕</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-900">{p.name}</h3>
            {p.description && (
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{p.description}</p>
            )}
            <p className="text-sm font-bold text-stone-900 mt-2">{p.price.toLocaleString()}원</p>
          </div>
        </div>
      ))}
    </div>
  );
}
