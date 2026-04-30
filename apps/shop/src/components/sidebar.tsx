"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: "📊" },
  { href: "/products", label: "메뉴 관리", icon: "☕" },
  { href: "/categories", label: "카테고리", icon: "📂" },
  { href: "/orders", label: "주문 관리", icon: "📋" },
  { href: "/settings", label: "샵 설정", icon: "⚙️" },
];

export function Sidebar({ shopName }: { shopName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-stone-200 flex flex-col min-h-screen">
      <div className="p-5 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <div>
            <p className="font-bold text-stone-900 text-sm leading-tight">{shopName}</p>
            <p className="text-xs text-stone-400">Shop Admin</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors",
                active
                  ? "bg-amber-50 text-amber-700"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
              ].join(" ")}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
