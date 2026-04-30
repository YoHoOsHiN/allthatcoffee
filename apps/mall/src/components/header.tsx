import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span className="font-bold text-xl text-stone-900">CoffeeShop Mall</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shops" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              전체 샵
            </Link>
            <Link href="/products" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              전체 메뉴
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
