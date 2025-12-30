import Image from "next/image";
import hubs from "@/data/hubs.json";
import keywords from "@/data/keywords.json";
import { HERO_IMAGE } from "@/lib/images";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ChecklistBox } from "@/components/ChecklistBox";
import { CardGrid } from "@/components/CardGrid";
import { DisclosureBox } from "@/components/DisclosureBox";
import { rootMetadata } from "@/lib/seo";
import { jsonLdRoot } from "@/lib/jsonld";
import type { Metadata } from "next";
import type { KeywordItem } from "@/lib/types";

export const dynamic = "error";

export function generateMetadata(): Metadata {
  return rootMetadata();
}

export default function Page() {
  const hubsList = hubs;
  const keywordList = keywords as KeywordItem[];

  const featuredByHub = hubsList.map((hub) => {
    const featured = keywordList.find(
      (k) => k.hubSlug === hub.slug && k.isFeatured
    );
    return (
      featured || keywordList.find((k) => k.hubSlug === hub.slug) || null
    );
  });

  const popularDetails = keywordList.slice(0, 9);

  const jsonLd = jsonLdRoot();

  return (
    <div className="container-page py-8 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb items={[{ label: "장기렌트카" }]} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <h1 className="heading-h1">
            장기렌트카, 가격·조건·차종을 한 번에 정리한 실전 가이드
          </h1>
          <p className="mt-4 text-body">
            장기렌트카는 월 납입금, 보증금·무보증, 계약 기간, 잔존가 등 여러 요소가 함께
            작동하는 금융 상품입니다. 이 페이지에서는 할부·리스와의 차이, 개인·법인별
            유리한 선택, 출고 대기와 재고 이슈까지 차분하게 짚어 보며, 다음 단계로
            넘어가기 위한 허브 역할을 합니다.
          </p>
          <ul className="mt-4 prose-list text-sm text-slate-700">
            <li>월 납입금을 결정하는 핵심 요소를 이해하고 예산을 설정합니다.</li>
            <li>보증금·무보증, 초기비용 구조를 비교해 자금 부담을 줄입니다.</li>
            <li>개인·법인·사업자별 세무·비용처리 차이를 확인합니다.</li>
            <li>차종·브랜드·조건별 허브로 이동해 세부 정보를 살펴봅니다.</li>
          </ul>
        </div>
        <div className="relative h-56 overflow-hidden rounded-xl border border-shell-border bg-slate-100 sm:h-72">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      <ChecklistBox
        title="장기렌트카 계약 전 꼭 확인할 체크포인트"
        items={[
          {
            title: "월 납입금 구조",
            description:
              "차량 가격, 잔존가, 계약 기간, 연간 주행거리, 금리 등 어떤 항목이 월 납입금에 반영되는지 확인합니다."
          },
          {
            title: "보증금·무보증·초기비용",
            description:
              "보증금과 선납금, 등록 비용을 얼마나 부담하는지에 따라 승인 가능성과 월 납입금이 달라집니다."
          },
          {
            title: "개인·법인·사업자 조건",
            description:
              "법인·사업자는 비용처리와 부가세 환급, 개인은 한도와 보험 조건 등 서로 다른 기준이 적용됩니다."
          },
          {
            title: "출고·재고·즉시출고 여부",
            description:
              "인기 차종은 출고 대기가 길어질 수 있어, 취소 차량·재고·즉시출고 가능 여부를 함께 확인해야 합니다."
          }
        ]}
      />

      <CardGrid
        title="장기렌트카 허브 7개 한눈에 보기"
        subtitle="차종·브랜드·조건·대상·가격 비교·가이드로 나뉜 허브에서 원하는 정보로 바로 이동하세요."
        items={hubsList.map((hub) => ({
          href: `/hub/${hub.slug}`,
          title: hub.title,
          badge: hub.role,
          description: hub.description
        }))}
      />

      <CardGrid
        title="허브별 대표 상세 바로가기"
        subtitle="각 허브에서 전환 가능성이 높은 대표 상세 페이지를 1개씩 선정했습니다."
        items={featuredByHub
          .filter(Boolean)
          .map((item) => item as KeywordItem)
          .map((item) => ({
            href: `/${item.slug}`,
            title: item.pageTitle || `${item.keyword} 장기렌트 안내`,
            badge: item.keyword,
            description: "가격, 조건, 추천 대상, 주의사항을 정리한 상세 가이드입니다."
          }))}
      />

      <CardGrid
        title="인기·최신 장기렌트 상세"
        subtitle="상담과 검색 수요가 높은 상세 페이지를 모아 한 번에 비교할 수 있도록 구성했습니다."
        items={popularDetails.map((item) => ({
          href: `/${item.slug}`,
          title: item.pageTitle || `${item.keyword} 장기렌트`,
          badge: item.keyword,
          description: "실제 문의가 많은 조건과 선택 포인트를 정리했습니다."
        }))}
      />

      <section className="mt-12">
        <h2 className="heading-h2">자주 묻는 질문(FAQ)</h2>
        <div className="mt-4 space-y-4 text-sm text-slate-800">
          <details className="card p-4">
            <summary className="cursor-pointer font-semibold">
              장기렌트카와 할부·리스는 무엇이 가장 다르나요?
            </summary>
            <p className="mt-2 text-slate-700">
              장기렌트는 차량 소유권이 회사에 있고 이용자는 사용료를 내는 구조이며, 할부는
              소유권을 가져가면서 대출을 갚는 방식입니다. 리스는 금융 구조가 비슷하지만
              보험·정비, 사고 처리 책임 범위 등에서 장기렌트와 차이가 있어 계약 전 비교가
              필요합니다.
            </p>
          </details>
          <details className="card p-4">
            <summary className="cursor-pointer font-semibold">
              무보증·초기비용 0원 장기렌트는 정말 추가 부담이 없나요?
            </summary>
            <p className="mt-2 text-slate-700">
              무보증·초기비용 0원 상품은 계약 시 큰 목돈이 들지 않는 대신 월 납입금이 다소
              높아질 수 있습니다. 심사 기준과 승인 한도에 영향을 줄 수 있으므로, 보증금 일부
              납입과 어떤 차이가 있는지 견적 단계에서 함께 비교하는 것이 좋습니다.
            </p>
          </details>
          <details className="card p-4">
            <summary className="cursor-pointer font-semibold">
              법인·사업자 장기렌트는 어떤 비용처리 장점이 있나요?
            </summary>
            <p className="mt-2 text-slate-700">
              일정 한도 내에서 렌트료를 비용으로 처리할 수 있고, 일부 차량은 부가세 환급이
              가능합니다. 업종·차종·사용 용도에 따라 적용 범위가 달라질 수 있으므로, 세무
              담당자와 함께 계약 구조를 확인하는 것이 안전합니다.
            </p>
          </details>
        </div>
      </section>

      <DisclosureBox>
        <p>
          이 페이지는 장기렌트카 상품을 이해하는 데 도움을 주기 위한 일반 정보로, 실제
          계약 조건은 렌터사와 금융사, 고객 신용도에 따라 달라질 수 있습니다.
        </p>
        <p>
          금리, 프로모션, 보조금, 세법 등은 수시로 변경될 수 있으므로, 계약 전 반드시
          최신 조건을 다시 확인하시기 바랍니다.
        </p>
      </DisclosureBox>
    </div>
  );
}

