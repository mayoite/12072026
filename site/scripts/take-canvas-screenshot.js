const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to http://localhost:3000/planner/canvas...");
    await page.goto('http://localhost:3000/planner/canvas', { waitUntil: 'networkidle' });
    
    console.log("Waiting for setup gate...");
    await page.waitForSelector('#project-setup-name', { timeout: 10000 });
    
    console.log("Filling in Project Name...");
    await page.fill('#project-setup-name', 'My Test Project');
    
    console.log("Waiting for setup gate button...");
    const button = page.locator('button:has-text("Start placing furniture")');
    await button.waitFor({ state: 'visible', timeout: 5000 });
    
    console.log("Clicking the setup gate button...");
    await button.click();
    
    console.log("Waiting for canvas to load...");
    await page.waitForTimeout(4000); 
    
    const screenshotPath = path.join(process.cwd(), 'planner-canvas-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`Screenshot saved to: ${screenshotPath}`);
  } catch (error) {
    console.error("Failed to take screenshot:", error);
  } finally {
    await browser.close();
  }
})();
