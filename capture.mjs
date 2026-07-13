import { chromium } from 'playwright';

(async () => {
  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome Beta\\Application\\chrome.exe',
      headless: true
    });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewportSize({ width: 1280, height: 800 });

    console.log('Navigating to Dashboard...');
    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'C:\\Users\\AyushWeb\\.gemini\\antigravity-ide\\brain\\1e09d553-d856-42f4-9a60-1959570cccd0\\scratch\\admin-dashboard.png', fullPage: true });

    console.log('Navigating to SVG Editor...');
    await page.goto('http://localhost:3000/admin/svg-editor');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'C:\\Users\\AyushWeb\\.gemini\\antigravity-ide\\brain\\1e09d553-d856-42f4-9a60-1959570cccd0\\scratch\\admin-svg-editor.png', fullPage: true });

    console.log('Navigating to Price Books...');
    await page.goto('http://localhost:3000/admin/price-books');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'C:\\Users\\AyushWeb\\.gemini\\antigravity-ide\\brain\\1e09d553-d856-42f4-9a60-1959570cccd0\\scratch\\admin-price-books.png', fullPage: true });

    await browser.close();
    console.log('Done capturing screenshots.');
  } catch (error) {
    console.error('Error:', error);
  }
})();
