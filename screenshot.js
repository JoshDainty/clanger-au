const puppeteer = require('puppeteer');
const path = require('path');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const PAGE_URL = process.argv[2] || 'http://localhost:3000';
const SECTION = process.argv[3] || 'hero';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto(PAGE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    // Wait for fonts and animations to settle
    await new Promise(r => setTimeout(r, 2000));

    const filename = `${SECTION}-${vp.name}.png`;
    await page.screenshot({
      path: path.join(__dirname, 'temporary_screenshots', filename),
      fullPage: false,
    });
    console.log(`  ✓ ${filename} (${vp.width}x${vp.height})`);
    await page.close();
  }

  await browser.close();
  console.log('\nScreenshots saved to temporary_screenshots/');
})();
