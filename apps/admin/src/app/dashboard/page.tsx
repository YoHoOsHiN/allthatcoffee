import { Metadata } from "next";
import { AdminLayout } from "@/components/admin-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "대시보드" };

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [
    { count: shopCount },
    { count: userCount },
    { count: orderCount },
    { data: recentShops },
  ] = await Promise.all([
    supabase.from("shops").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("shops").select("id, name, slug, is_active, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">대시보드</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="전체 샵" value={shopCount ?? 0} icon="🏪" color="amber" />
          <StatCard label="전체 유저" value={userCount ?? 0} icon="👥" color="blue" />
          <StatCard label="전체 주문" value={orderCount ?? 0} icon="📋" color="green" />
        </div>

        <div className="bg-white rounded-xl border border-stone-200">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">최근 등록 샵</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {(recentShops ?? []).map((shop) => (
              <div key={shop.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{shop.name}</p>
                  <p className="text-xs text-stone-400">{shop.slug}.domain.com</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${shop.is_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                    {shop.is_active ? "운영 중" : "비활성"}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(shop.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            ))}
            {(recentShops ?? []).length === 0 && (
              <p className="text-sm text-stone-500 text-center py-8">등록된 샵이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: "amber" | "blue" | "green";
}) {
  const colorClass = {
    amber: "bg-amber-50 border-amber-200",
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
  }[color];

  return (
    <div className={`rounded-xl border p-5 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-stone-500">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-stone-900">{value.toLocaleString()}</p>
    </div>
  );
}
