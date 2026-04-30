import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-700 flex items-center justify-center">
              <span className="text-white text-sm">☕</span>
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900">COFFEEMALL</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/shops"
              className="px-4 py-2 rounded-xl text-[14px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              전체 샵
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl text-[14px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              전체 메뉴
            </Link>
          </nav>

          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="검색"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
