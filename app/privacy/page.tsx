import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "개인정보 수집·이용·보관·파기 등 처리 방침을 안내합니다.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/privacy"
  }
};

export default function Page() {
  return (
    <div className="container-page py-8 pb-24">
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          { label: "개인정보 처리방침" }
        ]}
      />
      <h1 className="heading-h1">개인정보 처리방침</h1>
      <p className="mt-4 text-body">
        이 페이지는 개인정보의 수집·이용 목적과 보유 기간, 제3자 제공 여부 등 기본적인 처리
        방침을 안내하기 위한 예시입니다. 실제 수집 항목과 처리 범위는 추후 서비스 구성에
        따라 구체화됩니다.
      </p>
    </div>
  );
}

