import Link from "next/link";

export function Header() {
  return (
    <header className="bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#DCC8B0]/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1C0F0A] flex items-center justify-center shadow-sm">
              <span className="text-white text-sm">☕</span>
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-[#1C0F0A] font-[family-name:var(--font-display)]">
              COFFEEMALL
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/shops"
              className="px-4 py-2 rounded-xl text-[14px] font-medium text-[#6B4226] hover:text-[#C17C24] hover:bg-[#F0E6D8] transition-colors duration-200"
            >
              전체 샵
            </Link>
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl text-[14px] font-medium text-[#6B4226] hover:text-[#C17C24] hover:bg-[#F0E6D8] transition-colors duration-200"
            >
              전체 메뉴
            </Link>
          </nav>

          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#C4A07A] hover:text-[#C17C24] hover:bg-[#F0E6D8] transition-colors duration-200"
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
