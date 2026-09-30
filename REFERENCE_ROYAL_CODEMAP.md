# REFERENCE ONLY — DO NOT USE AS RENTKOREACAR SOURCE OF TRUTH

This file is copied from the completed Royal legacy renewal project.

It may be used only as a reference for:
- renewal workflow
- UI/layout principles
- CTA placement
- responsive behavior
- validation workflow
- legacy renewal date/freshness policy

It must NOT be used as the source of truth for:
- protected page count
- URLs
- slugs
- titles
- canonicals
- keywords
- content
- hubs
- brand
- domain
- assets
- internal links
- analytics

All RENTKOREACAR values must be discovered from the actual RENTKOREACAR repository.

# CODEMAP

Royal Car (`royalcar.co.kr`) 운영 사이트의 코드 지도다. 이 저장소는 legacy site renewal의 구현 참고다. 콘텐츠 개수 143은 Royal 전용이다. 다른 사이트에 이 숫자를 적용하지 않는다.

## ROYAL FINAL STATE

- brand: 로얄카
- domain: `https://royalcar.co.kr`
- CTA: `https://jadelink.kr/car/` (`lib/site-config.ts`의 `ctaPrimary`)
- architecture: Next.js App Router, TypeScript, Tailwind, static export
- content source: `data/keywords.json`, `data/content/{slug}.json`
- protected content count: 143. Royal 전용
- editorial: 143
- fallback: 0
- static pages: 163
- hubs: 7
- SEO protected: content 143, slug 143, title 143, canonical 143

PROTECTED SEO ASSETS: 기존 URL, slug, title, canonical 변경 금지. 색인된 페이지 삭제 금지. slug 변경 금지. title을 더 나아 보이게 고치지 않는다. canonical 변경 금지. sitemap의 콘텐츠 URL 변경 금지.

`longterm-rent-car`의 최종 title은 `장기렌트카 | 로얄카 | 로얄카`다. 겹쳐 보여도 protected baseline이므로 이 renewal에서 수정하지 않았다.

---

## 1. PROJECT PURPOSE

로얄카는 장기렌트카 정보를 제공하는 정적 사이트다. Next.js App Router로 빌드하고 Cloudflare Pages에 배포한다.

콘텐츠 페이지 143개는 이미 색인된 URL이다. 이번 리뉴얼의 기준은 그 143개 slug, URL, 최종 title, canonical을 유지한 채 본문만 나중에 교체할 수 있게 하는 것이다.

143개 본문은 `data/content/{slug}.json`에 있다. 생성은 로컬에서만 하고, slug, URL, title, canonical은 바꾸지 않는다.

## 2. CURRENT ARCHITECTURE

- Next.js 14 App Router, `output: 'export'`, `trailingSlash: true`
- 데이터는 `data/keywords.json`, `data/hubs.json`
- 상세 페이지는 `app/[slug]/page.tsx` 하나의 템플릿
- SEO 메타데이터는 페이지 `generateMetadata`와 `app/layout.tsx`의 `title.template`이 합쳐져 최종 `<title>`이 된다
- 이미지 경로는 현재 코드 그대로 `/imge/...` 다
- 정적 빌드 결과의 상세 route는 143개, 허브 route는 7개다

**이후 계획:** slug별 독립 본문이 생기면 그 페이지만 새 렌더러를 탄다. SEO 메타데이터의 source of truth는 계속 `keywords.json`과 기존 title, canonical 규칙이다.

## 3. DIRECTORY MAP

```
app/
  layout.tsx                 루트 레이아웃, title template, AdSense 스크립트
  page.tsx                   홈
  [slug]/page.tsx            143개 상세 route
  hub/page.tsx               허브 인덱스
  hub/[hubSlug]/page.tsx     허브 7개
  longterm-rent-guide/       보조 메인
  about/ contact/ terms/ privacy/ disclaimer/
  sitemap.ts robots.ts
components/                  공통 UI, CTA
data/
  keywords.json              143개 SEO source of truth
  hubs.json                  허브 7개
  seo-protected-baseline.json
  content/                   editorial JSON 143개. SEO 필드는 읽지 않는다
lib/
  site-config.ts             사이트 이름, 도메인, CTA, 편집 표기
  data-utils.ts              keywords, hubs 조회
  seo-utils.ts               title, description, canonical, JSON-LD
  editorial-content.ts       선택적 본문 로더
  image-utils.ts image-manifest.ts
scripts/
  verify-seo-protected.js
  seo-protected-rules.js
  generate-numeric-redirects.js
functions/_middleware.ts     숫자 경로 301
public/                      ads.txt, 검증 파일, 이미지
```

## 4. CONTENT ARCHITECTURE

**현재 상태**

143개 페이지의 키워드, slug, `pageTitle`, 허브, type은 `data/keywords.json`에 있다. 본문은 `data/content/{slug}.json` 143개다. `EditorialDetail`이 그 본문을 그린다. JSON이 없거나 본문 필드가 없으면 legacy 템플릿으로 돌아간다. 현재 fallback은 0이다.

페이지 수:

| 구분 | 개수 |
| --- | ---: |
| 전체 콘텐츠 페이지 | 143 |
| detail | 123 |
| guide | 11 |
| platform | 9 |

허브별 소속:

| hubSlug | 페이지 |
| --- | ---: |
| brand-import | 80 |
| brand-domestic | 44 |
| price-compare | 11 |
| condition-type | 3 |
| customer-type | 3 |
| guide-review | 2 |
| car-type | 0 |

`car-type` 허브 페이지는 소속 키워드가 0개라, 허브 템플릿 안에서 키워드 문자열로 일부를 골라 보여 준다.

editorial JSON은 SEO 메타데이터를 갖지 않는다. slug, title, canonical은 `keywords.json`과 레이아웃 title template이 만든다.

## 5. PROTECTED SEO ASSETS

보호 대상은 콘텐츠 페이지 143개다. 143은 Royal 전용 숫자다.

PROTECTED CONTENT COUNT = 143

금지:

- 기존 URL, slug, title, canonical 변경
- 색인된 페이지 삭제
- 기존 slug 변경
- 기존 title을 임의로 개선
- canonical 변경
- sitemap 콘텐츠 URL 변경

`longterm-rent-car` 최종 title `장기렌트카 | 로얄카 | 로얄카`는 이상해 보여도 baseline이다. 수정하지 않았다.

각 페이지에서 바꾸면 안 되는 값:

- slug
- URL `https://royalcar.co.kr/{slug}/`
- `keywords.json`의 `pageTitle`
- 최종 렌더링 `<title>`
- canonical `https://royalcar.co.kr/{slug}/`

`pageTitle`만 고정하면 보호가 되지 않는다. 브라우저와 크롤러가 보는 title은 metadata title에 레이아웃 template이 적용된 값이다.

잠긴 목록은 `data/seo-protected-baseline.json`이다. `keywords.json`은 이 baseline을 만들기 위해 수정하지 않는다.

허브 7개, 홈, 가이드, 신뢰 페이지는 이 143개 보호 목록에 넣지 않는다. 이번 단계에서 그 페이지의 title과 canonical도 바꾸지 않는다.

## 6. 143 LEGACY CONTENT ROUTES

상세 route는 `app/[slug]/page.tsx`다.

- `generateStaticParams()`가 `keywords.json` 143개를 모두 정적 경로로 만든다
- `dynamicParams = false`
- 공개 URL은 `https://royalcar.co.kr/{slug}/`
- 빌드 산출물은 `out/{slug}/index.html`

전체 slug 목록의 source of truth는 `data/keywords.json`이고, 보호 스냅샷은 `data/seo-protected-baseline.json`이다. 두 파일의 slug 집합은 143개로 같아야 한다.

대표 예:

| slug | 비고 |
| --- | --- |
| audi-a3 | `pageTitle`이 있어 template이 한 번 붙는다 |
| benz-e-class | 동일 |
| corporate | 동일 |
| price-compare | 동일 |
| longterm-rent-car | `pageTitle`이 빈 문자열. 최종 title `장기렌트카 \| 로얄카 \| 로얄카`는 보호 대상 |

## 7. TITLE RESOLUTION RULE

**현재 상태. 이 규칙을 바꾸지 않는다.**

루트 레이아웃 (`app/layout.tsx`):

```ts
title: {
  default: SITE.name,
  template: `%s | ${SITE.name}`,
}
```

`SITE.name`은 `로얄카`다. 자식 segment의 string title에는 `%s | 로얄카`가 적용된다. 루트 `app/page.tsx`는 레이아웃과 같은 segment라 template이 적용되지 않는다. 홈의 현재 `<title>`은 `장기렌트카`다.

상세 페이지 (`app/[slug]/page.tsx`):

```ts
const title = keyword.pageTitle || generateTitle(keyword.keyword);
```

`generateTitle(keyword)`에 허브 인자가 없으면 `lib/seo-utils.ts`는 `{keyword} | 로얄카`를 반환한다.

그 문자열이 레이아웃 template을 한 번 더 통과한다. Next.js 14.2는 string title에 parent template을 적용하고, `absolute`가 아니면 template을 건너뛰지 않는다.

그래서 최종 `<title>`은 두 가지다.

1. `pageTitle`이 비어 있지 않으면 `{pageTitle} | 로얄카`
2. `pageTitle`이 비어 있으면 `{keyword} | 로얄카 | 로얄카`

`longterm-rent-car`는 2번이다.

- keyword: `장기렌트카`
- storedPageTitle: 빈 문자열
- metadata에 전달되는 title: `장기렌트카 | 로얄카`
- resolvedTitle: `장기렌트카 | 로얄카 | 로얄카`
- canonical: `https://royalcar.co.kr/longterm-rent-car/`

이 이중 suffix는 결함처럼 보여도 현재 색인 title이다. 고치지 않는다.

허브 페이지는 보호 목록 밖이다. 참고로 `generateTitle(hubKeyword, hubTitle)`이 이미 사이트 이름을 포함하고, template이 다시 붙는다. 예: `수입차 장기렌트 | 수입차 장기렌트 | 로얄카 | 로얄카`. 이번 단계에서 허브 title 규칙도 바꾸지 않는다.

## 8. CANONICAL RULE

상세 페이지 canonical은 `generateCanonical(\`/${keyword.slug}/\`)`다.

`generateCanonical`은 `SITE.domain + path`다. `SITE.domain`은 `https://royalcar.co.kr`다.

결과: `https://royalcar.co.kr/{slug}/`

trailing slash는 `next.config.js`의 `trailingSlash: true`와 맞다. 본문 JSON은 canonical을 덮어쓰지 않는다.

## 9. SITEMAP

`app/sitemap.ts`가 빌드 시 `sitemap.xml`을 만든다.

포함 URL:

- `https://royalcar.co.kr`
- `https://royalcar.co.kr/longterm-rent-guide/`
- `https://royalcar.co.kr/hub/`
- 허브 7개의 `/hub/{hubSlug}/`
- 143개 `/{slug}/`
- 신뢰 페이지 5개: about, contact, terms, privacy, disclaimer

143개 상세 URL은 `keywords.json`의 slug에서 온다. sitemap URL 변경은 이번 단계 범위 밖이다.

`app/robots.ts`는 전체 허용이고 sitemap을 `https://royalcar.co.kr/sitemap.xml`로 가리킨다.

## 10. HUB STRUCTURE

`data/hubs.json`의 허브는 7개다.

| slug | title |
| --- | --- |
| car-type | 차종별 장기렌트 |
| brand-domestic | 국산차 장기렌트 |
| brand-import | 수입차 장기렌트 |
| condition-type | 조건·유형별 장기렌트 |
| customer-type | 대상별 장기렌트 |
| price-compare | 가격 비교·견적 |
| guide-review | 가이드·후기·비교 |

route는 `app/hub/[hubSlug]/page.tsx`다. 허브 인덱스 route는 `app/hub/page.tsx`다. 빌드의 허브 동적 route는 7개다.

상세 페이지의 관련 글은 같은 허브 형제 2개와 `guide-review` 안내 글 1개다.

## 11. CTA CURRENT STATE

외부 견적 CTA의 source of truth는 `lib/site-config.ts`의 `ctaPrimary`다.

- primary: `장기렌트 견적 확인하기` → `https://jadelink.kr/car/`
- secondary: `차종별 장기렌트 보기` → `/longterm-rent-guide`

사용 위치:

- 본문 폭은 `max-w-3xl`이다.
- `CTASection`: 홈 견적 패널. primary 버튼과 secondary 내부 링크
- `GlobalCtas`: 768px 초과는 하단 플로팅 배너, 이하는 하단 고정 바. 둘은 동시에 보이지 않는다. 데스크톱 이탈 팝업은 포인터가 화면 위쪽(`clientY < 10`)으로 나갈 때 연다. 모바일 이탈 팝업은 들어오자마자 열지 않고, 스크롤이 멈춘 뒤 1.6초에 연다. 둘 다 sessionStorage `royal-exit-popup`으로 세션당 한 번이다. 팝업이 열린 동안 해당 하단 CTA는 숨기고, 닫으면 다시 보여 준다.
- `EditorialDetail`: 글 상단, 섹션 중간, 관련글 앞에 견적 버튼이 있다. 섹션이 3개 미만이면 중간 버튼은 없다.

GA4와 CTA 클릭 추적은 없다.

## 12. GA4 CURRENT STATE

현재 GA4 태그는 없다. `gtag`, Google Tag Manager, measurement id가 코드에 없다.

legacy renewal에서는 GA4를 새로 넣지 않는다. 새 Measurement ID, `gtag`, CTA tracking을 추가하지 않는다.

## 13. ADSENSE

**현재 상태. 수정하지 않는다.**

- `app/layout.tsx`가 `ca-pub-3472753117675617` AdSense 스크립트를 로드한다
- `public/ads.txt`는 `google.com, pub-3472753117675617, DIRECT, f08c47fec0942fa0`

## 14. LEGACY CONTENT FALLBACK

**현재 상태**

`data/content/`에 `{slug}.json`이 없거나, 파일이 있어도 본문 필드가 없으면 `getEditorialContent()`는 `null`을 반환한다. 그러면 `app/[slug]/page.tsx`의 기존 템플릿이 그대로 출력된다.

content JSON이 없거나 본문 필드가 없으면 legacy 템플릿을 쓴다. 현재는 143개 모두 editorial JSON이 있다.

STEP 4:

- editorial content = 143/143
- legacy fallback = 0
- pilot 5개는 재생성하지 않고 유지: `audi-a3`, `genesis-g80`, `lotte-rent-car`, `corporate`, `no-guarantee`
- model = gpt-4o-mini
- local-only generation. `npm run generate:content -- --missing`은 파일이 없는 slug만 만들고, 기존 파일은 덮어쓰지 않는다.
- protected SEO = 143 PASS
- full content generation completed

legacy 본문은 상세 페이지 안의 공통 섹션이다. 핵심 요약, 조건 설명, 장단점, 추천 대상, 주의사항, 월 납입금 계산, 계약 절차, 관련글, 하단 secondary CTA.

## 15. NEW EDITORIAL CONTENT STRUCTURE

**현재 상태:** editorial JSON 143개. legacy fallback 0.

경로: `data/content/{slug}.json`

로더: `lib/editorial-content.ts`의 `getEditorialContent(slug)`

읽는 필드:

- `intro`
- `sections[]`의 `heading`, `paragraphs`
- `checkpoints[]`
- `faq[]`의 `question`, `answer`
- `related[]`의 `label`, `href`

읽지 않는 필드:

- `slug`
- `title`
- `pageTitle`
- `canonical`

이 값들이 파일에 있어도 metadata, `<title>`, canonical에 반영되지 않는다. SEO source of truth는 계속 `keywords.json`, `generateMetadata`, 레이아웃 template, `generateCanonical`이다.

파일이 있고 위 본문 필드가 하나라도 있으면 `components/EditorialDetail.tsx`가 그 페이지만 렌더한다. h1은 `keyword.keyword`를 쓰고, title과 canonical은 기존 metadata를 쓴다.

**이후 계획:** 본문 추가는 로컬에서 slug 또는 `--missing`으로만 한다. 있는 파일은 덮어쓰지 않는다.

## 16. SEO PROTECTION VERIFICATION

명령:

```
npm run verify:seo-protected
```

스크립트는 `data/keywords.json`과 현재 title, canonical 코드 규칙으로 143개 레코드를 다시 계산하고 `data/seo-protected-baseline.json`과 비교한다.

FAIL 조건:

- 개수가 143이 아님
- slug 추가, 삭제, 변경
- URL 변경
- resolved title 변경
- canonical 변경
- 레이아웃 title template 변경
- 상세 metadata가 `pageTitle || generateTitle(keyword)` 규칙을 벗어남
- 상세 metadata가 `data/content`를 읽음

PASS 출력:

```
PROTECTED CONTENT = 143
PROTECTED SLUGS = 143
PROTECTED TITLES = 143
PROTECTED CANONICALS = 143
RESULT = PASS
```

이 검증은 OpenAI API와 무관하다.

## 17. RENEWAL ROADMAP

**이번 단계에서 한 일**

- 143개 SEO baseline 고정
- 보호 검증 스크립트
- 본문이 없을 때 legacy 템플릿을 유지하는 저장 구조
- 이 CODEMAP

**STEP 3에서 한 일**

- 대표 5개 editorial JSON
- 로컬 전용 generator `scripts/content-generator/`
- 모델 gpt-4o-mini

**STEP 4에서 한 일**

- 나머지 138개 editorial JSON. pilot 5개는 유지
- editorial content = 143/143
- legacy fallback = 0
- full content generation completed

CTA, 편집 표기, Rent-Pick 기준 레이아웃, 모바일 이탈 팝업까지 반영된 상태다. GA4는 추가하지 않았다. 숫자 경로 redirect는 유지한다.

본문이 있어도 slug, URL, resolved title, canonical은 baseline과 같아야 한다.

## 18. DEPLOYMENT / BUILD

```
npm run build
```

`next build` 후 `scripts/generate-numeric-redirects.js`가 `out/`에 Cloudflare `_redirects` 자리 표시를 쓴다. 숫자로만 된 경로의 301은 `functions/_middleware.ts`가 처리한다. 이 정책은 바꾸지 않는다.

`next.config.js`:

- `output: 'export'`
- `images.unoptimized: true`
- `trailingSlash: true`

배포 대상은 Cloudflare Pages 정적 산출물이다. 이번 단계에서 Cloudflare 설정은 바꾸지 않는다.

## 19. OPEN ITEMS

- editorial content = 143/143. legacy fallback = 0. full content generation completed.
- `longterm-rent-car`의 최종 title `장기렌트카 | 로얄카 | 로얄카`는 유지 대상이다.
- `car-type` 허브에 소속된 콘텐츠 slug는 0개다.
- 편집 표기 작성자와 JSON-LD author는 `로얄카 편집팀`이다.
- GA4는 아직 없다.
- AdSense publisher id와 `ads.txt`는 유지한다.
- 숫자 경로 redirect는 유지한다.

## 20. LEGACY RENEWAL MASTER STANDARD

이 절은 이후 legacy site renewal의 작업 기준이다. 143은 Royal 전용이다. 다른 사이트의 페이지 수는 그 저장소를 감사한 결과다.

### 참고 관계

- Rent-Pick: 원래 디자인과 레이아웃 참고. 콘텐츠를 복사하지 않는다.
- Royal: 끝난 legacy renewal의 구현 참고. 콘텐츠를 복사하지 않는다.
- 다음 legacy site: 그 사이트의 SEO, 콘텐츠, 데이터가 source of truth다.

재사용하는 것: 작업 순서, UI와 레이아웃 원칙, CTA 구조, 반응형 동작, 검증 절차.

사이트마다 따로 두는 것: 페이지 수, 키워드, slug, URL, title, canonical, 본문, 브랜드, 도메인, 이미지, 내부 링크.

### STEP 1. READ-ONLY AUDIT

각 저장소를 먼저 읽기만 한다. 확인: framework, build와 deploy, 실제 콘텐츠 수, 콘텐츠 위치, 기존 slug, 기존 URL, title 생성, canonical, sitemap, 허브, CTA, analytics, 빌드 상태.

처음부터 Royal의 143을 적용하지 않는다.

### STEP 2. SEO PROTECTED BASELINE

그 사이트의 실제 콘텐츠 수로 slug, URL, title, canonical baseline을 만든다. Royal은 143이다. 다른 사이트는 145, 249, 또는 그 감사 결과일 수 있다. 감사 결과가 source of truth다.

### STEP 3. PER-PAGE CONTENT ARCHITECTURE

기존 SEO 페이지는 유지하고, 페이지별 editorial 본문 구조만 만든다. 기존 페이지를 지우거나 새 URL로 바꾸지 않는다.

### STEP 4. PILOT CONTENT GENERATION

대표 5개 정도만 먼저 만들고 검증한다. 모델은 gpt-4o-mini다. 로컬에서만 실행한다. 서버, GitHub Actions, Cloudflare runtime에서 OpenAI를 호출하지 않는다.

### STEP 5. FULL CONTENT GENERATION

pilot이 문제없으면 그 사이트의 남은 기존 페이지만 만든다. 다른 사이트 본문, Royal 본문, Rent-Pick 본문을 복사하지 않는다. 그 페이지의 키워드와 의도에 맞게 따로 만든다.

### STEP 6. UI / LAYOUT RENEWAL

참고는 Rent-Pick과 완성된 Royal 구현이다. 기준: Rent-Pick의 레이아웃과 디자인, `max-w-3xl` 계열, panel/card, 반응형 구조, header와 nav, hero 비율, article 레이아웃, 글자 위계, 관련 콘텐츠, FAQ, footer.

사이트 고유의 브랜드, 도메인, 이미지, 콘텐츠, 내부 링크, SEO는 유지한다.

### STEP 7. CTA STANDARD

ARTICLE: `article-top`, `article-middle`, `article-bottom`.

DESKTOP: 하단 플로팅 CTA. desktop Exit Popup은 필수다.

MOBILE: 하단 고정 CTA. mobile Exit Popup은 필수다. 빠뜨리면 이 기준을 통과하지 못한다.

각 사이트의 컴포넌트 구조에 맞게 구현한다. Royal의 파일을 그대로 붙이지 않는다.

Royal 구현:

- 본문, 헤더, 푸터 폭은 `max-w-3xl`이다. 섹션은 panel/card다. 하단 CTA 분기는 768px이다.
- `article-top`은 글 헤더 다음이다.
- `article-middle`은 섹션이 3개 이상일 때 `floor(섹션 수 / 2) - 1` 다음이다. FAQ나 문장 한가운데가 아니다.
- `article-bottom`은 FAQ 다음, 관련글 앞이다.
- 상세 본문 CTA는 이 3개다.
- 데스크톱 플로팅 배너는 768px 이하에서 숨긴다. 모바일 고정 바는 768px 초과에서 숨긴다. 둘은 동시에 보이지 않는다.
- 데스크톱 이탈 팝업: 포인터가 화면 위쪽(`clientY < 10`)으로 나갈 때. 세션당 한 번. 열린 동안 플로팅 CTA를 숨기고, 닫으면 다시 보여 준다.
- 모바일 이탈 팝업: 필수. 뷰포트 768px 이하. 들어오자마자 열지 않는다. 사용자가 페이지를 본 뒤 스크롤이 멈추고 1.6초가 지나면 연다. 세션당 한 번. 열린 동안 하단 고정 CTA를 숨기고, 닫으면 다시 보여 준다. 팝업은 뷰포트 안에 있고 닫기 버튼이 가려지지 않는다.
- Royal의 sessionStorage 키는 `royal-exit-popup`이다. 다른 사이트는 그 브랜드에 맞는 키를 따로 쓴다. 이 키를 복사하지 않는다.

Royal의 외부 견적 CTA는 `lib/site-config.ts`의 `ctaPrimary`만 본다. URL은 `https://jadelink.kr/car/`다. 다른 사이트는 그 사이트에서 정한 CTA source를 쓴다. Royal URL을 다른 사이트에 hardcode하는 기준이 아니다.

### STEP 8. GA4 POLICY

renewal 과정에서 GA4를 새로 넣지 않는다. 새 Measurement ID, `gtag`, CTA tracking을 추가하지 않는다.

그 사이트에 analytics가 이미 있으면, 별도 요청 없이 지우지 않는다.

Royal에는 GA4가 없다.

### STEP 9. VALIDATION

각 사이트에서 확인한다. protected SEO verification, TypeScript, production build, route 수, editorial과 fallback 수, 반응형 렌더, CTA target, 데스크톱과 모바일 Exit Popup, overflow, 수정된 콘텐츠 파일 수.

### STEP 10. GIT

저장소마다 따로 처리한다. build, SEO, UI, CTA가 통과한 뒤에 그 저장소만 commit하고 push한다. 다른 프로젝트 저장소는 수정하지 않는다.

### CONTENT / SEO

본문은 사이트마다 따로 둔다. slug, URL, title, canonical은 그 사이트의 기존 값을 독립적으로 지킨다. Royal의 143개 구조로 다른 사이트를 변환하지 않는다.
