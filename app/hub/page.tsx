import type { Metadata } from "next";
import hubs from "@/data/hubs.json";
import keywords from "@/data/keywords.json";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CardGrid } from "@/components/CardGrid";
import { hubIndexMetadata } from "@/lib/seo";
import type { KeywordItem } from "@/lib/types";

export const dynamic = "error";

export function generateMetadata(): Metadata {
  return hubIndexMetadata();
}

export default function Page() {
  const hubList = hubs;
  const kw = keywords as KeywordItem[];

  return (
    <div className="container-page py-8 pb-24">
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          { label: "장기렌트카 허브 모음" }
        ]}
      />
      <h1 className="heading-h1">장기렌트카 허브 모음</h1>
      <p className="mt-4 text-body">
        장기렌트카를 조금 더 구체적으로 살펴보고 싶다면, 아래 허브 중에서 관심 있는
        주제를 선택해 주세요. 차종·브랜드·조건·대상·가격 비교·가이드 허브로 나뉘어 있어
        필요한 정보에 빠르게 도달할 수 있습니다.
      </p>

      <CardGrid
        title="허브별 안내"
        items={hubList.map((hub) => ({
          href: `/hub/${hub.slug}`,
          title: hub.title,
          badge: hub.role,
          description: hub.description
        }))}
      />

      <section className="mt-12">
        <h2 className="heading-h2">허브 대표 상세 모음</h2>
        <p className="mt-2 text-sm text-slate-700">
          각 허브에서 전환 가능성이 높은 대표 상세 페이지를 모아두었습니다.
        </p>
        <ul className="mt-4 space-y-3 text-sm text-slate-800">
          {hubList.map((hub) => {
            const featured =
              kw.find((k) => k.hubSlug === hub.slug && k.isFeatured) ||
              kw.find((k) => k.hubSlug === hub.slug);
            if (!featured) return null;
            return (
              <li key={hub.slug}>
                <span className="mr-2 inline-flex min-w-[80px] rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {hub.title}
                </span>
                <a href={`/${featured.slug}`} className="font-semibold">
                  {featured.pageTitle || `${featured.keyword} 장기렌트`}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

