import type { Metadata } from "next";
import type { HubSlug } from "@/lib/types";
import hubs from "@/data/hubs.json";
import keywords from "@/data/keywords.json";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ChecklistBox } from "@/components/ChecklistBox";
import { CardGrid } from "@/components/CardGrid";
import { DisclosureBox } from "@/components/DisclosureBox";
import { hubMetadata, getKeywordsByHub } from "@/lib/seo";
import { jsonLdHub } from "@/lib/jsonld";

export const dynamic = "error";

export function generateStaticParams() {
  return (hubs as { slug: HubSlug }[]).map((hub) => ({
    hubSlug: hub.slug
  }));
}

export function generateMetadata({
  params
}: {
  params: { hubSlug: HubSlug };
}): Metadata {
  return hubMetadata(params.hubSlug);
}

export default function Page({ params }: { params: { hubSlug: HubSlug } }) {
  const hub = (hubs as { slug: HubSlug; title: string; description: string }[]).find(
    (h) => h.slug === params.hubSlug
  );
  const allKeywords = getKeywordsByHub(params.hubSlug);
  const recommended = allKeywords.slice(0, 6);

  const jsonLd = jsonLdHub(params.hubSlug);

  const checklistMap: Record<string, { title: string; items: { title: string; description: string }[] }> =
    {
      "car-type": {
        title: "차종별 장기렌트 체크포인트",
        items: [
          {
            title: "주행 패턴과 차급",
            description:
              "도심 위주인지, 장거리 비중이 큰지에 따라 세단·SUV·전기차 중 어떤 차종이 맞는지 먼저 결정합니다."
          },
          {
            title: "연비·연료·유지비",
            description:
              "하이브리드·LPG·전기차 등 연료 타입에 따라 월 주유비·전기요금이 달라지므로 총비용 관점에서 비교합니다."
          },
          {
            title: "승차 인원과 적재 공간",
            description:
              "패밀리카·업무용·통학용 등 목적에 따라 5인승, 7인승, 9인승, 밴 등 탑승 인원과 적재공간이 충분한지 확인합니다."
          }
        ]
      },
      "brand-domestic": {
        title: "국산차 장기렌트 체크포인트",
        items: [
          {
            title: "프로모션·할인 조건",
            description:
              "국산차는 시기별·차종별 프로모션이 자주 변경되므로, 카탈로그 가격보다 실제 렌트료 기준으로 비교해야 합니다."
          },
          {
            title: "재고·즉시출고 여부",
            description:
              "인기 트림은 출고 대기가 길어질 수 있어, 취소 차량·전시차 등 즉시출고 가능 물량을 함께 확인하는 것이 좋습니다."
          },
          {
            title: "법인·사업자 혜택",
            description:
              "국산차 일부 차종은 부가세 환급·비용처리에 유리해, 매입 대신 장기렌트를 선택하는 법인·사업자가 많습니다."
          }
        ]
      },
      "brand-import": {
        title: "수입차 장기렌트 체크포인트",
        items: [
          {
            title: "보험·수리비 구조",
            description:
              "수입차는 부품·수리비가 높아 보험료도 커질 수 있어, 장기렌트에 포함된 보험 조건을 꼼꼼히 확인해야 합니다."
          },
          {
            title: "관세·환율·프로모션",
            description:
              "환율과 브랜드 프로모션에 따라 렌트료가 달라질 수 있으므로, 비슷한 등급 내에서 여러 브랜드를 비교해 봅니다."
          },
          {
            title: "잔존가와 계약 기간",
            description:
              "수입차는 잔존가 책정에 따라 월 납입금 차이가 크게 날 수 있어, 계약 기간별 월 납입금 변화를 함께 확인합니다."
          }
        ]
      },
      "condition-type": {
        title: "조건·유형별 장기렌트 체크포인트",
        items: [
          {
            title: "무보증·초기비용 0원 한도",
            description:
              "무보증 조건은 심사 기준과 월 납입금에 영향을 주므로, 보증금 일부 납입 시와 함께 비교 견적을 받아보는 것이 좋습니다."
          },
          {
            title: "즉시출고·재렌트 여부",
            description:
              "대기 기간이 부담된다면 재렌트·전시차·취소차 등 즉시출고 가능한 조건을 함께 검토합니다."
          },
          {
            title: "주행거리 제한",
            description:
              "계약서에 명시된 연간 주행거리와 초과 시 정산 단가를 확인해, 추후 추가 비용이 발생하지 않도록 합니다."
          }
        ]
      },
      "customer-type": {
        title: "대상별 장기렌트 체크포인트",
        items: [
          {
            title: "개인 신용도와 한도",
            description:
              "개인 장기렌트는 신용도와 소득 대비 한도가 중요해, 카드·대출 사용 이력까지 함께 고려됩니다."
          },
          {
            title: "사업자·법인 서류",
            description:
              "사업자등록증, 재무제표, 부가세 신고 내역 등 필요한 서류를 미리 준비하면 심사 속도를 높일 수 있습니다."
          },
          {
            title: "저신용·사회초년생 옵션",
            description:
              "보증인·보증금·차종 조합 등을 통해 승인 가능성을 높일 수 있어, 조건별 차이를 상담 단계에서 확인하는 것이 중요합니다."
          }
        ]
      },
      "price-compare": {
        title: "가격 비교·견적 체크포인트",
        items: [
          {
            title: "월 렌트료만 비교하지 않기",
            description:
              "보험·정비 포함 여부, 초과 주행료, 중도해지 위약금까지 포함한 총비용 기준으로 비교해야 합니다."
          },
          {
            title: "허위매물·조건 주의",
            description:
              "극단적으로 낮은 월 납입금은 특정 전제 조건이 붙을 수 있어, 견적서에 명시된 조건을 꼼꼼히 확인합니다."
          },
          {
            title: "견적 비교 개수",
            description:
              "3~4개 내외의 업체에서 비슷한 조건으로 견적을 받아 비교하는 것이 효율적입니다."
          }
        ]
      },
      "guide-review": {
        title: "장기렌트 가이드·후기 체크포인트",
        items: [
          {
            title: "실제 이용 후기 확인",
            description:
              "비슷한 조건·차종·직업군 이용자의 후기를 참고하면, 예상치 못한 불편 요소를 미리 파악할 수 있습니다."
          },
          {
            title: "계약서 핵심 조항",
            description:
              "사고 처리, 중도해지, 위약금, 보험 할증 등 핵심 조항은 계약 전에 반드시 이해해야 합니다."
          },
          {
            title: "리스·구매와의 비교",
            description:
              "장기 사용·단기 사용, 재무 구조, 세무 처리 등 관점에서 다른 선택지와 숫자 중심 비교가 필요합니다."
          }
        ]
      }
    };

  const checklist = checklistMap[params.hubSlug] ?? checklistMap["guide-review"];

  return (
    <div className="container-page py-8 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          { label: hub?.title ?? "장기렌트카 허브" }
        ]}
      />
      <h1 className="heading-h1">{hub?.title ?? "장기렌트카 허브"}</h1>
      <p className="mt-4 text-body">{hub?.description}</p>

      <ChecklistBox title={checklist.title} items={checklist.items} />

      <CardGrid
        title="추천 상세 6선"
        subtitle="전환 가능성이 높은 대표 상세 페이지를 먼저 확인해 보세요."
        items={recommended.map((item) => ({
          href: `/${item.slug}`,
          title: item.pageTitle || `${item.keyword} 장기렌트`,
          badge: item.keyword,
          description: "가격·조건·추천 대상·주의사항을 정리한 상세 가이드입니다."
        }))}
      />

      <section className="mt-10">
        <h2 className="heading-h2">이 허브에 포함된 전체 상세</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-800">
          {allKeywords.map((item) => (
            <li key={item.slug}>
              <a href={`/${item.slug}`} className="font-semibold">
                {item.pageTitle || `${item.keyword} 장기렌트`}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="heading-h2">자주 묻는 질문(FAQ)</h2>
        <div className="mt-4 space-y-4 text-sm text-slate-800">
          <details className="card p-4">
            <summary className="cursor-pointer font-semibold">
              이 허브에서 어떤 정보를 우선 확인해야 하나요?
            </summary>
            <p className="mt-2 text-slate-700">
              먼저 예산과 용도에 맞는 차종·조건·대상을 결정한 뒤, 추천 상세 페이지에서
              실제 월 납입금 구조와 주의사항을 확인하는 것이 좋습니다.
            </p>
          </details>
          <details className="card p-4">
            <summary className="cursor-pointer font-semibold">
              허브에 없는 차종·조건도 상담이 가능한가요?
            </summary>
            <p className="mt-2 text-slate-700">
              대부분의 신차·수입차는 상담이 가능하지만, 프로모션·보조금·재고 상황에 따라
              조건이 달라질 수 있습니다. 비슷한 급·용도의 차량을 함께 비교하면 도움이
              됩니다.
            </p>
          </details>
        </div>
      </section>

      <DisclosureBox>
        <p>
          본 허브는 유사한 성격의 장기렌트 정보를 묶어 보기 쉽게 정리한 페이지로, 실제
          계약은 개별 상세 페이지와 상담을 통해 진행됩니다.
        </p>
        <p>
          동일 허브 내에서도 차종·브랜드·조건에 따라 승인 기준과 비용 구조가 달라질 수
          있으므로, 견적 비교 시 전제 조건을 통일하는 것이 중요합니다.
        </p>
      </DisclosureBox>
    </div>
  );
}

