import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "장기렌트카 가격 비교·조건·차종 가이드",
    template: "%s | 장기렌트카 가이드"
  },
  description:
    "장기렌트카 가격 비교, 조건, 차종, 개인·법인별 장기렌트 구조를 차분하게 정리한 정보 허브입니다.",
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "icon", url: "/icon-512.png" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

