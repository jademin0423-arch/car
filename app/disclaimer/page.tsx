import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "면책조항",
  description:
    "장기렌트카 정보 제공과 관련된 책임 한계 및 면책 사항을 안내합니다.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/disclaimer"
  }
};

export default function Page() {
  return (
    <div className="container-page py-8 pb-24">
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          { label: "면책조항" }
        ]}
      />
      <h1 className="heading-h1">면책조항</h1>
      <p className="mt-4 text-body">
        이 사이트의 콘텐츠는 금융·세무·법률 자문이 아닌 일반적인 정보 제공을 목적으로
        작성되었으며, 이를 기반으로 한 의사 결정에 대한 책임은 이용자에게 있습니다.
        구체적인 계약과 세무 처리, 법률 판단은 반드시 관련 전문가와 별도로 상담하시기
        바랍니다.
      </p>
    </div>
  );
}

