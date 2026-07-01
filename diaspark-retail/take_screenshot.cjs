const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5174/stocks', { waitUntil: 'networkidle0' }).catch(e => console.log(e));
  
  await page.screenshot({ path: 'screenshot.png' });
  console.log("Screenshot saved as screenshot.png");
  await browser.close();
})();
