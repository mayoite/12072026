const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to http://localhost:3000/planner/canvas...");
    await page.goto('http://localhost:3000/planner/canvas', { waitUntil: 'networkidle' });
    
    const screenshotPath = path.join(process.cwd(), 'planner-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved to: ${screenshotPath}`);
  } catch (error) {
    console.error("Failed to take screenshot:", error);
  } finally {
    await browser.close();
  }
})();
