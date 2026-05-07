#!/usr/bin/env node

/**
 * Step 9 (queue): Submit drafted social posts to the X-post scheduler.
 *
 * Reads `output/x-posts-queue.json` — an array of post objects matching the
 * scheduler's POST /api/posts payload (title, networks, content, media).
 * For each entry, POSTs to the scheduler API; the scheduler assigns the next
 * available slotKey + scheduledFor automatically.
 *
 * Usage:
 *   node scripts/09-queue-x-posts.js                     # submits all posts
 *   node scripts/09-queue-x-posts.js --dry-run           # validates + prints
 *   node scripts/09-queue-x-posts.js --api http://host   # override base URL
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(WORKSPACE, 'output');
const QUEUE_FILE = path.join(OUTPUT_DIR, 'x-posts-queue.json');
const RESULT_FILE = path.join(OUTPUT_DIR, 'x-posts-queue-result.json');

function arg(flag) { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : null; }
function has(flag) { return process.argv.includes(flag); }

const dryRun = has('--dry-run');
const apiBase = (arg('--api') || process.env.SCHEDULER_API || 'http://localhost:3111').replace(/\/$/, '');

async function main() {
  if (!fs.existsSync(QUEUE_FILE)) {
    console.error(`❌ Missing ${QUEUE_FILE}`);
    console.error('   The agent task in Step 9 should write this file as an array of');
    console.error('   scheduler post objects: { title, networks, content, media? }');
    process.exit(1);
  }

  const posts = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
  if (!Array.isArray(posts) || posts.length === 0) {
    console.error('❌ x-posts-queue.json must be a non-empty array');
    process.exit(1);
  }

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    if (!p.title) throw new Error(`Post[${i}] missing title`);
    if (!Array.isArray(p.networks) || p.networks.length === 0) throw new Error(`Post[${i}] missing networks[]`);
    if (!p.content || typeof p.content !== 'object') throw new Error(`Post[${i}] missing content{}`);
  }

  const fetchFn = globalThis.fetch || (await import('node-fetch')).default;
  const results = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`[${i + 1}/${posts.length}] ${post.title}`);
    if (dryRun) {
      console.log('   (dry-run) would POST to', `${apiBase}/api/posts`);
      results.push({ index: i, title: post.title, dryRun: true });
      continue;
    }
    const res = await fetchFn(`${apiBase}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    const text = await res.text();
    let body; try { body = JSON.parse(text); } catch { body = { raw: text }; }
    if (!res.ok) {
      console.error(`   ❌ ${res.status}: ${text}`);
      results.push({ index: i, title: post.title, ok: false, status: res.status, error: body.error || text });
      // Stop on first failure so we don't half-queue
      fs.writeFileSync(RESULT_FILE, JSON.stringify(results, null, 2));
      process.exit(1);
    }
    const scheduled = body.post || {};
    console.log(`   ✅ id=${scheduled.id} slot=${scheduled.slotKey} at=${scheduled.scheduledFor}`);
    results.push({
      index: i,
      title: post.title,
      ok: true,
      id: scheduled.id,
      slotKey: scheduled.slotKey,
      scheduledFor: scheduled.scheduledFor,
    });
  }

  fs.writeFileSync(RESULT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n✅ Queued ${results.filter(r => r.ok || r.dryRun).length}/${posts.length} posts`);
  console.log(`   Result: ${RESULT_FILE}`);
}

main().catch(err => { console.error('❌', err.message || String(err)); process.exit(1); });
