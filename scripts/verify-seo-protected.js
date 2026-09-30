const fs = require("fs");
const path = require("path");
const {
  ROOT,
  EXPECTED_COUNT,
  computeProtectedRecords,
  countEditorial,
  readTitleSuffix
} = require("./seo-protected-rules");

function duplicates(values) {
  const seen = new Map();
  const dupes = [];
  for (const value of values) {
    seen.set(value, (seen.get(value) || 0) + 1);
  }
  for (const [value, count] of seen) {
    if (count > 1) dupes.push({ value, count });
  }
  return dupes;
}

function fail(errors) {
  for (const error of errors) {
    console.error(`FAIL ${error}`);
  }
  console.error("RESULT = FAIL");
  process.exit(1);
}

function assertSeoSourcesDoNotReadEditorial(errors) {
  const pageSrc = fs.readFileSync(path.join(ROOT, "app", "[slug]", "page.tsx"), "utf8");
  const metaStart = pageSrc.indexOf("export function generateMetadata");
  const pageStart = pageSrc.indexOf("export default function Page");
  if (metaStart === -1 || pageStart === -1 || pageStart < metaStart) {
    errors.push("detail page metadata function was not found");
    return;
  }
  const metaSrc = pageSrc.slice(metaStart, pageStart);
  if (metaSrc.includes("getEditorialContent") || metaSrc.includes("data/content")) {
    errors.push("generateMetadata reads editorial content");
  }
  for (const rel of ["lib/seo.ts", "lib/jsonld.ts", "app/layout.tsx"]) {
    const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
    if (src.includes("getEditorialContent") || src.includes("data/content")) {
      errors.push(`${rel} reads editorial content`);
    }
  }
}

function main() {
  const errors = [];
  const current = computeProtectedRecords();
  const baselinePath = path.join(ROOT, "data", "seo-protected-baseline.json");
  const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  const counts = countEditorial(current);
  let missingCount = 0;
  let unexpectedCount = 0;

  if (!Array.isArray(baseline)) {
    fail(["baseline is not an array"]);
  }
  if (baseline.length !== EXPECTED_COUNT) {
    errors.push(`baseline count = ${baseline.length}, expected ${EXPECTED_COUNT}`);
  }
  if (current.length !== EXPECTED_COUNT) {
    errors.push(`current routable count = ${current.length}, expected ${EXPECTED_COUNT}`);
  }

  const baselineBySlug = new Map();
  for (const record of baseline) {
    if (!record || typeof record.slug !== "string") {
      errors.push("baseline record missing slug");
      continue;
    }
    if (baselineBySlug.has(record.slug)) {
      errors.push(`duplicate baseline slug ${record.slug}`);
    }
    baselineBySlug.set(record.slug, record);
    for (const field of ["finalUrl", "finalBrowserTitle", "canonical"]) {
      if (typeof record[field] !== "string" || !record[field]) {
        errors.push(`baseline ${record.slug} missing ${field}`);
      }
    }
    if (typeof record.finalUrl === "string" && record.finalUrl.endsWith("/")) {
      errors.push(`baseline URL has trailing slash ${record.finalUrl}`);
    }
    if (typeof record.canonical === "string" && record.canonical.endsWith("/")) {
      errors.push(`baseline canonical has trailing slash ${record.canonical}`);
    }
  }

  const currentBySlug = new Map();
  for (const record of current) {
    if (currentBySlug.has(record.slug)) {
      errors.push(`duplicate current slug ${record.slug}`);
    }
    currentBySlug.set(record.slug, record);
    if (!baselineBySlug.has(record.slug)) {
      unexpectedCount += 1;
      errors.push(`unexpected replacement slug ${record.slug}`);
    }
  }

  for (const [slug, locked] of baselineBySlug) {
    const live = currentBySlug.get(slug);
    if (!live) {
      missingCount += 1;
      errors.push(`missing protected slug ${slug}`);
      continue;
    }
    if (live.finalUrl !== locked.finalUrl) {
      errors.push(`final URL mismatch ${slug}: ${live.finalUrl} !== ${locked.finalUrl}`);
    }
    if (live.finalBrowserTitle !== locked.finalBrowserTitle) {
      errors.push(`final browser title mismatch ${slug}`);
    }
    if (live.canonical !== locked.canonical) {
      errors.push(`canonical mismatch ${slug}: ${live.canonical} !== ${locked.canonical}`);
    }
    if (live.finalUrl !== live.canonical) {
      errors.push(`URL and canonical differ ${slug}`);
    }
  }

  const slugDupes = duplicates(current.map((record) => record.slug));
  const titleDupes = duplicates(current.map((record) => record.finalBrowserTitle));
  const canonicalDupes = duplicates(current.map((record) => record.canonical));
  if (slugDupes.length) errors.push(`duplicate slug = ${slugDupes.length}`);
  if (titleDupes.length) errors.push(`duplicate final title = ${titleDupes.length}`);
  if (canonicalDupes.length) errors.push(`duplicate canonical = ${canonicalDupes.length}`);
  if (counts.orphan !== 0) errors.push(`orphan editorial = ${counts.orphan}`);

  const suffix = readTitleSuffix();
  if (suffix !== "장기렌트카 가이드") {
    errors.push(`title suffix changed: ${suffix}`);
  }

  assertSeoSourcesDoNotReadEditorial(errors);

  const protectedCount = current.length;
  console.log(`PROTECTED = ${protectedCount}`);
  console.log(`SLUGS = ${protectedCount}`);
  console.log(`TITLES = ${protectedCount}`);
  console.log(`CANONICALS = ${protectedCount}`);
  console.log(`EDITORIAL = ${counts.editorial}`);
  console.log(`FALLBACK = ${counts.fallback}`);
  console.log(`DUPLICATE SLUG = ${slugDupes.length}`);
  console.log(`DUPLICATE FINAL TITLE = ${titleDupes.length}`);
  console.log(`DUPLICATE CANONICAL = ${canonicalDupes.length}`);
  console.log(`MISSING PROTECTED = ${missingCount}`);
  console.log(`UNEXPECTED REPLACEMENT = ${unexpectedCount}`);

  if (errors.length) fail(errors);
  console.log("RESULT = PASS");
}

main();
