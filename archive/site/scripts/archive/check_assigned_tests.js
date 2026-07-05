const fs = require('fs');
const path = require('path');

const files = [
  "site/app/(site)/error.tsx",
  "site/app/(site)/loading.tsx",
  "site/app/(site)/not-found.tsx",
  "site/app/(site)/opengraph-image.tsx",
  "site/app/(site)/robots.ts",
  "site/app/(site)/sitemap.ts",
  "site/app/(site)/twitter-image.tsx",
  "site/app/(site)/about/page.tsx",
  "site/app/(site)/access/AccessForm.tsx",
  "site/app/(site)/access/page.tsx",
  "site/app/(site)/backend-architecture/page.tsx",
  "site/app/(site)/brochure/page.tsx",
  "site/app/(site)/career/page.tsx",
  "site/app/(site)/catalog/page.tsx",
  "site/app/(site)/choose-product/page.tsx",
  "site/app/(site)/compare/page.tsx",
  "site/app/(site)/contact/page.tsx",
  "site/app/(site)/dashboard/DashboardClient.tsx",
  "site/app/(site)/dashboard/page.tsx",
  "site/app/(site)/download-brochure/page.tsx",
  "site/app/(site)/downloads/page.tsx",
  "site/app/(site)/gallery/page.tsx",
  "site/app/(site)/imprint/page.tsx",
  "site/app/(site)/login/LoginForm.tsx",
  "site/app/(site)/login/page.tsx",
  "site/app/(site)/news/page.tsx",
  "site/app/(site)/planning/page.tsx",
  "site/app/(site)/portal/page.tsx",
  "site/app/(site)/portal/[id]/page.tsx",
  "site/app/(site)/portal/guest/page.tsx",
  "site/app/(site)/portal/guest/view/[id]/page.tsx",
  "site/app/(site)/portfolio/page.tsx",
  "site/app/(site)/privacy/page.tsx",
  "site/app/(site)/products/error.tsx",
  "site/app/(site)/products/layout.tsx",
  "site/app/(site)/products/loading.tsx",
  "site/app/(site)/products/page.tsx",
  "site/app/(site)/products/[category]/CategoryPageView.tsx",
  "site/app/(site)/products/[category]/FilterGrid.components.tsx",
  "site/app/(site)/products/[category]/FilterGrid.helpers.ts",
  "site/app/(site)/products/[category]/FilterGrid.tsx",
  "site/app/(site)/products/[category]/FilterGridInner.tsx",
  "site/app/(site)/products/[category]/loading.tsx",
  "site/app/(site)/products/[category]/page.tsx",
  "site/app/(site)/products/[category]/[product]/page.tsx",
  "site/app/(site)/products/[category]/[product]/ProductViewer.tsx",
  "site/app/(site)/products/category/[slug]/page.tsx",
  "site/app/(site)/projects/page.tsx",
  "site/app/(site)/providers/LenisProvider.tsx",
  "site/app/(site)/providers/QueryProvider.tsx",
  "site/app/(site)/quote-cart/layout.tsx",
  "site/app/(site)/quote-cart/page.tsx",
  "site/app/(site)/refund-and-return-policy/page.tsx",
  "site/app/(site)/repo-store/page.tsx",
  "site/app/(site)/service/page.tsx",
  "site/app/(site)/showrooms/page.tsx",
  "site/app/(site)/social/page.tsx",
  "site/app/(site)/solutions/page.tsx",
  "site/app/(site)/solutions/[category]/page.tsx",
  "site/app/(site)/support-ivr/page.tsx",
  "site/app/(site)/sustainability/page.tsx",
  "site/app/(site)/templates/page.tsx",
  "site/app/(site)/terms/page.tsx",
  "site/app/(site)/tracking/page.tsx",
  "site/app/(site)/trusted-by/page.tsx"
];

const results = [];

for (const file of files) {
  // Determine expected test file path:
  // e.g. site/app/(site)/error.tsx -> site/tests/unit/app/(site)/error.test.tsx
  const relativePath = file.replace('site/', '');
  const ext = path.extname(file);
  const withoutExt = relativePath.slice(0, -ext.length);
  const testPathTSX = path.join('site/tests/unit', withoutExt + '.test.tsx');
  const testPathTS = path.join('site/tests/unit', withoutExt + '.test.ts');
  const testPathJS = path.join('site/tests/unit', withoutExt + '.test.js');
  const testPathJSX = path.join('site/tests/unit', withoutExt + '.test.jsx');
  
  let foundPath = null;
  for (const p of [testPathTSX, testPathTS, testPathJS, testPathJSX]) {
    if (fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  // Also check for duplicate .test.test.tsx / .test.test.ts
  const dupPathTSX = path.join('site/tests/unit', withoutExt + '.test.test.tsx');
  const dupPathTS = path.join('site/tests/unit', withoutExt + '.test.test.ts');
  let foundDupPath = null;
  for (const p of [dupPathTSX, dupPathTS]) {
    if (fs.existsSync(p)) {
      foundDupPath = p;
      break;
    }
  }

  let status = 'MISSING';
  let isPlaceholder = false;
  if (foundPath) {
    status = 'EXISTS';
    const content = fs.readFileSync(foundPath, 'utf8');
    if (content.includes('should be covered') && content.includes('expect(true).toBe(true)')) {
      isPlaceholder = true;
    }
  }

  results.push({
    file,
    testPath: foundPath,
    dupPath: foundDupPath,
    status,
    isPlaceholder
  });
}

fs.writeFileSync('tests_status_report.json', JSON.stringify(results, null, 2));
console.log('Report written to tests_status_report.json');

