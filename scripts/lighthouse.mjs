import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const host = '127.0.0.1';
const port = 4173;
const url = `http://${host}:${port}/`;

function runPreview() {
  return spawn('npm', ['run', 'preview', '--', '--host', host, '--port', String(port)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });
}

async function waitForServer(maxMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await delay(400);
  }
  throw new Error(`Preview server did not respond at ${url}`);
}

const preview = runPreview();
preview.stderr?.on('data', () => {});

try {
  await waitForServer();
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });
  const result = await lighthouse(url, {
    port: chrome.port,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'pwa'],
    formFactor: 'mobile',
    screenEmulation: { mobile: true },
  });
  await chrome.kill();

  const scores = Object.fromEntries(
    Object.entries(result.lhr.categories).map(([id, cat]) => [id, Math.round((cat.score ?? 0) * 100)]),
  );
  console.log(JSON.stringify({ url, scores }, null, 2));
} finally {
  preview.kill('SIGTERM');
}
