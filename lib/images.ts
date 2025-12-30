export const HERO_IMAGE = {
  src: "/imge/main-hero/153830.png",
  alt: "장기렌트카를 처음 알아보는 사람을 위한 가격과 조건 비교 가이드 대표 이미지"
};

const IMAGE_FILES = [
  "Image_fx (1).png",
  "Image_fx (2).png",
  "Image_fx (3).png",
  "Image_fx (4).png",
  "Image_fx (5).png",
  "Image_fx (6).png",
  "Image_fx (7).png",
  "Image_fx (8).png",
  "Image_fx (9).png",
  "Image_fx (10).png",
  "Image_fx (11).png",
  "Image_fx (12).png",
  "Image_fx (13).png",
  "Image_fx (14).png",
  "Image_fx (15).png",
  "Image_fx (16).png",
  "Image_fx (17).png",
  "Image_fx (18).png",
  "Image_fx (19).png",
  "Image_fx (20).png",
  "Image_fx (21).png",
  "Image_fx (22).png",
  "Image_fx (23).png",
  "Image_fx (24).png",
  "Image_fx (25).png",
  "Image_fx (26).png",
  "Image_fx (27).png",
  "Image_fx (28).png",
  "Image_fx (29).png",
  "Image_fx (30).png",
  "Image_fx (31).png",
  "Image_fx (32).png",
  "Image_fx (33).png",
  "Image_fx (34).png",
  "Image_fx (35).png",
  "Image_fx (36).png",
  "Image_fx (37).png",
  "Image_fx (38).png",
  "Image_fx.png"
];

export const DETAIL_IMAGES: string[] = IMAGE_FILES.map((f) => `/imge/${f}`);

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getShuffledImagesForSlug(slug: string, count: number): string[] {
  const seed = simpleHash(slug) || 1;
  const arr = [...DETAIL_IMAGES];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(count, arr.length));
}

