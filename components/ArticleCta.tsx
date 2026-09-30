import { SITE } from "@/lib/site";

type Position = "article-top" | "article-middle" | "article-bottom";

const COPY: Record<Position, string> = {
  "article-top": "같은 차량과 계약 조건으로 견적을 나란히 비교해 보세요.",
  "article-middle": "보증금, 보험, 정비, 약정거리가 견적에 어떻게 들어 있는지 확인해 보세요.",
  "article-bottom": "계약 전에 조건이 같은 견적을 한 번 더 비교해 보세요."
};

export function ArticleCta({ position }: { position: Position }) {
  return (
    <aside
      data-article-cta={position}
      className="mt-8 rounded-xl border border-shell-border bg-white p-4 shadow-sm sm:p-5"
    >
      <p className="text-sm font-semibold text-slate-900">{COPY[position]}</p>
      <a
        href={SITE.ctaPrimary.href}
        className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-primary-dark"
      >
        {SITE.ctaPrimary.label}
      </a>
    </aside>
  );
}
