"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1C0F0A] relative overflow-hidden flex-col items-center justify-center p-12">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 55%, rgba(193,124,36,0.25) 0%, transparent 55%), radial-gradient(circle at 75% 30%, rgba(45,24,16,0.9) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">☕</span>
          </div>
          <p className="text-[#C17C24] text-xs font-bold tracking-[0.2em] uppercase mb-4">CoffeeShop</p>
          <h2
            className="text-[40px] font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
          >
            Company Admin
          </h2>
          <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
            회사 관리자 전용 시스템입니다. 권한이 있는 담당자만 접근 가능합니다.
          </p>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3 px-12">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/20 text-xs tracking-widest uppercase whitespace-nowrap">회사 관리자 전용</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-[#FAF6F0] px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-full bg-[#1C0F0A] flex items-center justify-center">
              <span className="text-white text-lg">☕</span>
            </div>
            <span
              className="font-bold text-[18px] text-[#1C0F0A]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              CoffeeShop
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-[#1C0F0A] tracking-tight">Company Admin</h1>
            <p className="text-[#C4A07A] text-sm mt-1">회사 관리자 전용</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#2D1810]">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-[#DCC8B0] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C0F0A] focus:border-[#1C0F0A] placeholder:text-[#C4A07A] transition-all duration-200"
                placeholder="admin@coffeeshop.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#2D1810]">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-[#DCC8B0] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C0F0A] focus:border-[#1C0F0A] placeholder:text-[#C4A07A] transition-all duration-200"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1C0F0A] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#2D1810] disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md tracking-wide mt-1"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
