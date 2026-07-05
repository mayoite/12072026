const fs = require('fs');
const path = require('path');

const moves = [
  ["site/tests/unit/app-site-portal-guest-view-id-page.test.tsx", "site/tests/unit/app/(site)/portal/guest/view/[id]/page.test.tsx"],
  ["site/tests/unit/app-site-portfolio-page.test.tsx", "site/tests/unit/app/(site)/portfolio/page.test.tsx"],
  ["site/tests/unit/app-site-privacy-page.test.tsx", "site/tests/unit/app/(site)/privacy/page.test.tsx"],
  ["site/tests/unit/app-site-products-category-CategoryPageView.test.tsx", "site/tests/unit/app/(site)/products/[category]/CategoryPageView.test.tsx"],
  ["site/tests/unit/app-site-products-error.test.tsx", "site/tests/unit/app/(site)/products/error.test.tsx"],
  ["site/tests/unit/app-site-products-layout.test.tsx", "site/tests/unit/app/(site)/products/layout.test.tsx"],
  ["site/tests/unit/app-site-products-loading.test.tsx", "site/tests/unit/app/(site)/products/loading.test.tsx"],
  ["site/tests/unit/app-site-products-page.test.tsx", "site/tests/unit/app/(site)/products/page.test.tsx"]
];

for (const [src, dest] of moves) {
  if (fs.existsSync(src)) {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log(`Copying ${src} to ${dest}`);
    fs.copyFileSync(src, dest);
  }
}
console.log('Legacy tests copied');
