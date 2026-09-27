const puppeteer = require('puppeteer');
const fs = require('fs');

async function runBenchmark() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const html = fs.readFileSync('index.html', 'utf8');
  await page.setContent(html);

  // Expose a function or evaluate in page
  const result = await page.evaluate(() => {
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      board[0] = 'X';
      render();
      board[0] = null;
      render();
    }
    const end = performance.now();
    return end - start;
  });

  console.log('Optimized time (ms):', result);
  await browser.close();
}

runBenchmark().catch(console.error);
