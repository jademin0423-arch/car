"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { MAIN_NAV, HUB_NAV, FOOTER_LINKS } from "@/lib/nav";

interface Props {
  children: React.ReactNode;
}

const EXIT_KEY = "allcar-exit-popup";

export function SiteShell({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(EXIT_KEY) === "1") return;

    const desktop = window.matchMedia("(min-width: 769px)");
    let idleTimer = 0;
    let opened = false;

    const detach = () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimer);
    };

    const openPopup = () => {
      if (opened || window.sessionStorage.getItem(EXIT_KEY) === "1") return;
      opened = true;
      window.sessionStorage.setItem(EXIT_KEY, "1");
      setShowExitPopup(true);
      detach();
    };

    const onMouseOut = (event: MouseEvent) => {
      if (!desktop.matches) return;
      if (event.clientY >= 10) return;
      if (event.relatedTarget) return;
      openPopup();
    };

    const onScroll = () => {
      if (desktop.matches) return;
      window.clearTimeout(idleTimer);
      if (window.scrollY <= 300) return;
      idleTimer = window.setTimeout(openPopup, 1600);
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    return detach;
  }, []);

  useEffect(() => {
    if (!showExitPopup) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowExitPopup(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showExitPopup]);

  const closePopup = () => setShowExitPopup(false);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      <header className="sticky top-0 z-40 border-b border-shell-border bg-white/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label={SITE.logoText}>
            <span className="shrink-0 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-white">
              GUIDE
            </span>
            <span className="truncate text-sm font-semibold tracking-tight">{SITE.logoText}</span>
          </Link>
          <nav
            className="hidden items-center gap-5 text-sm font-medium text-slate-700 min-[769px]:flex"
            aria-label="주요 내비게이션"
          >
            {MAIN_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="no-underline hover:text-primary-dark">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={SITE.ctaPrimary.href}
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white no-underline hover:bg-primary-dark"
            >
              견적 상담
            </a>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-shell-border p-2 text-slate-700 min-[769px]:hidden"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                {open ? (
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    d="M6 6l12 12M6 18L18 6"
                  />
                ) : (
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {open ? (
          <nav
            className="border-t border-shell-border bg-white px-4 pb-4 pt-2 text-sm text-slate-700 min-[769px]:hidden"
            aria-label="모바일 내비게이션"
          >
            <div className="mb-3 flex flex-col gap-2">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-1 no-underline"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mb-3 border-t border-shell-border pt-3">
              <p className="mb-2 text-xs font-semibold text-slate-500">장기렌트카 허브</p>
              <div className="flex flex-wrap gap-2">
                {HUB_NAV.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={`/hub/${hub.slug}`}
                    className="rounded-full bg-slate-50 px-3 py-1 text-xs no-underline"
                    onClick={() => setOpen(false)}
                  >
                    {hub.label}
                  </Link>
                ))}
              </div>
            </div>
            <a
              href={SITE.ctaPrimary.href}
              className="block rounded-full bg-primary px-4 py-2 text-center text-xs font-semibold text-white no-underline"
              onClick={() => setOpen(false)}
            >
              {SITE.ctaPrimary.label}
            </a>
            <Link
              href={SITE.ctaSecondary.href}
              className="mt-2 block rounded-full border border-primary bg-white px-4 py-2 text-center text-xs font-medium text-primary no-underline"
              onClick={() => setOpen(false)}
            >
              {SITE.ctaSecondary.label}
            </Link>
          </nav>
        ) : null}
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-shell-border bg-white py-6 pb-28 text-xs text-slate-500">
        <div className="container-page flex flex-col gap-4">
          <div>
            <p className="font-semibold text-slate-700">{SITE.logoText}</p>
            <p className="mt-1">
              작성: {SITE.editorial.authorName} · 검토: {SITE.editorial.reviewerName}
            </p>
            <p className="mt-0.5">최종 업데이트: {SITE.editorial.renewedOn}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary-dark">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
      {showExitPopup ? null : (
        <>
          <a
            href={SITE.ctaPrimary.href}
            data-global-cta="desktop"
            className="fixed bottom-5 left-1/2 z-50 hidden -translate-x-1/2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white no-underline shadow-lg hover:bg-primary-dark min-[769px]:inline-flex"
          >
            {SITE.ctaPrimary.label}
          </a>
          <a
            href={SITE.ctaPrimary.href}
            data-global-cta="mobile"
            className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center bg-primary px-4 py-3 text-sm font-semibold text-white no-underline min-[769px]:hidden"
          >
            {SITE.ctaPrimary.label}
          </a>
        </>
      )}
      {showExitPopup ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/55 p-4"
          onClick={closePopup}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-popup-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="exit-popup-title" className="text-xl font-semibold text-slate-900">
              장기렌트 견적을 비교해 보세요
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              차량, 계약 기간, 약정거리, 보증금, 보험, 정비 조건이 같은 견적을 나란히 보면
              차이를 확인하기 쉽습니다.
            </p>
            <a
              href={SITE.ctaPrimary.href}
              className="mt-5 inline-flex w-full justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white no-underline hover:bg-primary-dark"
            >
              {SITE.ctaPrimary.label}
            </a>
            <button
              type="button"
              className="mt-3 text-sm text-slate-500"
              onClick={closePopup}
            >
              닫기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
