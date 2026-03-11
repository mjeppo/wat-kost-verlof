const puppeteer = require('puppeteer');

(async () => {
  const url = 'http://localhost:5173/';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const logs = [];

  page.on('console', (msg) => {
    const text = msg.text();
    console.log('[console]', msg.type(), text);
    logs.push({ type: msg.type(), text });
  });

  page.on('pageerror', (err) => {
    console.error('[pageerror]', err.message);
    logs.push({ type: 'pageerror', text: err.message });
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
  } catch (e) {
    console.error('[goto error]', e.message);
    logs.push({ type: 'goto-error', text: e.message });
  }

  // wait a bit for dynamic scripts to run (use portable sleep)
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await browser.close();

  const errors = logs.filter(l => l.type === 'error' || l.type === 'pageerror' || l.type === 'goto-error');
  if (errors.length > 0) {
    console.log('\nFound errors:');
    errors.forEach((e) => console.log('-', e.type + ':', e.text));
    process.exit(1);
  } else {
    console.log('\nNo errors found in page console.');
    process.exit(0);
  }
})();
