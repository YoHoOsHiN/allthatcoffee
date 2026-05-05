"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1C0F0A] via-[#2D1810] to-[#4A2515] relative overflow-hidden flex-col items-center justify-center p-12">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 60%, rgba(193,124,36,0.35) 0%, transparent 60%)",
          }}
        />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#C17C24]/20 border border-[#C17C24]/30 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">☕</span>
          </div>
          <h2
            className="text-[42px] font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
          >
            Welcome back
          </h2>
          <p className="text-[#D4A853] text-lg font-medium">Your shop. Your craft.</p>
          <p className="text-white/40 text-sm mt-3 max-w-xs mx-auto">
            Manage your specialty coffee shop with elegance and precision.
          </p>
        </div>
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/20 text-xs tracking-widest uppercase">CoffeeMall — Shop Admin</p>
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
              COFFEEMALL
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-[#1C0F0A] tracking-tight">Shop Admin</h1>
            <p className="text-[#C4A07A] text-sm mt-1">샵 관리자 로그인</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#2D1810]">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-[#DCC8B0] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C17C24] focus:border-[#C17C24] placeholder:text-[#C4A07A] transition-all duration-200"
                placeholder="shop@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#2D1810]">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-[#DCC8B0] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C17C24] focus:border-[#C17C24] placeholder:text-[#C4A07A] transition-all duration-200"
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
              className="bg-[#C17C24] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#9A6020] disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md tracking-wide mt-1"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
