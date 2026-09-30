import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = process.cwd();
const MODEL = "gpt-4o-mini";
const CONTENT_DIR = path.join(ROOT, "data", "content");
const MAX_ATTEMPTS = 3;

const PILOTS = [
  {
    slug: "audi-a3-longterm-rent",
    intent: "vehicle-model",
    reason:
      "수입 소형 세단 상세다. brand-import / detail. 제목의 최저가·특가는 보호 제목으로만 두고, 본문은 차종 선택 기준으로 쓴다."
  },
  {
    slug: "no-deposit-longterm-rent",
    intent: "price-condition",
    reason:
      "무보증·초기비용 조건이다. condition-type / guide. 0원·즉시 이용을 사실로 확정하지 않고 비용 구조와 총비용을 다룬다.",
    repair:
      "무보증을 초기비용 0원이라고 단정하지 마라. 선납금, 인수금, 보증금이 계약마다 다를 수 있고, 보증금을 낮추면 월 납입금이 올라갈 수 있다고 설명하라. '0원입니다', '초기 비용이 없습니다', '준비되어 있습니다', '즉시 이용'을 쓰지 마라."
  },
  {
    slug: "longterm-rent-license-plate-insurance",
    intent: "guide-review",
    reason:
      "번호판과 보험을 판단하는 가이드다. guide-review / guide. 혜택이 모든 계약에 같다고 쓰지 않는다.",
    repair:
      "이전 초안은 사실 오류로 거절되었다. 하, 허, 호는 렌트 차량 번호판의 용도 기호다. 일반 자가용 번호판의 가, 나, 다와 다르다는 점만 설명하라. 하를 개인 소유, 허를 상업용, 호를 임대차 전용으로 정의하지 마라. 번호판 종류만으로 주행 가능 지역이 정해진다고 쓰지 마라. 보험이 모든 계약에 포함된다고 단정하지 말고, 담보, 면책금, 운전자 범위는 계약서에서 확인한다고 써라."
  },
  {
    slug: "longterm-rent-car-price-compare",
    intent: "platform-comparison",
    reason:
      "업체 견적 비교다. price-compare / platform. 순위나 최신 가격 대신 같은 조건으로 견적을 보는 기준을 쓴다."
  },
  {
    slug: "corporate-longterm-rent",
    intent: "customer",
    reason:
      "법인 이용자의 의사결정이다. customer-type / guide. 세무·보험 결론을 절대값으로 쓰지 않는다.",
    repair:
      "이전 초안은 거절되었다. 세무 처리는 계약 형태와 전문가 확인에 따라 달라진다고만 써라. 정비나 보험이 포함되어 있다고 단정하지 마라. '경비로 처리', '세무 부담을 줄', '세무적 혜택', '상대적으로 저렴', '포함되어 있어'를 쓰지 마라. 본문은 공백 제외 1300자 안팎으로, 법인 차량의 이용 목적, 계약기간, 약정거리, 운전자 범위, 중도해지를 각각 설명하라."
  }
];

const ALLOWED_KEYS = ["slug", "intro", "sections", "checkpoints", "faq", "conclusion"];
const FORBIDDEN_KEYS = ["title", "pageTitle", "canonical", "url", "CTA", "cta", "metadata", "h1", "H1"];
const CONTAMINATION =
  /로얄카|royalcar\.co\.kr|지지렌터카|gggofmoney\.co\.kr|렌트픽|rent-pick\.kr|렌트코리아|rentcarkorea\.kr|코코렌트카|kokorent\.kr|replyalba|jadelink|https?:\/\//i;

function loadEnv() {
  const file = path.join(ROOT, ".env.local");
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return env;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asParagraphs(value) {
  if (Array.isArray(value)) return value.filter(isNonEmptyString);
  if (typeof value === "string" && value.trim()) {
    const blocks = value.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
    return blocks.length ? blocks : [value.trim()];
  }
  return value;
}

function asText(value) {
  if (Array.isArray(value)) return value.filter(isNonEmptyString).join("\n\n");
  return value;
}

function normalizeContent(slug, data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;
  const next = { ...data, slug };
  next.intro = asText(next.intro);
  next.conclusion = asText(next.conclusion);
  if (Array.isArray(next.sections)) {
    next.sections = next.sections.map((section) => {
      if (!section || typeof section !== "object") return section;
      return {
        heading: section.heading || section.title,
        paragraphs: asParagraphs(section.paragraphs || section.body || section.content)
      };
    });
  }
  if (Array.isArray(next.faq)) {
    next.faq = next.faq.map((entry) => {
      if (!entry || typeof entry !== "object") return entry;
      return {
        question: entry.question || entry.q,
        answer: entry.answer || entry.a
      };
    });
  }
  if (Array.isArray(next.checkpoints)) {
    next.checkpoints = next.checkpoints.map((item) => (typeof item === "string" ? item : item?.text || item?.item));
  }
  return next;
}

function validate(slug, data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("root value must be an object");
  }
  for (const key of Object.keys(data)) {
    if (FORBIDDEN_KEYS.includes(key) || !ALLOWED_KEYS.includes(key)) {
      throw new Error(`forbidden or unknown field ${key}`);
    }
  }
  if (data.slug !== slug) throw new Error("slug mismatch");
  if (!isNonEmptyString(data.intro)) throw new Error("intro missing");
  if (!isNonEmptyString(data.conclusion)) throw new Error("conclusion missing");
  const introBlocks = data.intro.split(/\n\s*\n/).filter((block) => block.trim());
  if (introBlocks.length < 2 || introBlocks.length > 4) {
    throw new Error(`intro paragraphs ${introBlocks.length}`);
  }
  if (!Array.isArray(data.sections) || data.sections.length < 3 || data.sections.length > 5) {
    throw new Error("sections must be 3 to 5");
  }
  for (const [index, section] of data.sections.entries()) {
    if (!section || typeof section !== "object") throw new Error(`sections[${index}] invalid`);
    if (!isNonEmptyString(section.heading)) {
      throw new Error(`sections[${index}].heading missing keys=${Object.keys(section).join(",")}`);
    }
    if (!Array.isArray(section.paragraphs) || section.paragraphs.length < 1 || section.paragraphs.length > 3) {
      throw new Error(`sections[${index}].paragraphs must be 1 to 3`);
    }
    if (section.paragraphs.some((paragraph) => !isNonEmptyString(paragraph))) {
      throw new Error(`sections[${index}] has an empty paragraph`);
    }
  }
  if (!Array.isArray(data.checkpoints) || data.checkpoints.length < 3 || data.checkpoints.length > 6) {
    throw new Error("checkpoints must be 3 to 6");
  }
  if (data.checkpoints.some((item) => !isNonEmptyString(item))) throw new Error("empty checkpoint");
  if (!Array.isArray(data.faq) || data.faq.length < 3 || data.faq.length > 5) {
    throw new Error("faq must be 3 to 5");
  }
  for (const [index, entry] of data.faq.entries()) {
    if (!isNonEmptyString(entry?.question) || !isNonEmptyString(entry?.answer)) {
      throw new Error(`faq[${index}] invalid`);
    }
  }
  const conclusionBlocks = data.conclusion.split(/\n\s*\n/).filter((block) => block.trim());
  if (conclusionBlocks.length < 1 || conclusionBlocks.length > 3) {
    throw new Error(`conclusion paragraphs ${conclusionBlocks.length}`);
  }
  const blob = JSON.stringify(data);
  if (CONTAMINATION.test(blob)) throw new Error("contamination or CTA URL");
  const plain = collectText(data);
  if (slug === "longterm-rent-license-plate-insurance") {
    if (!plain.includes("하") || !plain.includes("허") || !plain.includes("호")) {
      throw new Error("missing rental plate explanation");
    }
    const plateClaim = plain.match(/개인 소유|상업용|임대차 전용|주행 가능 지역|보험 가입이 필수|반드시 가입|가입해야 합니다|포함돼 있으며|포함되어 있으며/);
    if (plateClaim) {
      throw new Error(`incorrect plate or absolute insurance claim: ${plateClaim[0]}`);
    }
  }
  if (slug === "corporate-longterm-rent") {
    if (/경비로 처리|세무 부담을 줄|세무적 혜택|상대적으로 저렴|포함되어 있어|포함돼 있어/.test(plain)) {
      throw new Error("absolute tax or coverage claim");
    }
  }
  if (slug === "no-deposit-longterm-rent") {
    if (/0원입니다|초기 비용이 없습니다|즉시 이용/.test(plain)) {
      throw new Error("absolute zero-cost claim");
    }
  }
  return data;
}

function collectText(data) {
  return [
    data.intro,
    ...data.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...data.checkpoints,
    ...data.faq.flatMap((entry) => [entry.question, entry.answer]),
    data.conclusion
  ].join("\n");
}

function charCount(data) {
  return collectText(data).replace(/\s/g, "").length;
}

async function requestContent(apiKey, item, brief) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 3500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "당신은 한국어 장기렌트 정보 글을 쓴다.",
            "출력은 JSON 객체 하나만. 마크다운을 쓰지 않는다.",
            "허용 키만 사용한다: slug, intro, sections, checkpoints, faq, conclusion.",
            "sections 항목의 제목 키는 heading 이다. title 키를 쓰지 않는다.",
            "faq 항목 키는 question, answer 이다.",
            "금지 키: title, pageTitle, canonical, url, CTA, cta, metadata, h1.",
            '예시 형태: {"slug":"example","intro":"첫째 문단\\n\\n둘째 문단","sections":[{"heading":"소제목","paragraphs":["설명"]}],"checkpoints":["항목"],"faq":[{"question":"질문","answer":"답"}],"conclusion":"마무리"}',
            "intro와 conclusion은 문단을 빈 줄(\\n\\n)로 구분한 문자열이다.",
            "intro는 2~4문단, sections는 3~5개, 각 section paragraphs는 1~3개, checkpoints는 3~6개, faq는 3~5개, conclusion은 1~3문단.",
            "분량은 공백 제외 약 1300~2000자. 분량을 맞추려고 같은 말을 반복하지 않는다.",
            "가격, 할인액, 재고, 즉시출고, 승인, 무심사, 보조금, 보험 포함, 정비 포함, 주행거리 한도를 사실처럼 단정하지 않는다.",
            "월 납입금과 조건은 차량, 계약기간, 약정거리, 보증금, 보험, 정비, 옵션, 업체, 시점에 따라 달라진다고 자연스럽게 쓴다.",
            "오늘의 가격, 현재 재고, 실시간 가격, 2026년 최저가, 현재 프로모션을 만들지 않는다.",
            "상담, 견적 신청, 무료 상담, URL, 브랜드 도메인을 넣지 않는다.",
            "다른 페이지와 같은 문장 뼈대를 쓰지 말고 이 검색 의도에만 답한다."
          ].join("\n")
        },
        {
          role: "user",
          content: JSON.stringify({
            slug: item.slug,
            keyword: item.keyword,
            pageTitle: item.pageTitle,
            type: item.type,
            hubSlug: item.hubSlug,
            intent: brief.intent,
            instruction: brief.reason,
            note: "pageTitle의 홍보 표현은 본문에서 사실로 확인된 내용처럼 쓰지 않는다. slug 값은 입력과 같아야 한다.",
            repair: brief.repair || ""
          })
        }
      ]
    })
  });
  const payload = await response.json();
  if (!response.ok) {
    const status = response.status;
    throw new Error(`API status ${status}`);
  }
  const text = payload.choices?.[0]?.message?.content;
  if (!text) throw new Error("empty completion");
  return {
    text,
    usage: payload.usage || {}
  };
}

function saveAtomic(slug, data) {
  const target = path.join(CONTENT_DIR, `${slug}.json`);
  const temp = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  fs.renameSync(temp, target);
}

function printSelection() {
  console.log("PILOT SELECTION");
  for (const pilot of PILOTS) {
    console.log(`- ${pilot.slug} | ${pilot.intent} | ${pilot.reason}`);
  }
}

async function main() {
  printSelection();
  const keywords = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "keywords.json"), "utf8"));
  const bySlug = new Map(keywords.map((item) => [item.slug, item]));
  for (const pilot of PILOTS) {
    if (!bySlug.has(pilot.slug)) {
      throw new Error(`selected slug is not in keywords.json: ${pilot.slug}`);
    }
  }
  const env = loadEnv();
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const usage = { prompt: 0, completion: 0, total: 0 };
  let success = 0;
  let retries = 0;
  let discarded = 0;
  const saved = [];

  for (const pilot of PILOTS) {
    const target = path.join(CONTENT_DIR, `${pilot.slug}.json`);
    if (fs.existsSync(target)) {
      console.log(`SKIP existing ${pilot.slug}`);
      saved.push(pilot.slug);
      continue;
    }
    const item = bySlug.get(pilot.slug);
    let stored = false;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS && !stored; attempt += 1) {
      try {
        const result = await requestContent(env.OPENAI_API_KEY, item, pilot);
        usage.prompt += result.usage.prompt_tokens || 0;
        usage.completion += result.usage.completion_tokens || 0;
        usage.total += result.usage.total_tokens || 0;
        console.log(
          `USAGE_PART prompt=${result.usage.prompt_tokens || 0} completion=${result.usage.completion_tokens || 0} total=${result.usage.total_tokens || 0}`
        );
        const parsed = validate(pilot.slug, normalizeContent(pilot.slug, JSON.parse(result.text)));
        saveAtomic(pilot.slug, parsed);
        success += 1;
        stored = true;
        console.log(`SAVED ${pilot.slug} chars=${charCount(parsed)} attempt=${attempt}`);
      } catch (error) {
        discarded += 1;
        if (attempt < MAX_ATTEMPTS) retries += 1;
        const message = error instanceof Error ? error.message : "request failed";
        console.log(`DISCARD ${pilot.slug} attempt=${attempt} reason=${message}`);
      }
    }
    if (!stored) {
      console.log(`PARTIAL prompt_tokens=${usage.prompt} completion_tokens=${usage.completion} total_tokens=${usage.total}`);
      throw new Error(`failed to save ${pilot.slug}`);
    }
  }

  console.log("USAGE");
  console.log(`model=${MODEL}`);
  console.log(`successful_responses=${success}`);
  console.log(`retries=${retries}`);
  console.log(`discarded=${discarded}`);
  console.log(`prompt_tokens=${usage.prompt}`);
  console.log(`completion_tokens=${usage.completion}`);
  console.log(`total_tokens=${usage.total}`);
  for (const pilot of PILOTS) {
    const file = path.join(CONTENT_DIR, `${pilot.slug}.json`);
    const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    console.log(`SHA256 ${pilot.slug} ${hash}`);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "generation failed";
  console.error(`ERROR ${message}`);
  process.exit(1);
});
