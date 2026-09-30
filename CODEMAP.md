# CODEMAP

ALLCAR (`https://allrecipes.kr`) 운영 사이트의 코드 지도다. STEP 1 감사와 현재 repository가 source of truth다.

protected detail count는 **181**이다. 다른 사이트의 개수를 이 사이트에 적용하지 않는다.

## 우선순위

1. 이 repository의 실제 코드와 데이터
2. `LEGACY_RENEWAL_MASTER.md`. 공통 workflow다. runtime import 대상이 아니다
3. `REFERENCE_ROYAL_CODEMAP.md`. 과거 구현을 보는 historical reference다. runtime import 대상이 아니다

## 1. PROJECT

- package: `longterm-rent-landing`
- Next.js 14.2.8, React 18.3.1, TypeScript 5.6.3
- Tailwind 3.4.14
- App Router
- `output: 'export'`, `images.unoptimized: true`, 상세·허브 `dynamic = "error"`
- package manager: npm
- build: `next build && node scripts/copy-images.js`
- backend, DB, API, auth, admin: 없음
- deployment 설정 파일: 없음. 산출물은 `out/` 정적 HTML
- trailingSlash: 설정 없음. 상세 URL에 trailing slash를 붙이지 않는다

## 2. BRAND / DOMAIN

production domain은 `https://allrecipes.kr`이다. 이번 architecture 단계에서 바꾸지 않는다.

현재 브랜드 문자열은 하나로 모이지 않는다. rename하지 않는다.

| 위치 | 값 |
|---|---|
| `SITE.name` | `2026 장기렌트카 가격 비교 총정리` |
| `SITE.logoText` | `장기렌트카 가이드` |
| layout `title.template` suffix | `장기렌트카 가이드` |
| package name | `longterm-rent-landing` |
| contact email | `contact@example.com` |

protected browser title suffix `장기렌트카 가이드`는 SEO lock이다. 변경 금지.

## 3. PROTECTED SEO

상세 route source:

`data/keywords.json` → `app/[slug]/page.tsx` `generateStaticParams()`

보호 상세는 **181**개다. 겹쳐 보이는 keyword, `-alt` slug, `소나타`, `장기렌터카`, `suv장기렌트`, `lpg장기렌트`, `k3/k5/k8/k9장기렌트`를 normalize하지 않는다.

잠긴 snapshot: `data/seo-protected-baseline.json`

각 record:

- `slug`
- `finalUrl`
- `finalBrowserTitle`
- `canonical`

정의:

- final URL: `https://allrecipes.kr/{slug}`
- trailing slash 없음. `https://allrecipes.kr/{slug}/`로 바꾸지 않는다
- final browser title: `{pageTitle} | 장기렌트카 가이드`
- canonical: `https://allrecipes.kr/{slug}`
- H1: `pageTitle`

H1과 browser title은 의도적으로 다르다. editorial JSON이 H1, `pageTitle`, browser title, canonical, URL을 바꾸면 안 된다.

루트 layout:

```text
title.template = %s | 장기렌트카 가이드
```

이 template은 상세 route에 붙는다. 홈 `app/page.tsx`에는 붙지 않는다. 저장된 `pageTitle`만 잠그면 보호가 끝나지 않는다. 잠금 대상은 template이 붙은 최종 browser title이다.

`og:title`과 JSON-LD `headline`은 suffix 없는 `pageTitle`이다.

SEO identity source:

- `data/keywords.json`
- `lib/seo.ts` `detailMetadata()`
- `app/layout.tsx` title template
- `lib/site.ts` `SITE.domain`

`data/content/*.json`은 metadata, title, canonical, H1의 source가 아니다.

검증:

```text
npm run verify:seo-protected
```

기대:

```text
PROTECTED = 181
SLUGS = 181
TITLES = 181
CANONICALS = 181
EDITORIAL = 181
FALLBACK = 0
```

STEP 4 이후 editorial은 181, fallback은 0, orphan은 0이다. 181개 상세 본문은 `data/content/{slug}.json`이다. 파일이 없으면 legacy template으로 떨어진다.

## 4. HUBS

허브 7개. 배정 변경 금지. empty 0, orphan detail 0.

| hub | route | count |
|---|---|---|
| brand-import | `/hub/brand-import` | 85 |
| brand-domestic | `/hub/brand-domestic` | 71 |
| price-compare | `/hub/price-compare` | 13 |
| condition-type | `/hub/condition-type` | 4 |
| car-type | `/hub/car-type` | 3 |
| customer-type | `/hub/customer-type` | 3 |
| guide-review | `/hub/guide-review` | 2 |

type: detail 149, guide 20, platform 12.

쉐보레 3대는 `brand-import`다. KG모빌리티와 르노코리아는 `brand-domestic`다. `isFeatured`는 6개다. car-type, brand-domestic, customer-type에는 featured가 없고, 홈은 해당 허브의 첫 항목을 쓴다.

허브 browser title은 상세 lock과 별도다. 허브 metadata가 이미 `|`를 넣고 layout template이 한 번 더 붙는다.

예: `차종별 장기렌트 가이드 | 장기렌트카 조건·가격 비교 | 장기렌트카 가이드`

이 이중 separator는 이번 단계에서 수정하지 않는다.

## 5. STATIC ROUTES

유지:

- `/`
- `/longterm-rent-guide`
- `/hub`
- `/about`
- `/contact`
- `/terms`
- `/privacy`
- `/disclaimer`

redirect, rewrite, middleware: 없음.

상세 181 slug와 이 정적 route의 충돌: 없음.

## 6. CURRENT TEMPLATE CONTENT

editorial 파일이 없으면 `app/[slug]/page.tsx`의 기존 템플릿이 본문이다. 삭제하지 않는다.

현재 legacy 본문:

- 요약 3칸
- 목차 5항
- 본문 5섹션
- 1절과 3절만 keyword 치환
- 2절의 전기차·하이브리드 문단은 모든 상세에 동일
- 체크리스트 5항 동일
- 관련 링크: 홈, 허브, sibling 2, 허브의 첫 guide/platform
- 이미지 3장. `public/imge` 39장을 slug 해시로 섞어 재사용
- FAQ 본문 없음

`scripts/generate-keywords.js`는 빈 `keywordData` 스텁이다. route를 만들지 않는다.

## 7. EDITORIAL ARCHITECTURE

경로: `data/content/{slug}.json`

현재 editorial JSON은 5개다. 없는 slug는 legacy template이다.

로더: `lib/editorial-content.ts` `getEditorialContent(slug)`

- 파일 없음 → `null` → legacy template
- 파일 있음 → parse + schema validate 후 반환
- invalid JSON 또는 schema 실패 → throw. 조용히 fallback하지 않는다

schema:

```json
{
  "slug": "...",
  "intro": "...",
  "sections": [{ "heading": "...", "paragraphs": ["..."] }],
  "checkpoints": ["..."],
  "faq": [{ "question": "...", "answer": "..." }],
  "conclusion": "..."
}
```

금지 필드: `title`, `pageTitle`, `canonical`, `url`, `CTA`, `metadata`, H1.

렌더러: `components/EditorialDetail.tsx`

- intro, sections, checkpoints, FAQ, conclusion
- 현재 페이지의 heading, card, list 스타일만 사용
- article CTA 없음

`app/[slug]/page.tsx`는 본문만 가른다.

- editorial 있음 → `EditorialDetail`
- editorial 없음 → legacy template
- metadata, canonical, H1, 화면 날짜는 기존 source

editorial JSON이 181개 있다. 파일이 없으면 legacy template으로 떨어진다. 현재 fallback은 0이다.

## 8. CTA

### 현재 runtime

STEP 2에서 runtime CTA는 변경하지 않았다.

| 위치 | 대상 |
|---|---|
| Header primary | `https://jadelink.kr/car/` |
| Header secondary | `/longterm-rent-guide` |
| Global banner | `https://replyalba.com/intros/_frm/index.php?code=JUggdejXh2` |
| Floating CTA | 같은 replyalba URL |
| Exit Popup | 같은 replyalba URL |
| Article top / middle / bottom | 없음 |

Header secondary는 내부 이동이다. CTA가 아니다.

Desktop: 헤더 CTA, 하단 고정 배너, 우측 플로팅. Exit Popup은 `mouseleave`이고 `clientY <= 0`. sessionStorage 없음.

Mobile `max-width: 768px`: 배너는 상단 고정, 플로팅은 우측 하단. 모바일 전용 Exit Popup 트리거는 없다.

### 확정 CTA 정책

FINAL CTA TARGET:

`https://jadelink.kr/car/`

이 값은 선택사항이나 future candidate가 아니다. ALLCAR과 이후 같은 장기렌트 legacy renewal의 확정 primary CTA destination이다.

후속 UI/CTA renewal에서 아래 external primary quote CTA를 모두 이 URL로 통일한다.

- header
- homepage primary CTA
- article top CTA
- article middle CTA
- article bottom CTA
- desktop floating CTA
- mobile fixed CTA
- desktop Exit Popup CTA
- mobile Exit Popup CTA

`replyalba.com` CTA는 최종 renewal에서 제거 대상이다.

내부 navigation link는 CTA가 아니다. `/longterm-rent-guide`를 포함한 기존 internal route는 유지한다.

## 9. ANALYTICS / VERIFICATION

runtime:

- GA4 없음
- gtag 없음
- GTM 없음
- AdSense 없음
- `ads.txt` 없음
- CTA tracking 없음
- `process.env` 참조 0

`.env.local`에 analytics 관련 변수 이름이 있어도 runtime에 연결하지 않는다. 값을 출력하지 않고, 삭제하지 않고, GA4를 추가하지 않는다. OpenAI 키도 이 단계에서 사용하지 않는다.

검증 파일 유지:

- Google: `public/googlee34fc2555984e68e.html`
- Naver: `public/naver1b4e8074f823692e342d784108318149.html`

Bing, IndexNow: 없음.

## 10. ASSETS

- 본문 이미지 39장: `public/imge/Image_fx.png`, `Image_fx (1).png`–`(38).png`
- hero: `public/imge/main-hero/153830.png`
- favicon, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` 유지. 네 파일의 해시는 같다
- 프로젝트 루트 `imge/`는 없다. `scripts/copy-images.js`의 root `imge/` warning은 이번 단계에서 고치지 않는다
- 미사용 asset 삭제 금지

## 11. DATE

### 현재 runtime

이번 단계에서 날짜 코드를 바꾸지 않았다. 세 표면은 서로 다르다.

| 표면 | 값 | source |
|---|---|---|
| 상세 화면 최종 업데이트 | `2025-12-26` | `app/[slug]/page.tsx` 하드코드 |
| 푸터 최종 업데이트 | `2025-02-23` | `SITE.editorial.lastUpdatedDefault` |
| JSON-LD `datePublished` | `2025-02-23` | 같은 상수. 상세·허브·가이드 |
| JSON-LD `dateModified` | `2025-02-23` | published와 동일. 분리되어 있지 않음 |
| sitemap `lastModified` | 빌드 시점 `new Date()` | 모든 URL이 같은 시각 |

`keywords.json`에는 날짜 필드가 없다.

상세 화면의 `2025-12-26`은 기존 historical modified-style 표시값이다. published 기준일로 쓰지 않는다.

### 이후 freshness 정책

runtime에는 아직 적용하지 않는다.

- `datePublished`는 original publication baseline `2025-02-23`을 보존한다
- 본문이나 페이지가 substantive하게 수정되는 시점에 `dateModified`, 화면 updated, 해당 URL의 sitemap `lastModified`를 실제 작업일로 바꾼다
- `datePublished`와 `dateModified`는 분리한다
- sitemap의 build-time `new Date()` 제거는 후속 freshness 단계다
- 수정하지 않은 페이지에 거짓 최신 날짜를 찍지 않는다
- SEO lock과 날짜 갱신은 별개다

## 12. SITEMAP / ROBOTS

`app/sitemap.ts` 현재 191 URL.

- home 1
- `/longterm-rent-guide` 1
- hub index 1
- hub 7
- protected detail 181

trust 5페이지(`/about`, `/contact`, `/terms`, `/privacy`, `/disclaimer`)는 sitemap에 없다.

모든 `lastModified`는 build-time `new Date()`다. 이번 단계에서 수정하지 않는다.

robots: `Allow: /`, host `https://allrecipes.kr`, sitemap `https://allrecipes.kr/sitemap.xml`. Disallow 없음.

### 홈 canonical

- home canonical: `https://allrecipes.kr`
- sitemap home: `https://allrecipes.kr/`

상세 181에는 영향이 없다. 이번 단계에서 수정하지 않는다.

## 13. FAQ STRUCTURED DATA

legacy JSON-LD `FAQPage.mainEntity`는 빈 배열이다. 상세 본문 FAQ도 없다.

이번 단계에서 FAQ structured data를 고치지 않는다. editorial FAQ와 JSON-LD FAQ의 연결은 본문이 생긴 뒤의 structured-data 단계에서 한다.

## 14. CONTENT GENERATION PLAN

생성은 로컬 스크립트 `scripts/generate-editorial-content.mjs`만 사용한다. model은 `gpt-4o-mini`다. 키는 `.env.local`만 사용한다. server, GitHub Actions, Cloudflare, Vercel runtime, cron, 예약 생성은 없다.

STEP 3 pilot은 완료했다. editorial 5, fallback 176.

| slug | type | hub | intent | 판정 | chars | SHA256 |
|---|---|---|---|---|---|---|
| audi-a3-longterm-rent | detail | brand-import | 수입 소형 세단 | WARN | 927 | `d836835d95b45c275365f0356c3ebc765d3e1ad87657b48e0cb74f91a660e732` |
| no-deposit-longterm-rent | guide | condition-type | 무보증·비용 구조 | WARN | 1110 | `8a06b63abb2ffd7277de1b75db3a49f3254e5c04a33b2138fba8ee271590153e` |
| longterm-rent-license-plate-insurance | guide | guide-review | 번호판·보험 | WARN | 879 | `3ed0551dd798edd9c208690be819834f0e1f576a3b3d469fff01400edb5e1764` |
| longterm-rent-car-price-compare | platform | price-compare | 견적 비교 기준 | WARN | 895 | `b8b72c82d245d619b76ee9902e3cb1940e2562d9d64a656f462a45f9023c31f2` |
| corporate-longterm-rent | guide | customer-type | 법인 이용 판단 | WARN | 1029 | `d990209e93d1a87372ccac3472f5ce9bf4c7e20d9d66964db81ba47b2fcad84a` |

BLOCK으로 저장본을 버린 뒤 다시 받은 페이지는 위 파일만 남겼다. 최종 5개에 BLOCK은 없다. WARN은 분량이 1300자보다 짧고, 일부 문장이 일반적인 점이다. 이 5개는 STEP 4에서 재생성하지 않는다.

로컬 호출 usage 합계. 첫 schema 실패 3회는 usage를 남기기 전에 버려져 이 합계에 없다.

- model: `gpt-4o-mini`
- prompt tokens: 8285
- completion tokens: 10083
- total tokens: 18368

날짜는 바꾸지 않았다. CTA runtime도 바꾸지 않았다. 확정 CTA target은 `https://jadelink.kr/car/`다. editorial JSON에는 CTA가 없다.

STEP 4 FULL CONTENT = COMPLETE. generation CLOSED.

없는 파일만 생성했다. pilot 5개는 API에 다시 보내지 않았다. 종료 시점 SHA256은 위 표와 같다.

- protected = 181
- content JSON = 181
- editorial = 181
- fallback = 0
- orphan = 0

품질. 공백 제외 본문 길이.

- min chars: 571
- average chars: 887
- max chars: 1243
- 1300자 미만: 181
- 2000자 초과: 0
- BLOCK: 0
- WARN: 181
- exact duplicate body: 0
- exact duplicate intro: 0
- exact duplicate conclusion: 0
- exact duplicate section paragraph: 0
- contamination: 0

1300자 미만은 WARN이다. 길이만으로 다시 생성하지 않았다. 보험·정비 포함이나 인기·저렴함을 사실처럼 쓴 페이지만 지우고 그 slug만 다시 받았다.

STEP 4 OpenAI. STEP 3 합계와 따로 센다. model은 `gpt-4o-mini`. 로컬 `.env.local`만 사용했다.

- API responses: 371
- successful saved: 268
- retries: 90
- discarded: 103
- failed remaining: 0
- prompt tokens: 257979
- completion tokens: 274111
- total tokens: 532090

날짜는 바꾸지 않았다. CTA runtime도 바꾸지 않았다. 확정 CTA target은 `https://jadelink.kr/car/`다. editorial JSON에는 CTA가 없다. FAQ structured data와 analytics는 바꾸지 않았다.

본문은 그 페이지의 검색 의도에 맞는 독립 글이다. 다른 사이트 본문을 복사하지 않는다.

## 15. QUALITY POLICY

BLOCK. 통과로 처리하지 않는다.

- invalid JSON
- schema failure
- wrong slug
- foreign brand / domain contamination
- exact severe duplication
- protected SEO modification
- build failure

WARN. 기록만 한다. WARN만으로 전체를 다시 생성하지 않는다.

- modest length variance
- minor repetition
- stylistic imperfection

## 16. FUTURE UI PLAN

아직 구현하지 않는다. Rent-Pick은 원래 디자인·레이아웃 참고다. Royal은 완료된 legacy 구현 참고다. brand, domain, assets, routes, SEO, content는 ALLCAR 값을 유지한다.

이후 기준:

- `max-w-3xl`
- panel / card
- 반응형 기준 768px
- article CTA top / middle / bottom
- desktop bottom floating CTA
- mobile bottom fixed CTA
- desktop Exit Popup과 mobile Exit Popup
- 세션당 한 번
- sessionStorage key는 ALLCAR 전용. 다른 사이트 key를 복사하지 않는다
- popup이 열려 있는 동안 global CTA를 숨긴다

external primary quote CTA의 대상은 확정값 `https://jadelink.kr/car/`다. `replyalba.com`은 제거 대상이다. 내부 navigation은 유지한다.

## 17. KNOWN ISSUES

이번 단계에서 고치지 않는다.

- 브랜드 문자열과 `allrecipes.kr`이 서로 다르다
- header CTA와 banner/floating/exit CTA의 호스트가 갈라져 있다
- 상세 화면 날짜, JSON-LD, sitemap lastModified가 서로 다르다
- JSON-LD FAQ `mainEntity`가 비어 있다
- 홈 canonical과 sitemap home의 trailing slash가 다르다
- 허브·가이드 browser title에 layout suffix가 한 번 더 붙는다
- legacy template 코드는 남아 있다. 현재 181개 본문은 editorial JSON이다
- `.env.local`의 GA 변수는 코드가 읽지 않는다
- root `imge/` copy warning
- favicon과 icon 파일이 동일 해시다

## 18. COMMANDS

```text
npm run verify:seo-protected
npx tsc --noEmit
npm run build
```
