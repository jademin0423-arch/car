import fs from "fs";
import path from "path";

export interface EditorialSection {
  heading: string;
  paragraphs: string[];
}

export interface EditorialFaq {
  question: string;
  answer: string;
}

export interface EditorialContent {
  slug: string;
  intro: string;
  sections: EditorialSection[];
  checkpoints: string[];
  faq: EditorialFaq[];
  conclusion: string;
}

const ALLOWED_KEYS = ["slug", "intro", "sections", "checkpoints", "faq", "conclusion"] as const;
const FORBIDDEN_KEYS = ["title", "pageTitle", "canonical", "url", "CTA", "cta", "metadata", "h1", "H1"];

function fail(slug: string, message: string): never {
  throw new Error(`Invalid editorial content for ${slug}: ${message}`);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validate(slug: string, data: unknown): EditorialContent {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    fail(slug, "root value must be an object");
  }
  const record = data as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_KEYS.includes(key) || !ALLOWED_KEYS.includes(key as (typeof ALLOWED_KEYS)[number])) {
      fail(slug, `forbidden or unknown field "${key}"`);
    }
  }
  if (!isNonEmptyString(record.slug) || record.slug !== slug) {
    fail(slug, "slug must match the content filename");
  }
  if (!isNonEmptyString(record.intro)) fail(slug, "intro must be a non-empty string");
  if (!isNonEmptyString(record.conclusion)) fail(slug, "conclusion must be a non-empty string");
  if (!Array.isArray(record.sections) || record.sections.length === 0) {
    fail(slug, "sections must be a non-empty array");
  }
  const sections = record.sections.map((section, index) => {
    if (!section || typeof section !== "object" || Array.isArray(section)) {
      fail(slug, `sections[${index}] must be an object`);
    }
    const item = section as Record<string, unknown>;
    if (!isNonEmptyString(item.heading)) fail(slug, `sections[${index}].heading must be a non-empty string`);
    if (!Array.isArray(item.paragraphs) || item.paragraphs.length === 0) {
      fail(slug, `sections[${index}].paragraphs must be a non-empty array`);
    }
    const paragraphs = item.paragraphs.map((paragraph, paragraphIndex) => {
      if (!isNonEmptyString(paragraph)) {
        fail(slug, `sections[${index}].paragraphs[${paragraphIndex}] must be a non-empty string`);
      }
      return paragraph;
    });
    return { heading: item.heading, paragraphs };
  });
  if (!Array.isArray(record.checkpoints) || record.checkpoints.length === 0) {
    fail(slug, "checkpoints must be a non-empty array");
  }
  const checkpoints = record.checkpoints.map((checkpoint, index) => {
    if (!isNonEmptyString(checkpoint)) fail(slug, `checkpoints[${index}] must be a non-empty string`);
    return checkpoint;
  });
  if (!Array.isArray(record.faq) || record.faq.length === 0) {
    fail(slug, "faq must be a non-empty array");
  }
  const faq = record.faq.map((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      fail(slug, `faq[${index}] must be an object`);
    }
    const item = entry as Record<string, unknown>;
    if (!isNonEmptyString(item.question)) fail(slug, `faq[${index}].question must be a non-empty string`);
    if (!isNonEmptyString(item.answer)) fail(slug, `faq[${index}].answer must be a non-empty string`);
    return { question: item.question, answer: item.answer };
  });
  return {
    slug: record.slug,
    intro: record.intro,
    sections,
    checkpoints,
    faq,
    conclusion: record.conclusion
  };
}

export function getEditorialContent(slug: string): EditorialContent | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid editorial slug: ${slug}`);
  }
  const filePath = path.join(process.cwd(), "data", "content", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "JSON parse failed";
    fail(slug, message);
  }
  return validate(slug, parsed);
}
