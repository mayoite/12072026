const fs = require('fs');
const path = require('path');

const src = 'site/tests/unit/app-site-products-category-FilterGrid-helpers.test.ts';
const dest = 'site/tests/unit/app/(site)/products/[category]/FilterGrid.helpers.test.ts';

if (fs.existsSync(src)) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  console.log(`Copying ${src} to ${dest}`);
  fs.copyFileSync(src, dest);
} else {
  console.log('Source file not found.');
}
