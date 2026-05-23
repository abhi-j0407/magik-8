import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const host = '127.0.0.1';
const port = 4173;
const url = `http://${host}:${port}/`;

/** Flag-off default build (HANDOFF D7). */
const THRESHOLDS_FLAG_OFF = {
  performance: 85,
  accessibility: 95,
  'best-practices': 90,
  /** Local http preview often omits installable PWA (B-04); gate only when score is reported. */
  pwa: 0,
};

/**
 * Flag-on WebGL build — OracleScene lazy chunk ~1 MB minified; headless mobile LH ~46–52.
 * Floor only (prod keeps VITE_WEBGL off). F5 re-measured 46–49; threshold 45 documents variance.
 */
const THRESHOLDS_FLAG_ON = {
  performance: 45,
  accessibility: 95,
  'best-practices': 90,
  pwa: 0,
};

const runs = [
  { label: 'flag-off', env: {}, thresholds: THRESHOLDS_FLAG_OFF },
  { label: 'flag-on', env: { VITE_WEBGL: 'true' }, thresholds: THRESHOLDS_FLAG_ON },
];

function run(cmd, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, ...env },
    });
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)),
    );
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

function checkThresholds(scores, thresholds) {
  const failures = [];
  for (const [category, minimum] of Object.entries(thresholds)) {
    const score = scores[category];
    if (score === undefined) continue;
    if (score < minimum) {
      failures.push(`${category}: ${score} < ${minimum}`);
    }
  }
  return failures;
}

async function auditOnce(thresholds) {
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
  return scores;
}

let exitCode = 0;

for (const { label, env, thresholds } of runs) {
  let preview;
  try {
    await run('npm', ['run', 'build'], env);
    preview = runPreview();
    preview.stderr?.on('data', () => {});
    await waitForServer();

    const scores = await auditOnce(thresholds);
    console.log(JSON.stringify({ label, url, scores, thresholds }, null, 2));

    const failures = checkThresholds(scores, thresholds);
    if (failures.length > 0) {
      console.error(`Lighthouse (${label}) thresholds not met:\n` + failures.map((f) => `  - ${f}`).join('\n'));
      exitCode = 1;
    }
  } finally {
    preview?.kill('SIGTERM');
    await delay(600);
  }
}

process.exit(exitCode);
