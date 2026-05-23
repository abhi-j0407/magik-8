import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const host = '127.0.0.1';
const port = 4173;
const url = `http://${host}:${port}/`;

/** Repo baseline (HANDOFF.md D7, PRODUCT.md) — flag-off default build. */
const THRESHOLDS = {
  performance: 85,
  accessibility: 95,
  'best-practices': 90,
  /** Local http preview often omits installable PWA (B-04); gate only when score is reported. */
  pwa: 0,
};

function run(cmd, args, inherit = false) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
      shell: true,
    });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))));
  });
}

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

function checkThresholds(scores) {
  const failures = [];
  for (const [category, minimum] of Object.entries(THRESHOLDS)) {
    const score = scores[category];
    if (score === undefined) continue;
    if (score < minimum) {
      failures.push(`${category}: ${score} < ${minimum}`);
    }
  }
  return failures;
}

let preview;
let exitCode = 0;

try {
  await run('npm', ['run', 'build']);
  preview = runPreview();
  preview.stderr?.on('data', () => {});
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
  console.log(JSON.stringify({ url, scores, thresholds: THRESHOLDS }, null, 2));

  const failures = checkThresholds(scores);
  if (failures.length > 0) {
    console.error('Lighthouse thresholds not met:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    exitCode = 1;
  }
} finally {
  preview?.kill('SIGTERM');
}

process.exit(exitCode);
