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

  const list = shops ?? [];

  return (
    <>
      <Header />
      <main className="bg-[#FAF6F0] min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-display)] text-[32px] font-bold text-[#1C0F0A] tracking-tight italic">
              전체 샵
            </h1>
            <p className="text-[#C4A07A] text-[14px] mt-1">{list.length}개의 커피샵</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.slug}`} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-200 border border-[#DCC8B0]">
                  <div className="h-44 bg-gradient-to-br from-[#2D1810] to-[#6B4226] relative overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 30% 60%, rgba(193,124,36,0.5) 0%, transparent 60%)",
                      }}
                    />
                    <span className="relative text-7xl">☕</span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-extrabold text-[16px] text-[#1C0F0A] group-hover:text-[#C17C24] transition-colors duration-200">
                      {shop.name}
                    </h2>
                    {shop.description && (
                      <p className="text-[13px] text-[#C4A07A] mt-1.5 line-clamp-2">{shop.description}</p>
                    )}
                    {shop.address && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          className="text-[#DCC8B0] flex-shrink-0"
                        >
                          <path d="M12 2a7 7 0 0 0-7 7c0 4.9 7 13 7 13s7-8.1 7-13a7 7 0 0 0-7-7z" />
                          <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        <span className="text-[12px] text-[#C4A07A] line-clamp-1">{shop.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {list.length === 0 && (
              <p className="text-[#C4A07A] col-span-3 text-center py-16 text-sm">등록된 샵이 없습니다.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
