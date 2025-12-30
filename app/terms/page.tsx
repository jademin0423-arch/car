import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "이용약관",
  description: "장기렌트카 정보 사이트 이용과 관련된 기본 약관을 안내합니다.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/terms"
  }
};

export default function Page() {
  return (
    <div className="container-page py-8 pb-24">
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          { label: "이용약관" }
        ]}
      />
      <h1 className="heading-h1">이용약관</h1>
      <p className="mt-4 text-body">
        이 페이지는 사이트 이용과 관련된 기본적인 조건을 안내하기 위한 목적으로 제공됩니다.
        실제 서비스 제공과 법률적 효력은 별도 계약과 관계 법령에 따릅니다.
      </p>
    </div>
  );
}

