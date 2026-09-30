# LEGACY RENEWAL MASTER

이 파일은 특정 사이트의 CODEMAP이 아니다.

이후 legacy renewal에서 쓰는 공통 workflow와 구현 기준이다. 한 사이트의 완료 문서를 다음 사이트에 그대로 적용하지 않는다.

## 우선순위

1. 작업 중인 사이트의 실제 repository. 브랜드, 도메인, protected count, slug, title, canonical, 본문, 허브, CTA target, 날짜, analytics의 source of truth다.
2. 이 파일. 현재 공통 workflow standard다.
3. `REFERENCE_ROYAL_CODEMAP.md`. 과거 구현을 보는 historical reference다. primary workflow reference가 아니다.

사이트별 CODEMAP은 그 저장소의 READ-ONLY AUDIT 이후에만 만든다. 이 파일을 복사해 사이트 CODEMAP으로 쓰지 않는다.

과거 완료 사이트의 protected count를 다음 사이트에 적용하지 않는다. 예시에 나온 개수는 그 사이트 전용이다.

---

## 1. WORKSPACE WORKFLOW

새 legacy project를 시작할 때:

1. 새 repository를 clone하거나 만든다.
2. 이 master를 그 저장소의 workflow reference로 복사한다.
3. 그 프로젝트를 별도 Cursor window에서 연다.
4. 첫 작업은 READ-ONLY AUDIT다. 이 단계에서 source를 수정하지 않는다.
5. 그 저장소가 실제로 만드는 검색 노출 상세 route로 protected count를 계산한다. 다른 사이트의 개수를 가져오지 않는다.
6. 감사로 확정한 사실만으로 그 사이트의 CODEMAP을 만든다.

감사에서 확인한다.

- framework, router, static export, trailing slash, images, build, package manager
- backend, DB, API, auth 존재 여부
- 실제 route source. 파일이 있어도 route가 쓰지 않으면 protected count에 넣지 않는다
- slug, 최종 title, H1, canonical, sitemap
- hub와 빈 hub
- CTA source와 target
- desktop / mobile CTA와 Exit Popup
- analytics, ads, verification files
- assets의 실제 사용
- DATE / FRESHNESS. 화면 날짜, JSON-LD, sitemap, `new Date()` / `Date.now()`
- 다른 프로젝트의 brand / domain residue. reference 문서 안의 과거 사이트 문구는 contamination 검사에서 제외한다

CODEMAP.md는 감사 전에 만들지 않는다.

---

## 2. SEO PROTECTION

PROTECTED SEO ASSETS:

- existing URL
- existing slug
- existing title. 브라우저와 크롤러가 보는 최종 title
- existing canonical

이 네 값은 유지한다.

같이 유지한다.

- 색인된 상세 페이지 삭제 금지
- sitemap의 기존 콘텐츠 URL 변경 금지
- 보기 이상한 slug, collision suffix, fallback slug, 숫자로 시작하는 slug, 붙어 있는 slug를 normalize하지 않음
- 보기 이상한 최종 title을 더 나아 보이게 고치지 않음
- 빈 title이 만드는 현재 resolved title이 있으면 그 값도 보호
- 이미 route와 sitemap에 있는 hub는 소속 글이 0이어도 삭제하지 않음
- 그 사이트에 numeric legacy route, redirect, middleware가 있으면 유지. 없는 사이트에 다른 사이트의 redirect를 추가하지 않음

`pageTitle` 문자열만 고정해서는 보호가 끝나지 않는다. layout `title.template` 적용 여부까지 포함해, 현재 최종 title을 baseline에 잠근다. template이 없으면 template을 추가하지 않는다. template이 있으면 그 규칙을 바꾸지 않는다.

baseline 파일은 그 사이트의 감사 결과로 만든다. record의 비교 핵심은 slug, URL, title, canonical이다.

검증은 실제 route 생성 코드를 다시 실행해 baseline과 비교한다. route가 쓰지 않는 데이터 파일의 개수로 세지 않는다. editorial 본문이 느는 것 자체는 SEO FAIL이 아니다. 보호 목록 밖의 slug가 route가 되면 FAIL이다.

상세 metadata는 editorial JSON을 읽지 않는다. content JSON에 slug, title, pageTitle, canonical이 있어도 metadata, 최종 title, canonical, H1의 source of truth가 아니다.

허브, 홈, 가이드, 신뢰 페이지는 상세 protected 목록과 구분한다. 감사 단계에서 그 페이지의 title과 canonical도 임의로 바꾸지 않는다.

---

## 3. CONTENT WORKFLOW

### 3.1 Route source

감사에서 상세 페이지의 실제 흐름을 확정한다.

SOURCE FILE → TRANSFORMATION → ROUTE

array, JSON, markdown, TS object, generated records, DB, static files 중 무엇이 route를 만드는지 코드로 확인한다. 같은 제목이 다른 파일에 있어도, route가 쓰지 않으면 그 파일을 source of truth로 바꾸지 않는다.

### 3.2 Protected baseline

그 사이트의 routable 상세 페이지에 대해 slug, URL, 최종 title, canonical baseline을 잠근다. count는 그 감사 결과다.

### 3.3 Editorial architecture

기존 SEO 페이지와 URL은 유지하고, 페이지별 본문만 분리한다.

경로: `data/content/{slug}.json`

로더가 파일을 읽고, 파일이 없거나 본문 필드가 없으면 기존 공통 템플릿을 그대로 출력한다. legacy template은 fallback으로 남긴다.

본문 필드:

- `intro`
- `sections[]`의 `heading`, `paragraphs`
- `checkpoints[]`
- `faq[]`의 `question`, `answer`
- `conclusion`

관련 글 링크가 있으면 그 사이트의 기존 slug만 쓴다. 다른 사이트 링크를 넣지 않는다.

CTA는 본문 JSON에 넣지 않는다. CTA는 UI 단계에서 배치한다.

각 페이지는 그 페이지의 검색 의도에 맞는 독립 본문이다.

- 고유 intro
- sections 4~6
- practical checkpoints
- FAQ 3개 이상
- conclusion

다른 사이트 본문, 과거 renewal 본문, Rent-Pick 본문을 복사하지 않는다.

H1이 title과 같은지, keyword인지, 별도 값인지는 감사에서 확정한 현재 규칙을 유지한다. 다른 사이트의 H1 규칙으로 바꾸지 않는다.

### 3.4 Pilot

대표 5개 정도만 먼저 만든다. 의도가 서로 다른 페이지를 고른다. 예: 차량/모델, 업체 비교, 비용/조건, 보험/가이드, 그 사이트에 있는 특수 intent.

- model: `gpt-4o-mini`
- 실행: LOCAL ONLY
- 지정 slug만 생성한다. slug 없이 실행하면 usage만 출력하고 API를 호출하지 않는다
- pilot을 검증한 뒤에만 나머지를 만든다

### 3.5 Remaining pages

pilot이 통과하면 아직 파일이 없는 보호 페이지만 생성한다.

- 성공한 pilot 파일은 재생성하지 않는다
- 기존 editorial 파일을 덮어쓰지 않는다
- `--missing`은 없는 slug만 만든다

### 3.6 Full validation과 fallback

전체 생성 후 목표:

- editorial = 그 사이트의 protected count
- legacy fallback = 0
- content JSON 수 = protected count
- orphan 파일 = 0. 보호 route에 없는 slug의 content 파일은 0
- exact duplicate bodies = 0
- exact duplicate intros = 0
- foreign brand / domain contamination = 0
- protected SEO verification = PASS

fallback 0은 생성 완료 목표다. 시작 상태의 fallback 수를 0으로 가정하지 않는다.

---

## 4. OPENAI POLICY

- model: `gpt-4o-mini`
- 실행 위치: 로컬만
- 비밀 키는 `.env.local`에만 둔다
- 키는 commit하지 않는다
- 서버에서 호출하지 않는다
- GitHub Actions에서 호출하지 않는다
- Cloudflare 또는 Vercel runtime에서 호출하지 않는다
- cron으로 호출하지 않는다
- 예약 생성, 자동 재생성 작업을 넣지 않는다

생성 스크립트는 그 저장소의 로컬 명령으로만 실행한다.

---

## 5. QUALITY POLICY

BLOCK. 통과로 처리하지 않는다.

- invalid JSON
- schema failure
- protected SEO contamination. slug, URL, title, canonical이 baseline과 다름
- foreign brand / domain contamination
- severe duplication 또는 exact duplicate body / intro
- build failure

WARN. 기록만 하고, WARN만으로 전체 재생성하지 않는다.

- modest length variance
- minor repetition
- stylistic imperfections

짧은 본문이나 가벼운 반복이 WARN이면 그 사유만으로 pilot과 나머지 성공 파일을 다시 생성하지 않는다. BLOCK이 나온 실패 건만 고친다.

---

## 6. UI REFERENCE

참고를 구분한다.

- Rent-Pick: 원래 디자인과 레이아웃 참고
- Royal 완료 구현: legacy renewal UI 구현 참고

재사용한다.

- `max-w-3xl` 본문, 헤더, 푸터 폭
- panel / card 섹션
- 반응형 레이아웃
- CTA 배치 구조
- Exit Popup 동작

복사하지 않는다.

- brand
- domain
- content
- SEO
- assets
- analytics

다른 사이트의 컴포넌트 파일을 그대로 붙이지 않는다. 그 사이트의 구조에 맞게 구현한다. 기존 이미지와 검증 파일을 다른 프로젝트 asset으로 바꾸지 않는다. 참조되지 않은 기존 asset은 renewal 과정에서 삭제하지 않는다.

---

## 7. ARTICLE CTA STANDARD

상세 본문 CTA는 3개다.

- `article-top`. 글 헤더 다음
- `article-middle`
- `article-bottom`. FAQ 다음, 관련 글 앞

middle:

- sections가 3개 미만이면 middle을 넣지 않는다
- sections가 3개 이상이면 `floor(sectionCount / 2) - 1` 섹션 다음에 둔다
- FAQ 한가운데나 문장 한가운데에 넣지 않는다

CTA label과 target URL은 그 사이트 감사에서 확인한 CTA source를 쓴다. 다른 사이트의 target을 기본값으로 복사하지 않는다. 감사 전에 target을 다른 프로젝트 값으로 바꾸지 않는다.

---

## 8. GLOBAL CTA STANDARD

분기 기준은 768px이다. 데스크톱용과 모바일용 하단 CTA는 동시에 보이지 않는다.

DESKTOP, viewport가 768px보다 큼:

- 하단 floating CTA
- Exit Popup
- 트리거: 포인터가 화면 위쪽(`clientY < 10`)으로 나갈 때
- 들어오자마자 열지 않는다
- 세션당 한 번
- 팝업이 열린 동안 floating CTA를 숨기고, 닫으면 다시 보여 준다

MOBILE, viewport 768px 이하:

- 하단 fixed CTA
- Exit Popup
- 진입 즉시 열지 않는다
- 사용자가 페이지를 본 뒤, 스크롤이 멈추고 1.6초가 지나면 연다
- 세션당 한 번
- 팝업이 열린 동안 fixed CTA를 숨기고, 닫으면 다시 보여 준다
- 팝업은 뷰포트 안에 있고, 닫기 버튼이 가려지지 않는다

sessionStorage key는 그 사이트 브랜드에 맞는 고유 값이다. 다른 사이트의 key를 복사하지 않는다.

데스크톱 Exit Popup과 모바일 Exit Popup이 둘 다 있어야 이 기준을 통과한다.

---

## 9. DATE / FRESHNESS POLICY

이 정책은 이후 legacy renewal의 필수 기준이다. STEP 1 READ-ONLY AUDIT에서 날짜를 먼저 기록한다. 다른 사이트의 날짜 값을 가져오지 않는다.

감사에서 구분한다.

- 화면에 보이는 작성일, 업데이트일, 그 source
- JSON-LD `datePublished`, `dateModified`, 그 source
- sitemap `lastModified`가 콘텐츠, 홈, 허브, 정적/신뢰 페이지에서 각각 무엇인지
- `new Date()`, `Date.now()`, build time, runtime current date가 날짜를 바꾸는지

이후 수정 단계의 원칙:

- 본문이나 페이지를 substantive하게 수정하면 update date도 함께 갱신한다
- `datePublished`는 기존 최초 발행일을 보존한다
- `dateModified`는 실제 마지막 substantive update 날짜다
- 사용자에게 보이는 업데이트 날짜와 JSON-LD `dateModified`를 일치시킨다
- sitemap `lastModified`는 실제 수정 사실을 반영한다
- 수정하지 않은 페이지의 날짜를 임의로 최신 날짜로 바꾸지 않는다
- build-time `new Date()`로 매 빌드마다 모든 URL의 수정일을 바꾸지 않는다
- 홈, 허브, UI를 실제로 수정했다면 그 URL의 `lastModified`는 갱신할 수 있다
- URL, slug, title, canonical 보호와 freshness 갱신은 별개의 정책이다. 본문을 고친다고 slug나 title을 바꾸지 않는다. 날짜를 맞춘다고 URL을 바꾸지 않는다

---

## 10. ANALYTICS POLICY

legacy renewal에서 새로 넣지 않는다.

- GA4
- Measurement ID
- `gtag`
- CTA click tracking

그 사이트에 analytics, 광고 태그, `ads.txt`, 웹마스터 검증 파일, IndexNow 파일이 이미 있으면 감사 후 임의로 제거하거나 다른 사이트 값으로 바꾸지 않는다. 새 GA4를 추가하지 않는 정책이지, 기존 태그를 무단 삭제하는 정책이 아니다.

---

## 11. FINAL VALIDATION

push 전에 아래가 PASS여야 한다.

- protected SEO verification. count, slug, URL, 최종 title, canonical
- content count = protected count
- editorial count = protected count
- fallback = 0
- orphan = 0
- contamination = 0
- BLOCK = 0
- article CTA 3위치와 middle 조건
- CTA target이 그 사이트 감사 결과와 같음
- desktop floating CTA와 Exit Popup
- mobile fixed CTA와 Exit Popup
- 768px에서 두 하단 CTA가 동시에 보이지 않음
- 팝업이 열리면 해당 하단 CTA가 숨고, 닫으면 복구됨
- sessionStorage key가 그 사이트 고유 값임
- date / freshness. 보이는 업데이트 날짜, JSON-LD `dateModified`, 수정한 URL의 sitemap `lastModified`가 같은 수정 사실을 가리킴. 수정하지 않은 URL이 빌드 시각으로 갱신되지 않음
- `npx tsc --noEmit`
- production build
- 그 사이트의 CODEMAP이 최종 구현과 일치
- Git status에서 의도한 파일만 변경됨

WARN은 기록한다. WARN만 있으면 전체를 다시 생성하지 않는다.

---

## 12. GIT

저장소마다 따로 처리한다.

- 다른 프로젝트 저장소는 수정하지 않는다
- build, SEO, content, UI, CTA, date, CODEMAP 동기화가 PASS된 뒤에만 그 저장소만 commit하고 push한다
- `.env.local`과 API key는 commit하지 않는다
- force push, reset, clean은 별도 명시 요청 없이 하지 않는다

---

## 13. SITE-SPECIFIC EXCLUSIONS

다음을 이 파일의 source of truth처럼 쓰지 않는다. 문서에 예시로 남아 있어도 다음 프로젝트의 값이 아니다.

- 과거 사이트의 protected count
- 특정 사이트 domain
- 특정 사이트 brand
- 특정 사이트 slug 목록
- 특정 사이트 title
- 특정 사이트 canonical
- 특정 사이트 hub 이름과 배정 수
- 특정 사이트 본문
- 특정 사이트 이미지와 광고 ID
- 특정 sessionStorage key
- 특정 CTA URL을 모든 사이트의 기본 target으로 쓰는 것
- 특정 `datePublished` / `dateModified` 날짜를 모든 사이트에 복사하는 것

각 사이트의 값은 그 repository 감사 결과가 결정한다.
