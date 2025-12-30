// 사용자 제공 키워드와 pageTitle을 keywords.json으로 변환하는 스크립트
const fs = require('fs');
const path = require('path');

// 키워드 → slug 변환 함수
function toSlug(keyword) {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/장기렌트/g, 'longterm-rent')
    .replace(/아우디/g, 'audi')
    .replace(/벤츠/g, 'benz')
    .replace(/bmw/g, 'bmw')
    .replace(/볼보/g, 'volvo')
    .replace(/캐딜락/g, 'cadillac')
    .replace(/포드/g, 'ford')
    .replace(/제네시스/g, 'genesis')
    .replace(/현대/g, 'hyundai')
    .replace(/기아/g, 'kia')
    .replace(/kg모빌리티/g, 'kg-mobility')
    .replace(/렉서스/g, 'lexus')
    .replace(/토요타/g, 'toyota')
    .replace(/혼다/g, 'honda')
    .replace(/폭스바겐/g, 'volkswagen')
    .replace(/포르쉐/g, 'porsche')
    .replace(/르노코리아/g, 'renault-korea')
    .replace(/랜드로버/g, 'land-rover')
    .replace(/마세라티/g, 'maserati')
    .replace(/푸조/g, 'peugeot')
    .replace(/링컨/g, 'lincoln')
    .replace(/지프/g, 'jeep')
    .replace(/미니/g, 'mini')
    .replace(/벤틀리/g, 'bentley')
    .replace(/쉐보레/g, 'chevrolet')
    .trim();
}

// 키워드에서 hubSlug 결정
function getHubSlug(keyword) {
  if (keyword.includes('아우디') || keyword.includes('벤츠') || keyword.includes('BMW') || 
      keyword.includes('볼보') || keyword.includes('캐딜락') || keyword.includes('포드') ||
      keyword.includes('렉서스') || keyword.includes('토요타') || keyword.includes('혼다') ||
      keyword.includes('폭스바겐') || keyword.includes('포르쉐') || keyword.includes('르노코리아') ||
      keyword.includes('랜드로버') || keyword.includes('마세라티') || keyword.includes('푸조') ||
      keyword.includes('링컨') || keyword.includes('지프') || keyword.includes('미니') ||
      keyword.includes('벤틀리') || keyword.includes('쉐보레')) {
    return 'brand-import';
  }
  if (keyword.includes('현대') || keyword.includes('기아') || keyword.includes('제네시스') ||
      keyword.includes('KG모빌리티') || keyword.includes('르노코리아')) {
    return 'brand-domestic';
  }
  if (keyword.includes('SUV') || keyword.includes('세단') || keyword.includes('경차') ||
      keyword.includes('전기차') || keyword.includes('하이브리드') || keyword.includes('승합') ||
      keyword.includes('9인승') || keyword.includes('밴')) {
    return 'car-type';
  }
  if (keyword.includes('무보증') || keyword.includes('초기비용') || keyword.includes('LPG') ||
      keyword.includes('즉시출고') || keyword.includes('재렌트')) {
    return 'condition-type';
  }
  if (keyword.includes('개인') || keyword.includes('법인') || keyword.includes('사업자') ||
      keyword.includes('저신용') || keyword.includes('사회초년생')) {
    return 'customer-type';
  }
  if (keyword.includes('가격비교') || keyword.includes('견적') || keyword.includes('가격')) {
    return 'price-compare';
  }
  if (keyword.includes('장단점') || keyword.includes('번호판') || keyword.includes('보험') ||
      keyword.includes('리스') || keyword.includes('후기') || keyword.includes('가이드')) {
    return 'guide-review';
  }
  return 'guide-review'; // 기본값
}

// type 결정
function getType(keyword, pageTitle) {
  if (keyword.includes('장기렌트카 가격비교') || keyword.includes('가격비교 사이트')) {
    return 'platform';
  }
  if (keyword.includes('장단점') || keyword.includes('가이드') || keyword.includes('비교')) {
    return 'guide';
  }
  if (keyword.includes('롯데') || keyword.includes('AJ렌터카') || keyword.includes('현대캐피탈') ||
      keyword.includes('삼성카드') || keyword.includes('하나캐피탈') || keyword.includes('아마존카') ||
      keyword.includes('오릭스')) {
    return 'platform';
  }
  return 'detail';
}

// 사용자 제공 데이터 (실제 데이터는 매우 길어서 일부만 예시)
const keywordData = [
  // 여기에 사용자 제공 키워드와 pageTitle을 모두 추가해야 함
];

// JSON 변환
const keywords = keywordData.map(item => ({
  slug: toSlug(item.keyword),
  keyword: item.keyword,
  pageTitle: item.pageTitle,
  type: getType(item.keyword, item.pageTitle),
  hubSlug: getHubSlug(item.keyword),
  isFeatured: false
}));

// 파일 저장
const outputPath = path.join(__dirname, '../data/keywords.json');
fs.writeFileSync(outputPath, JSON.stringify(keywords, null, 2), 'utf8');
console.log(`Generated ${keywords.length} keywords in ${outputPath}`);

