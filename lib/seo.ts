import type { Metadata } from "next";
import { SITE } from "./site";
import hubs from "@/data/hubs.json";
import keywords from "@/data/keywords.json";
import type { HubSlug, KeywordItem } from "./types";
import { HERO_IMAGE } from "./images";

const hubMap = new Map(hubs.map((h) => [h.slug as HubSlug, h]));
const keywordMap = new Map<string, KeywordItem>(
  (keywords as KeywordItem[]).map((k) => [k.slug, k])
);

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = SITE.domain.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function getHubBySlug(slug: HubSlug) {
  return hubMap.get(slug);
}

export function getKeywordBySlug(slug: string): KeywordItem | undefined {
  return keywordMap.get(slug);
}

export function getKeywordsByHub(hubSlug: HubSlug): KeywordItem[] {
  return (keywords as KeywordItem[]).filter((k) => k.hubSlug === hubSlug);
}

export function getSiblingsForSlug(slug: string): KeywordItem[] {
  const current = getKeywordBySlug(slug);
  if (!current) return [];
  return (keywords as KeywordItem[]).filter(
    (k) => k.hubSlug === current.hubSlug && k.slug !== current.slug
  );
}

export function getGuideForHub(hubSlug: HubSlug): KeywordItem | undefined {
  return (keywords as KeywordItem[]).find(
    (k) => k.hubSlug === hubSlug && (k.type === "guide" || k.type === "platform")
  );
}

export function rootMetadata(): Metadata {
  const title = "장기렌트카 가격 비교·조건·차종 총정리 허브";
  const description =
    "장기렌트카 가격, 조건, 차종, 개인·법인별 장기렌트 구조를 한 번에 정리한 정보 허브입니다. 월 납입금 결정 요소와 무보증·초기비용, 출고 대기 기간까지 차분하게 안내합니다.";
  const url = absoluteUrl("/");
  return {
    metadataBase: new URL(SITE.domain),
    title,
    description,
    alternates: {
      canonical: url
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      images: [
        {
          url: absoluteUrl(HERO_IMAGE.src),
          width: 1200,
          height: 630,
          alt: HERO_IMAGE.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(HERO_IMAGE.src)]
    }
  };
}

export function hubIndexMetadata(): Metadata {
  const title = "장기렌트카 허브 모음 | 차종·브랜드·조건·가격 비교";
  const description =
    "차종별, 브랜드별, 조건·대상별 장기렌트카 허브 페이지를 한 곳에 모았습니다. 관심 있는 허브를 선택해 세부 가이드를 확인해 보세요.";
  const url = absoluteUrl("/hub");
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      images: [
        {
          url: absoluteUrl(HERO_IMAGE.src),
          width: 1200,
          height: 630,
          alt: HERO_IMAGE.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(HERO_IMAGE.src)]
    }
  };
}

export function hubMetadata(hubSlug: HubSlug): Metadata {
  const hub = getHubBySlug(hubSlug);
  const baseTitle = hub?.title ?? "장기렌트카 정보 허브";
  const title = `${baseTitle} | 장기렌트카 조건·가격 비교`;
  const description =
    hub?.description ??
    "장기렌트카 주제를 묶은 허브 페이지입니다. 차종, 조건, 대상, 가격 비교 등 원하는 정보를 묶어서 확인해 보세요.";
  const url = absoluteUrl(`/hub/${hubSlug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      images: [
        {
          url: absoluteUrl(HERO_IMAGE.src),
          width: 1200,
          height: 630,
          alt: HERO_IMAGE.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(HERO_IMAGE.src)]
    }
  };
}

export function guideMainMetadata(): Metadata {
  const title = "장기렌트카 가격·조건 총정리 | 월 납입금 구조 가이드";
  const description =
    "장기렌트카 월 납입금이 어떻게 결정되는지, 보증금·무보증·초기비용, 개인·법인 차이, 리스 vs 렌트 구조까지 한 번에 정리한 총론 가이드입니다.";
  const url = absoluteUrl("/longterm-rent-guide");
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "article",
      images: [
        {
          url: absoluteUrl(HERO_IMAGE.src),
          width: 1200,
          height: 630,
          alt: HERO_IMAGE.alt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(HERO_IMAGE.src)]
    }
  };
}

export function detailMetadata(slug: string, fallbackTitle: string, pageTitle?: string, ogImage?: string): Metadata {
  const baseTitle = pageTitle || `${fallbackTitle} 장기렌트 안내`;
  const description = `${fallbackTitle} 장기렌트 가격, 조건, 추천 대상, 계약 시 주의사항을 정리한 안내 페이지입니다. 실제 월 납입금에 영향을 주는 요소를 차분하게 확인해 보세요.`;
  const url = absoluteUrl(`/${slug}`);
  const og = ogImage ? absoluteUrl(ogImage) : absoluteUrl(HERO_IMAGE.src);
  return {
    title: baseTitle,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: baseTitle,
      description,
      url,
      siteName: SITE.name,
      type: "article",
      images: [
        {
          url: og,
          width: 1200,
          height: 630,
          alt: description
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description,
      images: [og]
    }
  };
}

