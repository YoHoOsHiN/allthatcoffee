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
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1C0F0A] via-[#2D1810] to-[#4A2515]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 60%, rgba(193,124,36,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(74,37,21,0.6) 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
            <span className="inline-flex items-center gap-1.5 bg-[#C17C24]/20 text-[#D4A853] border border-[#C17C24]/30 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 tracking-wide">
              ✨ 전국 스페셜티 커피 한 곳에서
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-[40px] sm:text-[60px] font-bold text-white leading-[1.1] tracking-tight mb-4 italic">
              커피를 더 쉽게,
              <br />더 즐겁게
            </h1>
            <p className="text-white/65 text-base sm:text-lg font-medium mb-10 max-w-sm mx-auto">
              엄선된 스페셜티 커피샵들의 메뉴를 한 곳에서 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="bg-[#C17C24] text-white px-8 py-3.5 rounded-2xl font-bold text-[15px] hover:bg-[#9A6020] transition-all duration-200 shadow-lg shadow-[#1C0F0A]/40 hover:shadow-xl"
              >
                메뉴 둘러보기
              </Link>
              <Link
                href="/shops"
                className="bg-white/10 text-white border border-white/20 px-8 py-3.5 rounded-2xl font-bold text-[15px] hover:bg-white/20 transition-all duration-200"
              >
                샵 찾기
              </Link>
            </div>
          </div>
        </section>

        {/* Shops */}
        <section className="bg-[#FAF6F0] py-14">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-extrabold text-[#1C0F0A] tracking-tight">입점 샵</h2>
              <Link
                href="/shops"
                className="text-[13px] font-semibold text-[#C17C24] hover:text-[#9A6020] flex items-center gap-0.5 transition-colors duration-200"
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
                  className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-[#F0E6D8] transition-colors duration-200"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F0E6D8] to-[#DCC8B0] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <span className="text-2xl">☕</span>
                  </div>
                  <span className="text-[12px] font-semibold text-[#6B4226] text-center line-clamp-1">
                    {shop.name}
                  </span>
                </Link>
              ))}
              {shops.length === 0 && (
                <p className="text-[#C4A07A] col-span-6 text-center py-8 text-sm">등록된 샵이 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-[#F0E6D8] py-14">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px] font-extrabold text-[#1C0F0A] tracking-tight">추천 메뉴</h2>
              <Link
                href="/products"
                className="text-[13px] font-semibold text-[#C17C24] hover:text-[#9A6020] flex items-center gap-0.5 transition-colors duration-200"
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
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border border-[#DCC8B0]"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#FAF6F0] to-[#F0E6D8] flex items-center justify-center">
                      <span className="text-4xl">☕</span>
                    </div>
                    <div className="p-4">
                      {shop?.name && (
                        <span className="inline-block text-[11px] font-bold text-[#6B4226] bg-[#FAF6F0] px-2 py-0.5 rounded-md mb-1.5 border border-[#DCC8B0]/50">
                          {shop.name}
                        </span>
                      )}
                      <h3 className="font-bold text-[14px] text-[#1C0F0A] line-clamp-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-[12px] text-[#C4A07A] mt-0.5 line-clamp-1">{product.description}</p>
                      )}
                      <p className="text-[15px] font-black text-[#1C0F0A] mt-2.5">
                        {product.price.toLocaleString()}
                        <span className="text-[12px] font-semibold text-[#C4A07A] ml-0.5">원</span>
                      </p>
                    </div>
                  </div>
                );
              })}
              {featuredProducts.length === 0 && (
                <p className="text-[#C4A07A] col-span-4 text-center py-12 text-sm">추천 메뉴가 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#1C0F0A] py-16">
          <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-[26px] sm:text-[32px] font-bold text-white mb-3 tracking-tight italic">
              나만의 커피를 찾아보세요
            </h2>
            <p className="text-white/55 text-[15px] mb-8">
              다양한 스페셜티 커피샵과 함께하는 특별한 커피 경험
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#C17C24] text-white px-10 py-3.5 rounded-2xl font-bold text-[15px] hover:bg-[#9A6020] transition-all duration-200 shadow-lg shadow-[#1C0F0A]/40"
            >
              지금 둘러보기
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
