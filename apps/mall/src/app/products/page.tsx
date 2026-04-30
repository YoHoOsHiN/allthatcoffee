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

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">전체 메뉴</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {(products ?? []).map((product) => {
            const shop = product.shops as { name: string; slug: string } | null;
            return (
              <div key={product.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
                  <span className="text-4xl">☕</span>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-amber-600 mb-1">{shop?.name}</p>
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
        </div>
      </main>
    </>
  );
}
