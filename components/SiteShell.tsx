"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SITE } from "@/lib/site";
import { MAIN_NAV, HUB_NAV, FOOTER_LINKS } from "@/lib/nav";

interface Props {
  children: React.ReactNode;
}

export function SiteShell({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);

  useEffect(() => {
    // Exit Intent 감지
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitPopup) {
        setShowExitPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [showExitPopup]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      <header className="sticky top-0 z-40 border-b border-shell-border bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2" aria-label={SITE.logoText}>
              <span className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-white">
                GUIDE
              </span>
              <span className="text-sm font-semibold tracking-tight sm:text-base">
                {SITE.logoText}
              </span>
            </Link>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex" aria-label="주요 내비게이션">
            {MAIN_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary-dark">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={SITE.ctaSecondary.href}
              className="rounded-full border border-primary bg-white px-4 py-1.5 text-xs font-medium text-primary hover:bg-blue-50"
            >
              {SITE.ctaSecondary.label}
            </Link>
            <Link
              href={SITE.ctaPrimary.href}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark"
            >
              {SITE.ctaPrimary.label}
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-shell-border p-2 text-slate-700 md:hidden"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">메뉴</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
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
        {open && (
          <nav
            className="border-t border-shell-border bg-white px-4 pb-4 pt-2 text-sm text-slate-700 md:hidden"
            aria-label="모바일 내비게이션"
          >
            <div className="mb-3 flex flex-col gap-2">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-1"
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
                    className="rounded-full bg-slate-50 px-3 py-1 text-xs"
                    onClick={() => setOpen(false)}
                  >
                    {hub.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={SITE.ctaPrimary.href}
                className="rounded-full bg-primary px-4 py-2 text-center text-xs font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                {SITE.ctaPrimary.label}
              </Link>
              <Link
                href={SITE.ctaSecondary.href}
                className="rounded-full border border-primary bg-white px-4 py-2 text-center text-xs font-medium text-primary"
                onClick={() => setOpen(false)}
              >
                {SITE.ctaSecondary.label}
              </Link>
            </div>
          </nav>
        )}
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-shell-border bg-white py-6 text-xs text-slate-500">
        <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-700">{SITE.logoText}</p>
            <p className="mt-1">
              작성: {SITE.editorial.authorName} · 검토: {SITE.editorial.reviewerName}
            </p>
            <p className="mt-0.5">최종 업데이트: {SITE.editorial.lastUpdatedDefault}</p>
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
      {/* 고정 CTA 배너 (모바일: 상단 / PC: 하단) */}
      <style dangerouslySetInnerHTML={{__html: `
        .wf-cta-banner {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 -4px 14px rgba(0,0,0,0.08);
          z-index: 9999;
          font-family: inherit;
        }

        .wf-cta-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .wf-cta-text {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .wf-cta-btn {
          flex-shrink: 0;
          padding: 11px 22px;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 6px 16px rgba(37,99,235,0.4);
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .wf-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(37,99,235,0.5);
        }

        .floating-cta {
          position: fixed;
          right: 20px;
          bottom: 120px;
          z-index: 9999;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: #ffffff;
          padding: 14px 26px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 15px;
          box-shadow: 0 10px 28px rgba(22,163,74,0.45);
          cursor: pointer;
          transition: all 0.25s ease;
          animation: pulseCTA 1.8s infinite;
        }

        .floating-cta:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(22,163,74,0.6);
        }

        .exit-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
        }

        .exit-popup-box {
          background: #f8fafc;
          border-radius: 18px;
          padding: 34px 28px;
          max-width: 420px;
          width: 90%;
          text-align: center;
          box-shadow: 0 14px 36px rgba(0,0,0,0.3);
          animation: fadeIn 0.35s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .exit-popup-title {
          font-size: 22px;
          font-weight: 800;
          color: #1e40af;
          margin-bottom: 14px;
        }

        .exit-popup-text {
          font-size: 16px;
          color: #374151;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .exit-popup-btn {
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          color: #fff;
          padding: 14px 26px;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(37,99,235,0.45);
          transition: all 0.25s ease;
          border: none;
          width: 100%;
        }

        .exit-popup-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(37,99,235,0.6);
        }

        .exit-popup-close {
          margin-top: 18px;
          font-size: 14px;
          color: #6b7280;
          cursor: pointer;
        }

        @keyframes pulseCTA {
          0% { transform: scale(1); }
          50% { transform: scale(1.07); }
          100% { transform: scale(1); }
        }

        /* 모바일 */
        @media (max-width: 768px) {
          .wf-cta-banner {
            top: 0;
            bottom: auto;
            border-top: none;
            border-bottom: 1px solid #e5e7eb;
            box-shadow: 0 4px 14px rgba(0,0,0,0.08);
          }

          .wf-cta-inner {
            flex-direction: column;
            align-items: stretch;
          }

          .wf-cta-text {
            font-size: 14px;
          }

          .wf-cta-btn {
            width: 100%;
            text-align: center;
          }

          .floating-cta {
            bottom: 20px;
            right: 16px;
            padding: 12px 20px;
            font-size: 14px;
          }
        }
      `}} />

      <div className="wf-cta-banner">
        <div className="wf-cta-inner">
          <span className="wf-cta-text">
            🚗 지금 조건이면 <b>월 납입금 더 줄일 수 있습니다</b>
          </span>
          <a href="https://www.replyalba.com/pt/ZSzUHBDF6d" className="wf-cta-btn">
            무료 장기렌트 견적 받기
          </a>
        </div>
      </div>

      {/* 플로팅 CTA 버튼 */}
      <div 
        className="floating-cta"
        onClick={() => window.location.href = 'https://www.replyalba.com/pt/ZSzUHBDF6d'}
      >
        💰 장기렌트 실시간 견적
      </div>

      {/* Exit Intent 팝업 */}
      {showExitPopup && (
        <div className="exit-popup-overlay" onClick={() => setShowExitPopup(false)}>
          <div className="exit-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="exit-popup-title">
              💡 지금 나가면 손해일 수도 있어요
            </div>
            <div className="exit-popup-text">
              현재 조건 기준으로<br />
              <b>월 납입금 낮출 수 있는 장기렌트 견적</b>이 있습니다.<br />
              지금 바로 무료로 확인해보세요.
            </div>
            <button
              className="exit-popup-btn"
              onClick={() => window.location.href = 'https://www.replyalba.com/pt/ZSzUHBDF6d'}
            >
              무료 견적 확인하기
            </button>
            <div 
              className="exit-popup-close"
              onClick={() => setShowExitPopup(false)}
            >
              닫기
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

