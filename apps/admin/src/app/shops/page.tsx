import { Metadata } from "next";
import Link from "next/link";
import { AdminLayout } from "@/components/admin-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "샵 관리" };

export default async function AdminShopsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: shops } = await supabase
    .from("shops")
    .select("id, name, slug, description, is_active, created_at, users(name, email)")
    .order("created_at", { ascending: false });

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-900">샵 관리</h1>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">샵 이름</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">도메인</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">오너</th>
                <th className="text-center px-4 py-3 text-stone-600 font-medium">상태</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">등록일</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(shops ?? []).map((shop) => {
                const owner = shop.users as { name: string | null; email: string } | null;
                return (
                  <tr key={shop.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{shop.name}</td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{shop.slug}.domain.com</td>
                    <td className="px-4 py-3 text-stone-500">{owner?.name ?? owner?.email ?? "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${shop.is_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                        {shop.is_active ? "운영 중" : "비활성"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400 text-xs">
                      {new Date(shop.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/shops/${shop.id}`} className="text-amber-600 hover:text-amber-700 font-medium">
                        상세
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {(shops ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                    등록된 샵이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
