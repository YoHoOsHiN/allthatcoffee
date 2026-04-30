import { Sidebar } from "./sidebar";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .single();

  const shopName = shop?.name ?? "내 샵";

  return (
    <div className="flex min-h-screen">
      <Sidebar shopName={shopName} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-600">{user.email}</span>
          </div>
        </header>
        <main className="flex-1 p-6 bg-stone-50">{children}</main>
      </div>
    </div>
  );
}
