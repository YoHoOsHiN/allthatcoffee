import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: shop } = await supabase
    .from("shops")
    .select("name, description")
    .eq("slug", slug)
    .single();
  if (!shop) return { title: "샵을 찾을 수 없습니다" };
  return { title: shop.name, description: shop.description ?? undefined };
}

export default async function ShopDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { category: activeCategory } = await searchParams;

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

  const catList = categories ?? [];
  const activeCat = activeCategory ? catList.find((c) => c.slug === activeCategory) : null;

  let productQuery = supabase
    .from("products")
    .select("id, name, slug, description, price, image_url, category_id")
    .eq("shop_id", shop.id)
    .eq("is_available", true)
    .order("sort_order");

  if (activeCat) {
    productQuery = productQuery.eq("category_id", activeCat.id);
  }

  const { data: products } = await productQuery;
  const productList = products ?? [];

  return (
    <>
      <Header />
      <main>
        {/* Shop Hero */}
        <div className="bg-brand-700 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #d09aff 0%, transparent 55%), radial-gradient(circle at 80% 80%, #7c15d0 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-12">
            <Link
              href="/shops"
              className="inline-flex items-center gap-1 text-white/55 text-[13px] font-medium hover:text-white/90 transition-colors mb-5"
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              전체 샵
            </Link>
            <h1 className="text-[32px] sm:text-[40px] font-black text-white leading-tight tracking-tight mb-2">
              {shop.name}
            </h1>
            {shop.description && (
              <p className="text-white/65 text-[15px] max-w-md">{shop.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-4 text-[13px] text-white/55">
              {shop.address && (
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2a7 7 0 0 0-7 7c0 4.9 7 13 7 13s7-8.1 7-13a7 7 0 0 0-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {shop.address}
                </span>
              )}
              {shop.phone && (
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 4.11 2 2 0 0 1 6.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {shop.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {catList.length > 0 && (
          <div className="bg-white border-b border-gray-100 sticky top-[60px] z-40">
            <div className="max-w-5xl mx-auto px-5 sm:px-8">
              <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
                <Link
                  href={`/shops/${slug}`}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors ${
                    !activeCategory
                      ? "bg-brand-700 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  전체
                </Link>
                {catList.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shops/${slug}?category=${cat.slug}`}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors ${
                      activeCategory === cat.slug
                        ? "bg-brand-700 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="bg-gray-50 min-h-[40vh]">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
            {productList.length > 0 ? (
              <div className="flex flex-col gap-3">
                {productList.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-[72px] h-[72px] rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">☕</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[15px] text-gray-900">{p.name}</h3>
                      {p.description && (
                        <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-2">{p.description}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right pl-2">
                      <p className="text-[16px] font-black text-gray-900 whitespace-nowrap">
                        {p.price.toLocaleString()}
                        <span className="text-[12px] font-semibold text-gray-400 ml-0.5">원</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-[15px]">
                  {activeCategory ? "해당 카테고리에 메뉴가 없습니다." : "등록된 메뉴가 없습니다."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
