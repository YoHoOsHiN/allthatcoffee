import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Shop Admin",
    default: "Shop Admin",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
