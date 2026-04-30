import { Metadata } from "next";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "전체 메뉴" };

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, description, price, image_url, shop_id, shops(name, slug)")
    .eq("is_available", true)
    .order("name");

  const list = products ?? [];

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-[28px] font-black text-gray-900 tracking-tight">전체 메뉴</h1>
            <p className="text-gray-400 text-[14px] mt-1">{list.length}개의 메뉴</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {list.map((product) => {
              const shop = product.shops as { name: string; slug: string } | null;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
                    <span className="text-4xl">☕</span>
                  </div>
                  <div className="p-3.5">
                    {shop?.name && (
                      <span className="inline-block text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md mb-1.5">
                        {shop.name}
                      </span>
                    )}
                    <h3 className="font-bold text-[13px] text-gray-900 line-clamp-1">{product.name}</h3>
                    {product.description && (
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                    )}
                    <p className="text-[15px] font-black text-gray-900 mt-2">
                      {product.price.toLocaleString()}
                      <span className="text-[11px] font-semibold text-gray-400 ml-0.5">원</span>
                    </p>
                  </div>
                </div>
              );
            })}
            {list.length === 0 && (
              <p className="text-gray-400 col-span-5 text-center py-16 text-sm">등록된 메뉴가 없습니다.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
