import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | CoffeeShop Mall",
    default: "CoffeeShop Mall — 전국 스페셜티 커피를 한 곳에서",
  },
  description: "전국 스페셜티 커피샵의 메뉴를 한 곳에서 만나보세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
