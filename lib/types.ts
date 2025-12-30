export type HubSlug =
  | "car-type"
  | "brand-domestic"
  | "brand-import"
  | "condition-type"
  | "customer-type"
  | "price-compare"
  | "guide-review";

export type KeywordType = "detail" | "guide" | "brand" | "platform";

export interface Hub {
  slug: HubSlug;
  title: string;
  description: string;
  role: string;
}

export interface KeywordItem {
  slug: string;
  keyword: string;
  pageTitle?: string;
  type: KeywordType;
  hubSlug: HubSlug;
  isFeatured?: boolean;
}

