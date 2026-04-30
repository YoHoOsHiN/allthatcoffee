import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "카테고리" };

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).single();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .eq("shop_id", shop?.id ?? "")
    .order("sort_order");

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-900">카테고리</h1>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">순서</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">이름</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">슬러그</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(categories ?? []).map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-stone-500">{cat.sort_order}</td>
                  <td className="px-4 py-3 font-medium text-stone-900">{cat.name}</td>
                  <td className="px-4 py-3 text-stone-500">{cat.slug}</td>
                </tr>
              ))}
              {(categories ?? []).length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-stone-500">
                    카테고리가 없습니다.
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
