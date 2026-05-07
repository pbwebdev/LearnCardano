#!/usr/bin/env node

/**
 * Generate or pick an image for a social post.
 *
 * Usage (generate):
 *   node scripts/generate-image.js --prompt "..." --out /home/.../content/learn-cardano-foo.png [--size 1536x1024]
 *
 * Usage (match-or-generate):
 *   node scripts/generate-image.js --keywords "tweag peras cardano" \
 *       --slug tweag-peras-launch --prompt "..." \
 *       --content-dir /home/aiagent/.openclaw/workspace/content \
 *       --out auto
 *
 * Match-mode: scans --content-dir for files whose lowercased basename contains
 * ALL the keywords. If a match is found, prints that path and exits without
 * calling OpenAI. Otherwise, generates via gpt-image-1 and writes the image
 * to --content-dir/learn-cardano-<slug>.png.
 *
 * Returns JSON: {"ok":true,"file":"...","source":"matched"|"generated"}
 */

const fs = require('fs');
const path = require('path');

function arg(flag) { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : null; }
function has(flag) { return process.argv.includes(flag); }
function must(cond, msg) { if (!cond) { console.error(`❌ ${msg}`); process.exit(1); } }

function loadOpenAIKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  const cfgPath = path.resolve(__dirname, '..', 'config.json');
  if (fs.existsSync(cfgPath)) {
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    if (cfg.images?.apiKey) return cfg.images.apiKey;
    if (cfg.openai?.apiKey) return cfg.openai.apiKey;
    if (cfg.whisper?.apiKey) return cfg.whisper.apiKey;
  }
  must(false, 'No OpenAI API key. Set OPENAI_API_KEY or config.json images.apiKey');
}

function findMatch(contentDir, keywords) {
  if (!fs.existsSync(contentDir)) return null;
  const terms = keywords.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return null;
  const files = fs.readdirSync(contentDir).filter(f => /\.(png|jpe?g|webp|gif)$/i.test(f));
  // Score: number of keyword matches in basename (case-insensitive)
  let best = null, bestScore = 0;
  for (const f of files) {
    const lower = f.toLowerCase();
    let score = 0;
    for (const t of terms) if (lower.includes(t)) score += 1;
    // Require at least half the terms to match
    if (score >= Math.ceil(terms.length / 2) && score > bestScore) {
      bestScore = score;
      best = path.join(contentDir, f);
    }
  }
  return best;
}

async function generateImage(prompt, size, outFile) {
  const apiKey = loadOpenAIKey();
  const fetchFn = globalThis.fetch || (await import('node-fetch')).default;

  const res = await fetchFn('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size, n: 1 }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`OpenAI Images error ${res.status}: ${text.slice(0, 500)}`);
  const data = JSON.parse(text);
  const b64 = data.data?.[0]?.b64_json;
  must(b64, `No b64_json in OpenAI response: ${text.slice(0, 300)}`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, Buffer.from(b64, 'base64'));
  return outFile;
}

async function main() {
  const prompt = arg('--prompt');
  const size = arg('--size') || '1536x1024';
  let outArg = arg('--out');
  const keywords = arg('--keywords');
  const slug = arg('--slug');
  const contentDir = arg('--content-dir') || '/home/aiagent/.openclaw/workspace/content';

  must(prompt, 'Missing --prompt');

  // Match-mode
  if (keywords) {
    const matched = findMatch(contentDir, keywords);
    if (matched) {
      console.log(JSON.stringify({ ok: true, file: matched, source: 'matched' }, null, 2));
      return;
    }
  }

  // Generate
  if (outArg === 'auto' || !outArg) {
    must(slug, '--out auto requires --slug to derive filename');
    outArg = path.join(contentDir, `learn-cardano-${slug}.png`);
  }
  const out = path.resolve(outArg);
  if (has('--dry-run')) {
    console.log(JSON.stringify({ ok: true, dryRun: true, prompt, size, out }, null, 2));
    return;
  }
  const file = await generateImage(prompt, size, out);
  console.log(JSON.stringify({ ok: true, file, source: 'generated' }, null, 2));
}

main().catch(err => { console.error('❌', err.message || String(err)); process.exit(1); });
