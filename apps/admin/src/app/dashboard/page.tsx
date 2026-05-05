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
        <h1 className="text-2xl font-bold text-[#1C0F0A] mb-6 tracking-tight">대시보드</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="전체 샵" value={shopCount ?? 0} icon="🏪" color="amber" />
          <StatCard label="전체 유저" value={userCount ?? 0} icon="👥" color="gold" />
          <StatCard label="전체 주문" value={orderCount ?? 0} icon="📋" color="mocha" />
        </div>

        <div className="bg-white rounded-2xl border border-[#DCC8B0] shadow-sm">
          <div className="px-5 py-4 border-b border-[#F0E6D8] flex items-center justify-between">
            <h2 className="font-semibold text-[#1C0F0A]">최근 등록 샵</h2>
          </div>
          <div className="divide-y divide-[#F0E6D8]">
            {(recentShops ?? []).map((shop) => (
              <div key={shop.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1C0F0A]">{shop.name}</p>
                  <p className="text-xs text-[#C4A07A]">{shop.slug}.domain.com</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${shop.is_active ? "bg-green-100 text-green-700" : "bg-[#F0E6D8] text-[#C4A07A]"}`}>
                    {shop.is_active ? "운영 중" : "비활성"}
                  </span>
                  <span className="text-xs text-[#C4A07A]">
                    {new Date(shop.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </div>
            ))}
            {(recentShops ?? []).length === 0 && (
              <p className="text-sm text-[#C4A07A] text-center py-8">등록된 샵이 없습니다.</p>
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
  color: "amber" | "gold" | "mocha";
}) {
  const colorClass = {
    amber: "bg-[#FAF6F0] border-[#DCC8B0]",
    gold: "bg-[#F0E6D8] border-[#DCC8B0]",
    mocha: "bg-[#FAF6F0] border-[#DCC8B0]",
  }[color];

  const iconBg = {
    amber: "bg-[#C17C24]/15",
    gold: "bg-[#D4A853]/15",
    mocha: "bg-[#6B4226]/10",
  }[color];

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[#6B4226]">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-[#1C0F0A]">{value.toLocaleString()}</p>
    </div>
  );
}
