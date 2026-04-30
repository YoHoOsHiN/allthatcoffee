"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: "📊" },
  { href: "/shops", label: "샵 관리", icon: "🏪" },
  { href: "/users", label: "유저 관리", icon: "👥" },
  { href: "/orders", label: "전체 주문", icon: "📋" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-stone-900 flex flex-col min-h-screen">
      <div className="p-5 border-b border-stone-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">☕</span>
          <div>
            <p className="font-bold text-white text-sm leading-tight">CoffeeShop</p>
            <p className="text-xs text-stone-400">Company Admin</p>
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
                  ? "bg-amber-600 text-white"
                  : "text-stone-400 hover:bg-stone-800 hover:text-white",
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
