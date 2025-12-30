import type { Metadata } from "next";
import Image from "next/image";
import keywords from "@/data/keywords.json";
import type { KeywordItem, HubSlug } from "@/lib/types";
import {
  getKeywordBySlug,
  getSiblingsForSlug,
  getGuideForHub,
  detailMetadata,
  getHubBySlug
} from "@/lib/seo";
import { jsonLdDetail } from "@/lib/jsonld";
import { getShuffledImagesForSlug } from "@/lib/images";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DisclosureBox } from "@/components/DisclosureBox";
import Link from "next/link";

export const dynamic = "error";

export function generateStaticParams() {
  return (keywords as KeywordItem[]).map((k) => ({ slug: k.slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const item = getKeywordBySlug(params.slug);
  const baseKeyword = item?.keyword ?? "장기렌트카";
  const images = getShuffledImagesForSlug(params.slug, 3);
  const ogImage = images[0];

  return detailMetadata(params.slug, baseKeyword, item?.pageTitle, ogImage);
}

export default function Page({ params }: { params: { slug: string } }) {
  const item = getKeywordBySlug(params.slug);
  const baseKeyword = item?.keyword ?? "장기렌트카";
  const pageTitle = item?.pageTitle || `${baseKeyword} 장기렌트 안내`;
  const hubSlug = (item?.hubSlug ?? "guide-review") as HubSlug;
  const hub = getHubBySlug(hubSlug);
  const siblings = getSiblingsForSlug(params.slug).slice(0, 2);
  const guide = getGuideForHub(hubSlug);
  const images = getShuffledImagesForSlug(params.slug, 4);
  const jsonLd = jsonLdDetail(params.slug);

  const altBase = `${baseKeyword} 장기렌트 조건 설명 이미지`;

  return (
    <div className="container-page py-8 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          hub ? { label: hub.title, href: `/hub/${hubSlug}` } : undefined,
          { label: pageTitle }
        ].filter(Boolean) as { label: string; href?: string }[]}
      />

      <header>
        <h1 className="heading-h1">{pageTitle}</h1>
        <p className="mt-3 text-sm text-slate-600">
          작성: 장기렌트 정보 편집팀 · 검토: 자동차 금융 검토팀 · 최종 업데이트: 2025-12-26
        </p>
      </header>

      <section className="mt-6 card p-4 sm:p-5">
        <h2 className="heading-h2 text-lg">요약 한눈에 보기</h2>
        <div className="mt-3 grid gap-3 text-sm text-slate-800 sm:grid-cols-3">
          <div>
            <p className="font-semibold">예상 가격대</p>
            <p className="mt-1 text-slate-600">
              차량 가격, 계약 기간, 잔존가, 주행거리 조건에 따라 월 납입금이 달라집니다.
              구체적인 금액은 견적을 통해 확인해 주세요.
            </p>
          </div>
          <div>
            <p className="font-semibold">주요 조건</p>
            <p className="mt-1 text-slate-600">
              보증금·무보증, 계약 기간, 보험·정비 포함 여부 등으로 실제 체감 비용이 크게
              달라질 수 있습니다.
            </p>
          </div>
          <div>
            <p className="font-semibold">추천 대상</p>
            <p className="mt-1 text-slate-600">
              예산·주행거리·사용 목적에 따라 적합한 고객 유형을 예시로 안내합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="heading-h2">목차</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>
            <a href="#section-1">기본 조건과 월 납입금 구조</a>
          </li>
          <li>
            <a href="#section-2">장점과 고려해야 할 단점</a>
          </li>
          <li>
            <a href="#section-3">추천 고객 유형과 활용 사례</a>
          </li>
          <li>
            <a href="#section-4">계약 전 체크리스트</a>
          </li>
          <li>
            <a href="#section-5">관련 허브·상세와 다음 단계</a>
          </li>
        </ol>
      </section>

      <section id="section-1" className="mt-10">
        <h2 className="heading-h2">기본 조건과 월 납입금 구조</h2>
        <p className="mt-3 text-body">
          {baseKeyword} 장기렌트의 월 납입금은 차량 가격, 잔존가, 계약 기간, 연간
          주행거리, 금리, 보증금·선납금 등 여러 요소가 함께 작동해 결정됩니다. 같은
          차량이라도 계약 기간을 길게 두거나, 보증금을 일부 납입하거나, 주행거리를
          보수적으로 설정하면 월 납입금이 달라지며, 총 납입액과 중도해지 구조까지 함께
          비교해야 합리적인 선택이 가능합니다.
        </p>
        <p className="mt-3 text-body">
          특히 전기차·하이브리드 차량의 경우 보조금과 프로모션, 감가 예측이 중요하게
          작용해 잔존가에 직접적인 영향을 주므로, 같은 차급의 내연기관 차량과 단순 비교
          대신 총비용 기준으로 보는 것이 안전합니다.
        </p>
      </section>

      {images[0] && (
        <section className="mt-8">
          <div className="relative h-56 overflow-hidden rounded-xl border border-shell-border bg-slate-100 sm:h-72">
            <Image
              src={images[0]}
              alt={`${altBase} 1`}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
          </div>
        </section>
      )}

      <section id="section-2" className="mt-10">
        <h2 className="heading-h2">장점과 고려해야 할 단점</h2>
        <p className="mt-3 text-body">
          장기렌트의 가장 큰 장점은 초기 목돈 부담을 줄이면서 차량을 이용할 수 있고,
          보험·세금·정비 등을 한 번에 관리할 수 있다는 점입니다. 특히 법인·사업자의
          경우 비용처리와 부가세 환급 등 회계 관점에서 유리한 경우가 많아, 차량을 자산이
          아닌 비용으로 관리하고 싶은 고객에게 적합한 선택지입니다.
        </p>
        <p className="mt-3 text-body">
          반면, 계약 기간 내 중도해지 시 위약금이 발생할 수 있고, 주행거리 제한을
          초과하면 추가 정산이 필요하다는 점은 반드시 인지해야 합니다. 또한 차량 소유권이
          렌터사에 있어, 튜닝·개조나 특정 용도의 사용에 제한이 있을 수 있으므로 계약서
          상의 허용 범위를 꼭 확인해야 합니다.
        </p>
      </section>

      {images[1] && (
        <section className="mt-8">
          <div className="relative h-56 overflow-hidden rounded-xl border border-shell-border bg-slate-100 sm:h-72">
            <Image
              src={images[1]}
              alt={`${altBase} 2`}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
          </div>
        </section>
      )}

      <section id="section-3" className="mt-10">
        <h2 className="heading-h2">추천 고객 유형과 활용 사례</h2>
        <p className="mt-3 text-body">
          {baseKeyword} 장기렌트는 차량을 3~5년 주기로 교체하면서 최신 모델을 이용하고
          싶은 고객, 월 납입금 중심으로 예산을 관리하고 싶은 고객, 유지비를 예측 가능한
          범위에서 관리하고 싶은 고객에게 적합합니다. 특히 법인·사업자의 경우 비용처리와
          운용 효율을 동시에 고려해야 하므로, 비슷한 급의 여러 차종을 함께 비교하는 것이
          좋습니다.
        </p>
        <p className="mt-3 text-body">
          반대로, 장기간 한 대의 차량을 소유하며 높은 주행거리를 예상하는 고객, 튜닝이나
          특수 용도 활용이 중요한 고객, 차량을 자산으로 보유하고 싶은 고객이라면 구매나
          리스와의 비교가 필요합니다. 이때 장기렌트·리스·구매의 총비용과 세무 처리를
          함께 비교하면 선택에 도움이 됩니다.
        </p>
      </section>

      {images[2] && (
        <section className="mt-8">
          <div className="relative h-56 overflow-hidden rounded-xl border border-shell-border bg-slate-100 sm:h-72">
            <Image
              src={images[2]}
              alt={`${altBase} 3`}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
          </div>
        </section>
      )}

      <section id="section-4" className="mt-10">
        <h2 className="heading-h2">계약 전 체크리스트</h2>
        <ul className="mt-3 prose-list text-body">
          <li>월 납입금 수준뿐 아니라 총 납입액과 중도해지 조건을 함께 비교했는지</li>
          <li>연간 주행거리와 초과 시 정산 단가를 정확히 이해했는지</li>
          <li>보험·정비·타이어 등 포함·제외 항목을 모두 확인했는지</li>
          <li>보증금·선납금·초기비용 구조가 본인 상황에 맞는지</li>
          <li>법인·사업자의 경우 세무상 처리 방식과 한도를 점검했는지</li>
        </ul>
      </section>

      <section id="section-5" className="mt-10">
        <h2 className="heading-h2">관련 허브·상세와 다음 단계</h2>
        <p className="mt-3 text-body">
          더 구체적인 조건과 다른 차종을 함께 비교하려면, 아래 관련 링크를 순서대로
          확인해 보세요.
        </p>
        <ul className="mt-4 space-y-3 text-sm text-slate-800">
          <li>
            <Link href="/" className="font-semibold">
              장기렌트카 전체 가이드로 돌아가기
            </Link>
          </li>
          {hub && (
            <li>
              <Link href={`/hub/${hubSlug}`} className="font-semibold">
                {hub.title} 다시 보기
              </Link>
            </li>
          )}
          {siblings.map((sibling) => (
            <li key={sibling.slug}>
              <Link href={`/${sibling.slug}`} className="font-semibold">
                {sibling.pageTitle || `${sibling.keyword} 장기렌트 안내`}
              </Link>
            </li>
          ))}
          {guide && (
            <li>
              <Link href={`/${guide.slug}`} className="font-semibold">
                {guide.pageTitle || `${guide.keyword} 장기렌트 가이드`}
              </Link>
            </li>
          )}
        </ul>
      </section>

      <DisclosureBox>
        <p>
          이 페이지의 내용은 일반적인 정보 제공을 위한 것이며, 실제 계약 조건과 비용은
          렌터사·금융사·개인 신용도에 따라 달라질 수 있습니다.
        </p>
        <p>
          견적과 계약 전에는 반드시 최신 상품설명서와 약관, 견적서를 확인하시고 필요시
          전문가와 상의하시기 바랍니다.
        </p>
      </DisclosureBox>
    </div>
  );
}

