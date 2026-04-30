import Link from "next/link";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";

async function getShops() {
  const { data } = await supabase
    .from("shops")
    .select("id, name, slug, description, logo_url, banner_url")
    .eq("is_active", true)
    .order("name");
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

export default async function HomePage() {
  const [shops, featuredProducts] = await Promise.all([getShops(), getFeaturedProducts()]);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-amber-50 to-stone-100 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-stone-900 mb-4">
              전국 스페셜티 커피를<br />한 곳에서
            </h1>
            <p className="text-xl text-stone-600 mb-8">
              엄선된 커피샵들의 메뉴를 둘러보고 나만의 커피를 찾아보세요
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/shops"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                샵 둘러보기
              </Link>
              <Link
                href="/products"
                className="border border-stone-300 text-stone-700 px-8 py-3 rounded-lg font-medium hover:bg-white transition-colors"
              >
                전체 메뉴
              </Link>
            </div>
          </div>
        </section>

        {/* Shops */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-stone-900">입점 샵</h2>
            <Link href="/shops" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.slug}`}>
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
                    <span className="text-5xl">☕</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-900">{shop.name}</h3>
                    {shop.description && (
                      <p className="text-sm text-stone-500 mt-1 line-clamp-2">{shop.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {shops.length === 0 && (
              <p className="text-stone-500 col-span-3 text-center py-8">등록된 샵이 없습니다.</p>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-stone-900">추천 메뉴</h2>
              <Link href="/products" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                전체 보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const shop = product.shops as { name: string; slug: string } | null;
                return (
                  <div key={product.id} className="bg-stone-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
                      <span className="text-4xl">☕</span>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-amber-600 font-medium mb-1">{shop?.name}</p>
                      <h3 className="font-semibold text-stone-900">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{product.description}</p>
                      )}
                      <p className="text-sm font-bold text-stone-900 mt-2">
                        {product.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                );
              })}
              {featuredProducts.length === 0 && (
                <p className="text-stone-500 col-span-4 text-center py-8">추천 메뉴가 없습니다.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
