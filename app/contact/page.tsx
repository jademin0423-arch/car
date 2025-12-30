import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { Breadcrumb } from "@/components/Breadcrumb";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "장기렌트카 콘텐츠 관련 문의 및 제휴, 정정 요청 등을 접수하는 연락처 안내 페이지입니다.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/contact"
  }
};

export default function Page() {
  return (
    <div className="container-page py-8 pb-24">
      <Breadcrumb
        items={[
          { label: "장기렌트카", href: "/" },
          { label: "문의하기" }
        ]}
      />
      <h1 className="heading-h1">문의하기</h1>
      <p className="mt-4 text-body">
        콘텐츠 정정 요청, 제휴, 광고 문의 등은 아래 이메일로 보내주시기 바랍니다. 가능한
        한 사실에 기반한 정보만 제공할 수 있도록 항상 노력하고 있습니다.
      </p>
      <div className="mt-4 text-sm text-slate-800">
        <p>
          이메일: <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
        </p>
        <p className="mt-1">응대 시간: {SITE.contact.supportHours}</p>
        <p className="mt-1">{SITE.contact.responseNote}</p>
      </div>
    </div>
  );
}

