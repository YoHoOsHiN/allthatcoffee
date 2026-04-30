import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "대시보드" };

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .single();

  const shopId = shop?.id;

  const [{ count: productCount }, { count: orderCount }, { data: recentOrders }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("shop_id", shopId ?? ""),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("shop_id", shopId ?? ""),
    supabase
      .from("orders")
      .select("id, order_number, status, total_amount, created_at")
      .eq("shop_id", shopId ?? "")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const statusLabel: Record<string, string> = {
    PENDING: "대기",
    CONFIRMED: "확인",
    PREPARING: "제조 중",
    READY: "수령 대기",
    COMPLETED: "완료",
    CANCELLED: "취소",
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">대시보드</h1>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="전체 메뉴" value={productCount ?? 0} icon="☕" />
          <StatCard label="전체 주문" value={orderCount ?? 0} icon="📋" />
          <StatCard
            label="내 샵 도메인"
            value={shop?.slug ? `${shop.slug}.domain.com` : "-"}
            icon="🌐"
            small
          />
        </div>

        {/* 최근 주문 */}
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="px-5 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-900">최근 주문</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {(recentOrders ?? []).length === 0 && (
              <p className="text-sm text-stone-500 text-center py-8">주문이 없습니다.</p>
            )}
            {(recentOrders ?? []).map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-900">{order.order_number}</p>
                  <p className="text-xs text-stone-400">
                    {new Date(order.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {statusLabel[order.status] ?? order.status}
                  </span>
                  <span className="text-sm font-medium text-stone-900">
                    {order.total_amount.toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  label,
  value,
  icon,
  small,
}: {
  label: string;
  value: string | number;
  icon: string;
  small?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-stone-500">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={["font-bold text-stone-900", small ? "text-sm" : "text-2xl"].join(" ")}>{value}</p>
    </div>
  );
}
