import type { HubSlug } from "./types";
import { SITE } from "./site";
import { absoluteUrl, getHubBySlug, getKeywordBySlug } from "./seo";

export function jsonLdRoot() {
  const org = {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.domain,
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE.contact.email,
      contactType: "customer support"
    }
  };
  const website = {
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.domain
  };
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "장기렌트카",
        item: SITE.domain
      }
    ]
  };
  return [org, website, breadcrumb];
}

export function jsonLdHub(hubSlug: HubSlug) {
  const hub = getHubBySlug(hubSlug);
  const url = absoluteUrl(`/hub/${hubSlug}`);
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "장기렌트카",
        item: SITE.domain
      },
      {
        "@type": "ListItem",
        position: 2,
        name: hub?.title ?? "장기렌트카 허브",
        item: url
      }
    ]
  };
  const webpage = {
    "@type": "WebPage",
    url,
    name: hub?.title ?? "장기렌트카 허브",
    description: hub?.description,
    author: {
      "@type": "Person",
      name: SITE.editorial.authorName
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name
    },
    datePublished: SITE.editorial.lastUpdatedDefault,
    dateModified: SITE.editorial.lastUpdatedDefault
  };
  const faq = {
    "@type": "FAQPage",
    mainEntity: []
  };
  return [breadcrumb, webpage, faq];
}

export function jsonLdGuideMain() {
  const url = absoluteUrl("/longterm-rent-guide");
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "장기렌트카",
        item: SITE.domain
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "장기렌트카 가격·조건 총정리",
        item: url
      }
    ]
  };
  const webpage = {
    "@type": "WebPage",
    url,
    name: "장기렌트카 가격·조건 총정리",
    description:
      "장기렌트카 월 납입금 결정 요소, 보증금·무보증, 개인·법인 차이, 리스 vs 렌트 구조를 정리한 총론 가이드입니다.",
    author: {
      "@type": "Person",
      name: SITE.editorial.authorName
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name
    },
    datePublished: SITE.editorial.lastUpdatedDefault,
    dateModified: SITE.editorial.lastUpdatedDefault
  };
  const faq = {
    "@type": "FAQPage",
    mainEntity: []
  };
  return [breadcrumb, webpage, faq];
}

export function jsonLdDetail(slug: string) {
  const item = getKeywordBySlug(slug);
  const url = absoluteUrl(`/${slug}`);
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "장기렌트카",
        item: SITE.domain
      },
      item?.hubSlug
        ? {
            "@type": "ListItem",
            position: 2,
            name: getHubBySlug(item.hubSlug)?.title ?? "장기렌트카 허브",
            item: absoluteUrl(`/hub/${item.hubSlug}`)
          }
        : undefined,
      {
        "@type": "ListItem",
        position: 3,
        name: item?.pageTitle || `${item?.keyword ?? "장기렌트카"} 장기렌트 안내`,
        item: url
      }
    ].filter(Boolean)
  };
  const article = {
    "@type": "Article",
    headline: item?.pageTitle || `${item?.keyword ?? "장기렌트카"} 장기렌트 안내`,
    author: {
      "@type": "Person",
      name: SITE.editorial.authorName
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name
    },
    datePublished: SITE.editorial.lastUpdatedDefault,
    dateModified: SITE.editorial.lastUpdatedDefault,
    mainEntityOfPage: url
  };
  const faq = {
    "@type": "FAQPage",
    mainEntity: []
  };
  return [breadcrumb, article, faq];
}

