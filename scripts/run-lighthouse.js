const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const { spawn } = require('child_process');
const config = require('../lighthouse-config.js');

const url = 'http://localhost:3000'; // Adjust if your dev server uses a different port

async function runLighthouse() {
  console.log('Starting development server...');
  const server = spawn('npm', ['start'], { stdio: 'inherit' });

  // Wait for the server to start
  await new Promise(resolve => setTimeout(resolve, 10000));

  console.log('Running Lighthouse test...');
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options, config);
  const reportHtml = JSON.parse(runnerResult.report);

  console.log('Lighthouse scores:');
  console.log('Performance:', reportHtml.categories.performance.score * 100);
  console.log('Accessibility:', reportHtml.categories.accessibility.score * 100);
  console.log('Best Practices:', reportHtml.categories['best-practices'].score * 100);
  console.log('SEO:', reportHtml.categories.seo.score * 100);

  await chrome.kill();
  server.kill();
}

runLighthouse().catch(error => {
  console.error('Error running Lighthouse:', error);
  process.exit(1);
});