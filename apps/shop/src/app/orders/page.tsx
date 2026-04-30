import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "주문 관리" };

const statusLabel: Record<string, string> = {
  PENDING: "대기",
  CONFIRMED: "확인",
  PREPARING: "제조 중",
  READY: "수령 대기",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-green-100 text-green-700",
  COMPLETED: "bg-stone-100 text-stone-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: shop } = await supabase.from("shops").select("id").eq("owner_id", user.id).single();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total_amount, note, created_at")
    .eq("shop_id", shop?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">주문 관리</h1>
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">주문번호</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">일시</th>
                <th className="text-right px-4 py-3 text-stone-600 font-medium">금액</th>
                <th className="text-center px-4 py-3 text-stone-600 font-medium">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(orders ?? []).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-900">{order.order_number}</td>
                  <td className="px-4 py-3 text-stone-500">
                    {new Date(order.created_at).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-right text-stone-900">
                    {order.total_amount.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[order.status] ?? "bg-stone-100 text-stone-600"}`}>
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(orders ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                    주문이 없습니다.
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
