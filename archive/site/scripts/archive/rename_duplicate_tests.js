const fs = require('fs');
const path = require('path');

const dups = [
  ["site/tests/unit/app/(site)/about/page.test.test.tsx", "site/tests/unit/app/(site)/about/page.test.tsx"],
  ["site/tests/unit/app/(site)/backend-architecture/page.test.test.tsx", "site/tests/unit/app/(site)/backend-architecture/page.test.tsx"],
  ["site/tests/unit/app/(site)/career/page.test.test.tsx", "site/tests/unit/app/(site)/career/page.test.tsx"],
  ["site/tests/unit/app/(site)/contact/page.test.test.tsx", "site/tests/unit/app/(site)/contact/page.test.tsx"],
  ["site/tests/unit/app/(site)/dashboard/DashboardClient.test.test.tsx", "site/tests/unit/app/(site)/dashboard/DashboardClient.test.tsx"],
  ["site/tests/unit/app/(site)/downloads/page.test.test.tsx", "site/tests/unit/app/(site)/downloads/page.test.tsx"],
  ["site/tests/unit/app/(site)/gallery/page.test.test.tsx", "site/tests/unit/app/(site)/gallery/page.test.tsx"],
  ["site/tests/unit/app/(site)/imprint/page.test.test.tsx", "site/tests/unit/app/(site)/imprint/page.test.tsx"],
  ["site/tests/unit/app/(site)/news/page.test.test.tsx", "site/tests/unit/app/(site)/news/page.test.tsx"],
  ["site/tests/unit/app/(site)/planning/page.test.test.tsx", "site/tests/unit/app/(site)/planning/page.test.tsx"]
];

for (const [src, dest] of dups) {
  if (fs.existsSync(src)) {
    console.log(`Renaming/moving ${src} to ${dest}`);
    // If dest exists, delete it first
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    fs.renameSync(src, dest);
  }
}
console.log('Renaming finished');
