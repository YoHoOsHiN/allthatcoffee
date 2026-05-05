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
    <aside className="w-60 bg-[#1C0F0A] flex flex-col min-h-screen">
      <div className="p-5 border-b border-[#2D1810]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C17C24]/20 border border-[#C17C24]/40 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">☕</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-sm leading-tight truncate">{shopName}</p>
            <p className="text-xs text-[#C4A07A]">Shop Admin</p>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors duration-200",
                active
                  ? "bg-[#C17C24] text-white"
                  : "text-[#C4A07A] hover:bg-[#2D1810] hover:text-white",
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
