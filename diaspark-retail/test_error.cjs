const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if(msg.type() === 'error') console.log('PAGE ERROR LOG:', msg.text());
  });
  page.on('pageerror', error => console.log('UNCAUGHT EXCEPTION:', error.message));

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });

  // Assume the user sees Dashboard. We need to navigate to Customer Info.
  // App.jsx has a header or dashboard that calls navigate('sales')
  // Let's just evaluate a script to try and render EditCustomerModal manually or find the button.
  console.log("Page loaded");
  
  // We can see if there is any error immediately
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
