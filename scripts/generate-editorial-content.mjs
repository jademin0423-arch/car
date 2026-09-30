import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = process.cwd();
const MODEL = "gpt-4o-mini";
const CONTENT_DIR = path.join(ROOT, "data", "content");
const MAX_ATTEMPTS = 3;
const MISSING_CONCURRENCY = 3;
const USAGE_LOG = path.join(process.env.TEMP || process.env.TMP || ROOT, "allcar-step4-usage.jsonl");
const PILOT_HASHES = {
  "audi-a3-longterm-rent": "d836835d95b45c275365f0356c3ebc765d3e1ad87657b48e0cb74f91a660e732",
  "no-deposit-longterm-rent": "8a06b63abb2ffd7277de1b75db3a49f3254e5c04a33b2138fba8ee271590153e",
  "longterm-rent-license-plate-insurance": "3ed0551dd798edd9c208690be819834f0e1f576a3b3d469fff01400edb5e1764",
  "longterm-rent-car-price-compare": "b8b72c82d245d619b76ee9902e3cb1940e2562d9d64a656f462a45f9023c31f2",
  "corporate-longterm-rent": "d990209e93d1a87372ccac3472f5ce9bf4c7e20d9d66964db81ba47b2fcad84a"
};

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
  assertNoFabrication(slug, plain);
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

function assertNoFabrication(slug, plain) {
  const rules = [
    [/월\s*\d[\d,]*\s*만\s*원/, "specific monthly price"],
    [/\d[\d,]*\s*원\s*(할인|특가)/, "specific discount"],
    [/최저가(입니다|로 확정|가 확정)/, "confirmed lowest price"],
    [/즉시\s*출고\s*(가능합니다|됩니다|보장|확정)/, "confirmed immediate delivery"],
    [/재고가\s*있습니다/, "confirmed inventory"],
    [/무조건\s*(승인|무심사)|무심사(로|가)\s*(승인|가능|보장)/, "guaranteed approval"],
    [/보증금\s*0\s*원입니다|초기비용\s*0\s*원입니다|초기\s*비용(이|은)\s*없습니다|보증금이\s*없습니다|지불하지\s*않고|비용이\s*없으므로|비용\s*없이도/, "confirmed zero deposit"],
    [/모든\s*(업체|계약).{0,24}(동일|포함되어)/, "universal contract terms"],
    [/포함되어\s*있어|정비가\s*포함되어\s*있|보험이\s*포함되어\s*있/, "included coverage as fact"],
    [/비용처리(가|은)\s*(가능합니다|됩니다|확정)|세금(을|이)\s*절감/, "confirmed tax result"],
    [/가장\s*인기|판매량?\s*1위|시장\s*점유|대표적인\s*선택|상대적으로\s*저렴/, "unsupported market claim"],
    [/연비\s*[\d.]+|\d+(\.\d+)?\s*km\/?l|\d+\s*마력/i, "unsupported specification"]
  ];
  const sentences = plain.split(/(?<=[.!?요])\s+|\n+/);
  for (const sentence of sentences) {
    if (/수\s*있|달라|다릅|단정|확인|아닙니다|않을|없을\s*수|보장하지|포함되지\s*않|계약마다|경우에 따라/.test(sentence)) continue;
    for (const [pattern, reason] of rules) {
      const match = sentence.match(pattern);
      if (match) throw new Error(`factual block: ${reason} :: ${match[0]}`);
    }
  }
  for (const sentence of sentences) {
    if (/아니|단정하지|않을\s*수|보장하지|확인해야|확인하/.test(sentence)) continue;
    if (/포함되어\s*있어|저렴합니다|상대적으로\s*저렴하|인기\s*있는|대표적인|무심사\s*승인|무심사로\s*진행/.test(sentence)) {
      throw new Error("factual block: unsupported absolute claim");
    }
  }
  if (slug !== "longterm-rent-license-plate-insurance" && /하\s*번호판|허\s*번호판|호\s*번호판|개인 소유|임대차 전용/.test(plain)) {
    throw new Error("factual block: plate symbol expansion");
  }
  if (slug === "no-initial-cost-longterm-rent") {
    const match = plain.match(/지불하지\s*않고|필요\s*없다는|부담\s*없음|비용\s*없이|포함되어|초기\s*자본이\s*필요/);
    if (match) throw new Error(`factual block: confirmed zero deposit :: ${match[0]}`);
  }
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
            "다른 페이지와 같은 문장 뼈대, 같은 소제목, 같은 FAQ를 쓰지 말고 이 검색 의도에만 답한다.",
            "인기 순위, 판매량, 시장점유율, 연비 수치, 제원, 트림 가격, 출고 기간을 만들지 않는다.",
            "번호판 문자별 법적 용도나 규정 예외를 만들지 않는다.",
            "제목의 최저가, 특가, 즉시출고, 프로모션, 보조금은 사실로 쓰지 않는다. 같은 조건의 견적을 비교해야 확인할 수 있는 주제로 푼다.",
            "세금, 비용처리, 보험, 정비는 계약과 전문가 확인에 따라 달라질 수 있다고만 쓴다."
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
            instruction: brief.instruction,
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
  if (fs.existsSync(target)) throw new Error(`refusing to overwrite ${slug}`);
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

function fileHash(slug) {
  const file = path.join(CONTENT_DIR, `${slug}.json`);
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function assertPilotHashes() {
  for (const [slug, expected] of Object.entries(PILOT_HASHES)) {
    const actual = fileHash(slug);
    if (actual !== expected) {
      throw new Error(`pilot hash mismatch ${slug}`);
    }
  }
}

function intentFor(item) {
  if (item.slug === "no-initial-cost-longterm-rent") {
    return {
      intent: "condition",
      instruction:
        "첫 문단은 반드시 이 문장으로 시작하라: 장기렌트 광고의 초기비용 없음은 선납금과 보증금이 견적에서 빠졌다는 뜻이 아닙니다. 이어서 견적서의 선납금, 보증금, 탁송비, 인수금 칸을 따로 읽는 순서를 설명하라. 보험과 정비는 상품에 따라 빠질 수 있다고만 써라. 금지 표현: 지불하지 않고, 필요 없다, 부담 없음, 비용 없이, 만으로, 포함되어, 초기 자본, 경제적. 영어 단어를 넣지 마라."
    };
  }
  const text = `${item.keyword} ${item.pageTitle}`;
  if (item.hubSlug === "customer-type" || /개인|법인|사업자|저신용|초년생/.test(text)) {
    return {
      intent: "customer",
      instruction: "이 이용자 유형이 계약 전에 무엇을 비교하고 어디에 확인을 맡겨야 하는지 쓴다. 세무·승인 결과를 단정하지 않는다."
    };
  }
  if (item.type === "platform" || /가격비교|견적|업체|캐피탈|렌터카/.test(text)) {
    return {
      intent: "platform-comparison",
      instruction: "여러 견적을 같은 차량, 기간, 거리, 보증, 보험, 정비 조건으로 비교하는 기준을 쓴다. 순위와 현재 가격은 만들지 않는다."
    };
  }
  if (item.hubSlug === "condition-type" || /무보증|초기비용|LPG|lpg|즉시|재렌트/.test(text)) {
    return {
      intent: "condition",
      instruction: "이 계약 조건이 무엇을 바꾸는지, 월 납입금과 총비용에 어떤 차이가 생길 수 있는지, 계약서에서 무엇을 확인해야 하는지 쓴다."
    };
  }
  if (item.hubSlug === "guide-review" || item.type === "guide") {
    return {
      intent: "guide-review",
      instruction: "제목이 묻는 질문에 직접 답한다. 규정과 비용은 계약마다 다르다는 범위 안에서 확인 순서를 설명한다."
    };
  }
  if (item.hubSlug === "car-type") {
    return {
      intent: "vehicle-type",
      instruction: "이 차종을 장기렌트로 고를 때 용도, 탑승, 주행거리, 유지 항목 중 무엇을 견적에서 비교해야 하는지 쓴다. 판매량과 제원은 만들지 않는다."
    };
  }
  return {
    intent: "vehicle-model",
    instruction: "이 차종을 장기렌트로 검토할 때 누구에게 맞는지, 어떤 계약 항목을 다른 차종 견적과 나란히 비교해야 하는지 쓴다. 가격, 인기, 출고, 제원을 사실처럼 쓰지 않는다."
  };
}

function appendUsage(entry) {
  fs.appendFileSync(USAGE_LOG, `${JSON.stringify(entry)}\n`, "utf8");
}

function readUsageLog() {
  if (!fs.existsSync(USAGE_LOG)) return [];
  return fs
    .readFileSync(USAGE_LOG, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateOne(apiKey, item, stats) {
  if (Object.prototype.hasOwnProperty.call(PILOT_HASHES, item.slug)) {
    throw new Error(`refusing to generate frozen pilot ${item.slug}`);
  }
  const target = path.join(CONTENT_DIR, `${item.slug}.json`);
  if (fs.existsSync(target)) {
    stats.skipped += 1;
    console.log(`SKIP existing ${item.slug}`);
    return;
  }
  const brief = intentFor(item);
  let stored = false;
  let lastText = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS && !stored; attempt += 1) {
    try {
      const result = await requestContent(apiKey, item, brief);
      const part = {
        slug: item.slug,
        attempt,
        prompt: result.usage.prompt_tokens || 0,
        completion: result.usage.completion_tokens || 0,
        total: result.usage.total_tokens || 0,
        saved: false
      };
      stats.responses += 1;
      stats.prompt += part.prompt;
      stats.completion += part.completion;
      stats.total += part.total;
      appendUsage(part);
      lastText = result.text;
      console.log(`USAGE_PART ${item.slug} prompt=${part.prompt} completion=${part.completion} total=${part.total}`);
      const parsed = validate(item.slug, normalizeContent(item.slug, JSON.parse(result.text)));
      saveAtomic(item.slug, parsed);
      part.saved = true;
      stats.saved += 1;
      stored = true;
      console.log(`SAVED ${item.slug} chars=${charCount(parsed)} attempt=${attempt} intent=${brief.intent}`);
    } catch (error) {
      stats.discarded += 1;
      if (attempt < MAX_ATTEMPTS) stats.retries += 1;
      const message = error instanceof Error ? error.message : "request failed";
      if (lastText) {
        fs.writeFileSync(path.join(process.env.TEMP || process.env.TMP || ".", `allcar-discard-${item.slug}.txt`), lastText, "utf8");
      }
      console.log(`DISCARD ${item.slug} attempt=${attempt} reason=${message}`);
      if (message.includes("429")) await sleep(15000);
      else if (message.includes("API status 5")) await sleep(4000);
    }
  }
  if (!stored) stats.failed.push(item.slug);
}

async function runPool(items, limit, worker) {
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const current = items[cursor];
      cursor += 1;
      await worker(current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => run()));
}

function exactGroups(records, pick) {
  const groups = new Map();
  for (const record of records) {
    const value = pick(record).replace(/\s+/g, "");
    if (!value) continue;
    const list = groups.get(value) || [];
    list.push(record.slug);
    groups.set(value, list);
  }
  return [...groups.values()].filter((slugs) => slugs.length > 1);
}

function duplicateTargets(groups) {
  const targets = new Set();
  for (const group of groups) {
    const unique = [...new Set(group)];
    if (unique.length < 2) continue;
    const replacements = unique.filter((slug) => !PILOT_HASHES[slug]);
    const keepFrozen = unique.some((slug) => PILOT_HASHES[slug]);
    const extras = keepFrozen ? replacements : replacements.slice(1);
    for (const slug of extras) targets.add(slug);
  }
  return targets;
}

async function retryDuplicates(apiKey, keywords, stats) {
  const records = keywords
    .map((item) => {
      const file = path.join(CONTENT_DIR, `${item.slug}.json`);
      if (!fs.existsSync(file)) return null;
      return { slug: item.slug, data: JSON.parse(fs.readFileSync(file, "utf8")) };
    })
    .filter(Boolean);
  const targets = duplicateTargets([
    ...exactGroups(records, (record) => collectText(record.data)),
    ...exactGroups(records, (record) => record.data.intro),
    ...exactGroups(records, (record) => record.data.conclusion)
  ]);
  const paragraphGroups = new Map();
  for (const record of records) {
    for (const section of record.data.sections || []) {
      for (const paragraph of section.paragraphs || []) {
        const key = paragraph.replace(/\s+/g, "");
        const list = paragraphGroups.get(key) || [];
        list.push(record.slug);
        paragraphGroups.set(key, list);
      }
    }
  }
  for (const slug of duplicateTargets([...paragraphGroups.values()].filter((slugs) => new Set(slugs).size > 1))) {
    targets.add(slug);
  }
  if (!targets.size) return;
  console.log(`DUPLICATE_RETRY ${[...targets].join(",")}`);
  const bySlug = new Map(keywords.map((item) => [item.slug, item]));
  for (const slug of targets) {
    if (PILOT_HASHES[slug]) continue;
    const file = path.join(CONTENT_DIR, `${slug}.json`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
    await generateOne(apiKey, bySlug.get(slug), stats);
  }
}

async function runMissing() {
  assertPilotHashes();
  const keywords = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "keywords.json"), "utf8"));
  const missing = keywords.filter((item) => !fs.existsSync(path.join(CONTENT_DIR, `${item.slug}.json`)));
  const existing = keywords.length - missing.length;
  console.log(`MISSING_ONLY existing=${existing} missing=${missing.length} frozen=${Object.keys(PILOT_HASHES).length}`);
  for (const slug of Object.keys(PILOT_HASHES)) {
    if (missing.some((item) => item.slug === slug)) {
      throw new Error(`frozen pilot is missing a file ${slug}`);
    }
  }
  const env = loadEnv();
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");
  const stats = {
    responses: 0,
    saved: 0,
    skipped: existing,
    retries: 0,
    discarded: 0,
    failed: [],
    prompt: 0,
    completion: 0,
    total: 0
  };
  await runPool(missing, MISSING_CONCURRENCY, (item) => generateOne(env.OPENAI_API_KEY, item, stats));
  if (stats.failed.length) {
    console.log(`RETRY_FAILED ${stats.failed.join(",")}`);
    const bySlug = new Map(keywords.map((item) => [item.slug, item]));
    const again = stats.failed.filter((slug) => !fs.existsSync(path.join(CONTENT_DIR, `${slug}.json`)));
    stats.failed = [];
    for (const slug of again) {
      if (PILOT_HASHES[slug]) continue;
      await generateOne(env.OPENAI_API_KEY, bySlug.get(slug), stats);
    }
  }
  await retryDuplicates(env.OPENAI_API_KEY, keywords, stats);
  assertPilotHashes();
  const log = readUsageLog();
  const prompt = log.reduce((sum, entry) => sum + (entry.prompt || 0), 0);
  const completion = log.reduce((sum, entry) => sum + (entry.completion || 0), 0);
  const total = log.reduce((sum, entry) => sum + (entry.total || 0), 0);
  console.log("USAGE");
  console.log(`model=${MODEL}`);
  console.log(`api_responses=${log.length}`);
  console.log(`successful_saved=${stats.saved}`);
  console.log(`skipped_existing=${existing}`);
  console.log(`retries=${stats.retries}`);
  console.log(`discarded=${stats.discarded}`);
  console.log(`failed=${stats.failed.join(",") || "none"}`);
  console.log(`prompt_tokens=${prompt}`);
  console.log(`completion_tokens=${completion}`);
  console.log(`total_tokens=${total}`);
  console.log("PILOT_HASHES_UNCHANGED");
  if (stats.failed.length) {
    throw new Error(`missing pages remain: ${stats.failed.join(",")}`);
  }
}

async function main() {
  if (process.argv.includes("--missing")) {
    await runMissing();
    return;
  }
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
