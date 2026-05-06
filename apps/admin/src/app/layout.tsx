import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | CoffeeShop Admin",
    default: "CoffeeShop Admin",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-[#FAF6F0] text-[#2D1810] antialiased">
        {children}
      </body>
    </html>
  );
}
