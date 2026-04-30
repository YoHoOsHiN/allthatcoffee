import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "전체 샵" };

export default async function ShopsPage() {
  const { data: shops } = await supabase
    .from("shops")
    .select("id, name, slug, description, address")
    .eq("is_active", true)
    .order("name");

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">전체 샵</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(shops ?? []).map((shop) => (
            <Link key={shop.id} href={`/shops/${shop.slug}`}>
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
                  <span className="text-6xl">☕</span>
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-lg text-stone-900">{shop.name}</h2>
                  {shop.description && (
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2">{shop.description}</p>
                  )}
                  {shop.address && (
                    <p className="text-xs text-stone-400 mt-2">📍 {shop.address}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
