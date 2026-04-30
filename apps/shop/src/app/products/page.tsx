import { Metadata } from "next";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "메뉴 관리" };

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).single();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, is_available, is_featured, categories(name)")
    .eq("shop_id", shop?.id ?? "")
    .order("sort_order");

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-900">메뉴 관리</h1>
          <Link
            href="/products/new"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            + 새 메뉴 추가
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">메뉴명</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">카테고리</th>
                <th className="text-right px-4 py-3 text-stone-600 font-medium">가격</th>
                <th className="text-center px-4 py-3 text-stone-600 font-medium">판매중</th>
                <th className="text-center px-4 py-3 text-stone-600 font-medium">추천</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(products ?? []).map((product) => {
                const category = product.categories as { name: string } | null;
                return (
                  <tr key={product.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{product.name}</td>
                    <td className="px-4 py-3 text-stone-500">{category?.name ?? "-"}</td>
                    <td className="px-4 py-3 text-right text-stone-900">{product.price.toLocaleString()}원</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${product.is_available ? "bg-green-500" : "bg-stone-300"}`} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.is_featured ? "⭐" : ""}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        편집
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {(products ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-500">
                    등록된 메뉴가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
