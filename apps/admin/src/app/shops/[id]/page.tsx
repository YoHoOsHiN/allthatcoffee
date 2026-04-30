import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("shops").select("name").eq("id", id).single();
  return { title: data?.name ?? "샵 상세" };
}

export default async function AdminShopDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("id, name, slug, description, address, phone, email, is_active, created_at")
    .eq("id", id)
    .single();

  if (!shop) notFound();

  const [{ count: productCount }, { count: orderCount }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("shop_id", id),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("shop_id", id),
  ]);

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-stone-900">{shop.name}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${shop.is_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
            {shop.is_active ? "운영 중" : "비활성"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <p className="text-2xl font-bold text-stone-900">{productCount ?? 0}</p>
            <p className="text-sm text-stone-500 mt-1">메뉴</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <p className="text-2xl font-bold text-stone-900">{orderCount ?? 0}</p>
            <p className="text-sm text-stone-500 mt-1">주문</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <dl className="space-y-3">
            <InfoRow label="서브도메인" value={`${shop.slug}.domain.com`} />
            <InfoRow label="설명" value={shop.description ?? "-"} />
            <InfoRow label="주소" value={shop.address ?? "-"} />
            <InfoRow label="전화번호" value={shop.phone ?? "-"} />
            <InfoRow label="이메일" value={shop.email ?? "-"} />
            <InfoRow label="등록일" value={new Date(shop.created_at).toLocaleString("ko-KR")} />
          </dl>
        </div>
      </div>
    </AdminLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2 border-b border-stone-100 last:border-0">
      <dt className="w-28 text-sm text-stone-500 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-stone-900">{value}</dd>
    </div>
  );
}
