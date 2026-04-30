import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "샵 설정" };

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("id, name, slug, description, address, phone, email")
    .eq("owner_id", user.id)
    .single();

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">샵 설정</h1>
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          {shop ? (
            <dl className="space-y-4">
              <InfoRow label="샵 이름" value={shop.name} />
              <InfoRow label="서브도메인" value={`${shop.slug}.domain.com`} />
              <InfoRow label="설명" value={shop.description ?? "-"} />
              <InfoRow label="주소" value={shop.address ?? "-"} />
              <InfoRow label="전화번호" value={shop.phone ?? "-"} />
              <InfoRow label="이메일" value={shop.email ?? "-"} />
            </dl>
          ) : (
            <p className="text-stone-500 text-sm">연결된 샵이 없습니다. 관리자에게 문의하세요.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
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
