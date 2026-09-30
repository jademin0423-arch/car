const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const EXPECTED_COUNT = 181;

function readText(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function readDomain() {
  const src = readText("lib/site.ts");
  const match = src.match(/domain:\s*"([^"]+)"/);
  if (!match) {
    throw new Error("SITE.domain not found in lib/site.ts");
  }
  return match[1].replace(/\/$/, "");
}

function readTitleSuffix() {
  const src = readText("app/layout.tsx");
  const match = src.match(/template:\s*"%s \| ([^"]+)"/);
  if (!match) {
    throw new Error('title.template "%s | ..." not found in app/layout.tsx');
  }
  return match[1];
}

function storedTitle(item) {
  if (typeof item.pageTitle === "string" && item.pageTitle.trim()) {
    return item.pageTitle;
  }
  const keyword = item.keyword || "장기렌트카";
  return `${keyword} 장기렌트 안내`;
}

function computeProtectedRecords() {
  const keywords = JSON.parse(readText("data/keywords.json"));
  const domain = readDomain();
  const suffix = readTitleSuffix();
  return keywords.map((item) => {
    const url = `${domain}/${item.slug}`;
    return {
      slug: item.slug,
      finalUrl: url,
      finalBrowserTitle: `${storedTitle(item)} | ${suffix}`,
      canonical: url
    };
  });
}

function countEditorial(records) {
  const dir = path.join(ROOT, "data", "content");
  const protectedSlugs = new Set(records.map((record) => record.slug));
  const names = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const slugs = names
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.slice(0, -".json".length));
  const editorial = slugs.filter((slug) => protectedSlugs.has(slug));
  const orphan = slugs.filter((slug) => !protectedSlugs.has(slug));
  return {
    editorial: editorial.length,
    orphan: orphan.length,
    fallback: records.length - editorial.length
  };
}

module.exports = {
  ROOT,
  EXPECTED_COUNT,
  computeProtectedRecords,
  countEditorial,
  readDomain,
  readTitleSuffix
};
