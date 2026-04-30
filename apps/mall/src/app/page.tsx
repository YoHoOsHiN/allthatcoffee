import Link from "next/link";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";

async function getShops() {
  const { data } = await supabase
    .from("shops")
    .select("id, name, slug, description, logo_url")
    .eq("is_active", true)
    .order("name")
    .limit(6);
  return data ?? [];
}

async function getFeaturedProducts() {
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, description, price, image_url, shop_id, shops(name, slug)")
    .eq("is_available", true)
    .eq("is_featured", true)
    .limit(8);
  return data ?? [];
}

function ChevronRight() {
  return (
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default async function HomePage() {
  const [shops, featuredProducts] = await Promise.all([getShops(), getFeaturedProducts()]);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-700">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 50%, #b568f8 0%, transparent 55%), radial-gradient(circle at 85% 20%, #7c15d0 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-white/90 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 tracking-wide">
              ✨ 전국 스페셜티 커피 한 곳에서
            </span>
            <h1 className="text-[40px] sm:text-[56px] font-black text-white leading-[1.1] tracking-tight mb-4">
              커피를 더 쉽게,
              <br />더 즐겁게
            </h1>
            <p className="text-white/65 text-base sm:text-lg font-medium mb-10 max-w-sm mx-auto">
              엄선된 스페셜티 커피샵들의 메뉴를 한 곳에서 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="bg-white text-brand-700 px-8 py-3.5 rounded-2xl font-bold text-[15px] hover:bg-brand-50 transition-colors shadow-lg shadow-brand-950/40"
              >
                메뉴 둘러보기
              </Link>
              <Link
                href="/shops"
                className="bg-white/15 text-white border border-white/20 px-8 py-3.5 rounded-2xl font-bold text-[15px] hover:bg-white/25 transition-colors"
              >
                샵 찾기
              </Link>
            </div>
          </div>
        </section>

        {/* Shops */}
        <section className="bg-white py-14">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">입점 샵</h2>
              <Link
                href="/shops"
                className="text-[13px] font-semibold text-brand-700 hover:text-brand-600 flex items-center gap-0.5 transition-colors"
              >
                전체 보기
                <ChevronRight />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {shops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/shops/${shop.slug}`}
                  className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-brand-50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                    <span className="text-2xl">☕</span>
                  </div>
                  <span className="text-[12px] font-semibold text-gray-700 text-center line-clamp-1">
                    {shop.name}
                  </span>
                </Link>
              ))}
              {shops.length === 0 && (
                <p className="text-gray-400 col-span-6 text-center py-8 text-sm">등록된 샵이 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gray-50 py-14">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">추천 메뉴</h2>
              <Link
                href="/products"
                className="text-[13px] font-semibold text-brand-700 hover:text-brand-600 flex items-center gap-0.5 transition-colors"
              >
                전체 보기
                <ChevronRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => {
                const shop = product.shops as { name: string; slug: string } | null;
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                      <span className="text-4xl">☕</span>
                    </div>
                    <div className="p-4">
                      {shop?.name && (
                        <span className="inline-block text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md mb-1.5">
                          {shop.name}
                        </span>
                      )}
                      <h3 className="font-bold text-[14px] text-gray-900 line-clamp-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                      )}
                      <p className="text-[15px] font-black text-gray-900 mt-2.5">
                        {product.price.toLocaleString()}
                        <span className="text-[12px] font-semibold text-gray-400 ml-0.5">원</span>
                      </p>
                    </div>
                  </div>
                );
              })}
              {featuredProducts.length === 0 && (
                <p className="text-gray-400 col-span-4 text-center py-12 text-sm">추천 메뉴가 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-brand-950 py-16">
          <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-[26px] sm:text-[30px] font-black text-white mb-3 tracking-tight">
              나만의 커피를 찾아보세요
            </h2>
            <p className="text-white/55 text-[15px] mb-8">
              다양한 스페셜티 커피샵과 함께하는 특별한 커피 경험
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-brand-700 px-10 py-3.5 rounded-2xl font-bold text-[15px] hover:bg-brand-50 transition-colors"
            >
              지금 둘러보기
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
