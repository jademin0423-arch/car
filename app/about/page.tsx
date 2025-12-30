import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { Breadcrumb } from "@/components/Breadcrumb";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "사이트 소개",
  description:
    "장기렌트카 가격 비교와 조건 안내를 위해 운영되는 정보형 사이트의 소개 페이지입니다.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/about"
  }
};

export default function Page() {
  return (
    <div className="container-page py-8 pb-24">
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          { label: "사이트 소개" }
        ]}
      />
      <h1 className="heading-h1">사이트 소개</h1>
      <p className="mt-4 text-body">
        {SITE.name}는 장기렌트카 가격 비교와 조건 이해를 돕기 위한 정보형 허브 사이트입니다.
        특정 업체나 상품을 과도하게 홍보하기보다, 차분한 정보 제공을 통해 합리적인 의사
        결정을 돕는 것을 목표로 합니다.
      </p>
    </div>
  );
}

