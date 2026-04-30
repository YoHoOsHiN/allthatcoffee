import { Metadata } from "next";
import { AdminLayout } from "@/components/admin-layout";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "유저 관리" };

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "슈퍼 어드민",
  SHOP_OWNER: "샵 오너",
  SHOP_STAFF: "스태프",
  CUSTOMER: "고객",
};

const roleColor: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700",
  SHOP_OWNER: "bg-amber-100 text-amber-700",
  SHOP_STAFF: "bg-blue-100 text-blue-700",
  CUSTOMER: "bg-stone-100 text-stone-600",
};

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: users } = await supabase
    .from("users")
    .select("id, email, name, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">유저 관리</h1>
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">이름</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">이메일</th>
                <th className="text-center px-4 py-3 text-stone-600 font-medium">역할</th>
                <th className="text-left px-4 py-3 text-stone-600 font-medium">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {(users ?? []).map((user) => (
                <tr key={user.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-900">{user.name ?? "-"}</td>
                  <td className="px-4 py-3 text-stone-500">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor[user.role] ?? "bg-stone-100 text-stone-600"}`}>
                      {roleLabel[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-400 text-xs">
                    {new Date(user.created_at).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
              {(users ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                    유저가 없습니다.
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
