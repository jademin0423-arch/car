import type { Metadata } from "next";
import { guideMainMetadata } from "@/lib/seo";
import { jsonLdGuideMain } from "@/lib/jsonld";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ChecklistBox } from "@/components/ChecklistBox";
import { DisclosureBox } from "@/components/DisclosureBox";
import Link from "next/link";
import { HUB_NAV } from "@/lib/nav";

export const dynamic = "error";

export function generateMetadata(): Metadata {
  return guideMainMetadata();
}

export default function Page() {
  const jsonLd = jsonLdGuideMain();

  return (
    <div className="container-page py-8 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          { label: "장기렌트카 가격·조건 총정리" }
        ]}
      />
      <h1 className="heading-h1">장기렌트카 가격·조건 총정리</h1>
      <p className="mt-4 text-body">
        장기렌트카의 월 납입금은 차량 가격만으로 결정되지 않습니다. 잔존가, 계약 기간,
        주행거리, 금리, 보증금·선납금 구조까지 함께 반영되기 때문에, 같은 차량이라도
        계약 조건에 따라 월 납입금이 크게 달라질 수 있습니다.
      </p>
      <p className="mt-3 text-body">
        이 페이지에서는 장기렌트카 가격과 조건을 이해하는 데 필요한 기본 구조를 정리하고,
        차종·브랜드·조건별 허브로 자연스럽게 이동할 수 있도록 돕습니다.
      </p>

      <ChecklistBox
        title="월 납입금을 결정하는 4가지 축"
        items={[
          {
            title: "차량 가격과 잔존가",
            description:
              "신차가와 계약 종료 시점의 예상 잔존가 차이가 클수록 월 납입금 부담이 커질 수 있습니다."
          },
          {
            title: "계약 기간과 주행거리",
            description:
              "계약 기간이 길수록 월 납입금이 낮아질 수 있지만, 총 납입액과 잔존가 조건을 함께 봐야 합니다."
          },
          {
            title: "보증금·선납금·초기비용",
            description:
              "보증금과 선납금을 많이 넣을수록 월 납입금은 낮아지지만, 유동성 측면에서 손익을 따져봐야 합니다."
          },
          {
            title: "금리·프로모션·보조금",
            description:
              "금융 조건과 렌터사 프로모션, 전기차 보조금 등도 실제 체감 비용에 영향을 줍니다."
          }
        ]}
      />

      <section className="mt-10">
        <h2 className="heading-h2">장기렌트 vs 리스 vs 할부, 구조 비교</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm text-slate-800">
          <div className="card p-4">
            <h3 className="heading-h3 text-base">장기렌트</h3>
            <p className="mt-2">
              소유권은 렌터사에 두고 사용료를 납부하는 구조로, 보험·세금·정비 등을
              패키지로 묶어 관리할 수 있습니다. 반납·재계약 선택지가 유연해 차량 교체
              주기가 짧은 고객에게 유리할 수 있습니다.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="heading-h3 text-base">오토리스</h3>
            <p className="mt-2">
              금융 구조는 비슷하지만 보험·정비 선택과 사고 처리 책임 범위에서 장기렌트와
              차이가 있습니다. 회계 처리와 세무 이슈가 중요하다면 세무사와 함께 구조를
              검토하는 것이 좋습니다.
            </p>
          </div>
          <div className="card p-4">
            <h3 className="heading-h3 text-base">할부·현금</h3>
            <p className="mt-2">
              차량 소유권을 직접 보유하는 대신, 취등록세·보험료·정비 비용을 개별적으로
              관리해야 합니다. 장기 사용과 높은 주행거리를 전제로 할 때 유리할 수 있지만,
              초기 비용과 감가를 함께 고려해야 합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="heading-h2">다음 단계: 허브에서 세부 정보 확인</h2>
        <p className="mt-3 text-sm text-slate-700">
          가격 구조를 이해했다면, 이제 관심 있는 차종·브랜드·조건 허브에서 세부 정보를
          확인해 보세요.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {HUB_NAV.slice(0, 3).map((hub) => (
            <Link
              key={hub.slug}
              href={`/hub/${hub.slug}`}
              className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800 hover:bg-blue-50"
            >
              {hub.label} 장기렌트 허브로 이동
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="heading-h2">최신 장기렌트 상세 6선</h2>
        <p className="mt-3 text-sm text-slate-700">
          아래 상세 페이지에서 실제 사례와 조건을 통해 가격 구조를 더 구체적으로 확인할
          수 있습니다.
        </p>
        <ul className="mt-4 space-y-3 text-sm text-slate-800">
          <li>
            <Link href="/no-deposit-longterm-rent" className="font-semibold">
              무보증장기렌트 초기비용 0원 [즉시 이용 가능]
            </Link>
            <span className="ml-1 text-xs text-slate-500">
              — 초기 자금 부담을 최소화하고 싶은 고객에게 적합한 구조를 설명합니다.
            </span>
          </li>
          <li>
            <Link href="/longterm-rent-car-price-compare" className="font-semibold">
              장기렌트카가격비교 2025년 최신 견적 [업체별 정리]
            </Link>
            <span className="ml-1 text-xs text-slate-500">
              — 업체별 견적 비교 시 어떤 항목을 기준으로 봐야 하는지 정리합니다.
            </span>
          </li>
          <li>
            <Link href="/longterm-rent-car-pros-cons" className="font-semibold">
              장기렌터카 장단점 및 비용 분석 [구매 가이드]
            </Link>
            <span className="ml-1 text-xs text-slate-500">
              — 구매·리스와의 장단점을 숫자 중심으로 비교합니다.
            </span>
          </li>
        </ul>
      </section>

      <DisclosureBox>
        <p>
          본 페이지의 내용은 일반적인 가격·조건 구조를 설명한 것으로, 실제 견적과는 차이가
          있을 수 있습니다.
        </p>
        <p>
          구체적인 계약 전에는 반드시 최신 상품설명서와 견적서를 확인하고, 필요시 전문가와
          상담하시기 바랍니다.
        </p>
      </DisclosureBox>
    </div>
  );
}

