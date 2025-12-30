import type { HubSlug } from "./types";

export const MAIN_NAV = [
  {
    label: "장기렌트카 홈",
    href: "/"
  },
  {
    label: "가격·조건 총정리",
    href: "/longterm-rent-guide"
  },
  {
    label: "허브 모음",
    href: "/hub"
  }
] as const;

export const HUB_NAV: { slug: HubSlug; label: string }[] = [
  { slug: "car-type", label: "차종별" },
  { slug: "brand-domestic", label: "국산차" },
  { slug: "brand-import", label: "수입차" },
  { slug: "condition-type", label: "조건·유형" },
  { slug: "customer-type", label: "대상별" },
  { slug: "price-compare", label: "가격 비교" },
  { slug: "guide-review", label: "가이드·후기" }
];

export const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Disclaimer", href: "/disclaimer" }
];

