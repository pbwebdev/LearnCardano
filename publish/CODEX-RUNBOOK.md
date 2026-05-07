# Learn Cardano Publishing Pipeline — Codex Runbook

This is the step-by-step runbook for running the Learn Cardano automated publishing pipeline. Follow it exactly. All steps are sequential — later steps depend on earlier outputs.

---

## Before You Start

### 1. Confirm the episode name
Peter will provide the episode name (e.g. `Why Banks Dont Want Ethereum or Solana`). Use this exact name everywhere as `EPISODE_NAME`. Avoid apostrophes in filenames — if Peter's title has one, use the version without (e.g. "Dont" not "Don't").

### 2. Confirm input files exist
Check that these files exist in `publish/upload/`:
```
upload/EPISODE_NAME.mp4
upload/EPISODE_NAME.mp3
upload/EPISODE_NAME.txt  (optional — corrected master transcript; skips Whisper if present)
upload/references.txt    (can be empty if no URLs)
```

If `upload/EPISODE_NAME.txt` is provided, it is treated as the authoritative transcript (corrected names, spelling, etc.) and Whisper is **not** used to generate transcript text. The MP3 is still transcribed once for chapter timestamps (segments only — its text output is discarded).

### 3. Clean old outputs
**Critical:** The `output/` directory may have files from previous episodes. Before starting:
```bash
cd /home/aiagent/.openclaw/workspace/publish
rm -f output/*.json output/*.html output/*.md output/*.transcript.txt output/*.segments.json output/chapters.txt output/.youtube-upload.lock
```
This prevents:
- `findEpisodeTranscript()` picking up an old transcript (it grabs the first `.transcript.txt` alphabetically)
- YouTube/Spreaker scripts skipping upload because old result files exist
- WordPress using stale data
- Old `.segments.json` or `chapters.txt` contaminating the new episode
- A stale lock file blocking a fresh upload

---

## Pipeline Steps

### Step 1: Transcribe Audio [SCRIPT]
```bash
cd /home/aiagent/.openclaw/workspace/publish
node scripts/01-transcribe.js --episode "EPISODE_NAME"
```
- **Input:** `upload/EPISODE_NAME.mp3` — OR `upload/EPISODE_NAME.txt` (corrected master transcript) which short-circuits Whisper text generation.
- **Output:** `output/EPISODE_NAME.transcript.txt` AND `output/EPISODE_NAME.segments.json`
- **Behavior when `upload/EPISODE_NAME.txt` exists:** the provided transcript is copied verbatim to `output/EPISODE_NAME.transcript.txt`. If the MP3 is also present, Whisper still runs to produce `segments.json` for chapter timestamps but its transcript text is discarded. If no MP3 is present, segments will be `[]` and Step 4b (chapters) cannot be generated.
- **Verify:** Both files exist. Transcript contains readable text. Segments JSON is an array of `{start, end, text}` objects with timestamps in seconds.
- **⚠️ Requires ffmpeg** for files >25MB. The script will fail fast with a clear error if ffmpeg is missing. Install with: `sudo apt-get install ffmpeg`
- **Note:** Large files are chunked via ffmpeg automatically. Segment timestamps are offset correctly for chunked files.

### Step 2: Analyse References [SCRIPT]
```bash
node scripts/02-analyse-references.js
```
- **Input:** `upload/references.txt`
- **Output:** `output/references-context.json`
- **Note:** If `references.txt` is empty, the script still runs and creates an empty/minimal JSON. That's fine.

### Step 3: Generate Metadata [AGENT TASK — you write this]
Read these files:
- `output/EPISODE_NAME.transcript.txt`
- `output/references-context.json`
- `prompts/03-metadata-prompt.md`

Write `output/metadata.json` with this exact structure:
```json
{
  "description": "2-3 paragraph episode description for YouTube/Spreaker",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "...5-8 items"],
  "keywords": ["keyword1", "keyword2", "...12-20 items"],
  "excerpt": "1-2 sentence summary"
}
```

**Quality checklist:**
- Description should be informative, not clickbait
- Keywords should include: Cardano, Midnight, and topic-specific terms
- Key takeaways should be concrete, not vague
- No price predictions, no "buy" language
- **⚠️ Must be valid JSON — use `\n` for newlines inside strings, NEVER literal line breaks inside a JSON string value.** This is the most common cause of upload failure.

### Step 4: Generate Titles & Thumbnail Suggestions [AGENT TASK — you write this]
Read these files:
- `output/EPISODE_NAME.transcript.txt`
- `output/metadata.json`
- `prompts/04-titles-thumbnails-prompt.md`

Write `output/title-and-thumbnail-suggestions.md` following the prompt template structure exactly. Include:
- 3 tiers (Viral, SEO, Community)
- Each tier: title, thumbnail text (≤10 chars), thumbnail concept, curiosity gap, AI image prompt, 30-second opening hook
- X post strategy at the bottom
- Recommendation for which tier to launch with

**Important:** The title from Tier A is used by the upload scripts as the video/episode title. Make it good.

### Step 4b: Generate Chapter Timestamps [AGENT TASK — you write this]
Read these files:
- `output/EPISODE_NAME.segments.json` (timestamped segments from Step 1)
- `output/EPISODE_NAME.transcript.txt`
- `prompts/04b-chapters-prompt.md`

Write `output/chapters.txt` in YouTube chapter format:
```
0:00 Intro
1:23 What Banks Actually Need
3:45 The Privacy Problem
...
```

**Rules:**
- First line MUST be `0:00`
- Aim for 5-12 chapters
- Each chapter ≥10 seconds
- Titles should be 3-6 words, descriptive
- Use actual segment timestamps — don't guess
- The YouTube upload script (Step 5) automatically includes chapters in the description

### Step 5: Upload to YouTube [SCRIPT — DETACHED]
**⚠️ Always run this with `nohup` so the upload survives session drops.**

```bash
cd /home/aiagent/.openclaw/workspace/publish
nohup node scripts/05-upload-youtube.js --episode "EPISODE_NAME" > /tmp/youtube-upload.log 2>&1 &
echo "Upload PID: $!"
```

Monitor progress without blocking (check every few minutes — don't poll in a loop):
```bash
tail -5 /tmp/youtube-upload.log
```

Wait for completion:
```bash
cat output/youtube-result.json 2>/dev/null || echo "Still uploading..."
```

- **Input:** `upload/EPISODE_NAME.mp4`, `output/metadata.json`, `output/references-context.json`
- **Output:** `output/youtube-result.json`
- **Status:** Uploaded as PRIVATE draft
- **Note:** Large files (1-5GB) can take 30–90 minutes. The nohup process keeps running even if the agent session times out.
- **⚠️ Lock file:** The script writes `output/.youtube-upload.lock` at start and removes it on completion. If the script crashes mid-upload without cleaning the lock, delete it manually before retrying.
- **⚠️ Skip logic:** If `output/youtube-result.json` already exists, the script skips the upload. That's why cleaning outputs first is critical.
- **⚠️ Monetization:** YouTube monetization CANNOT be set via the upload API. Peter must enable it manually in YouTube Studio after the video goes public: Videos → select video → Monetization tab.

After upload completes, verify `output/youtube-result.json` has a real `videoId` (not "DRY_RUN").

### Step 6: Upload to Spreaker [SCRIPT]
```bash
node scripts/06-upload-spreaker.js --episode "EPISODE_NAME"
```
- **Input:** `upload/EPISODE_NAME.mp3`, `output/metadata.json`
- **Output:** `output/spreaker-result.json`
- **Status:** Uploaded as draft/hidden
- **Note:** MP3 is much smaller than MP4, this typically finishes in under 2 minutes.
- **⚠️ Same skip logic** — won't re-upload if result file exists

### Step 7: Generate Blog Post [AGENT TASK — you write this]
Read these files:
- `output/EPISODE_NAME.transcript.txt`
- `output/metadata.json`
- `output/references-context.json`
- `output/youtube-result.json` (for the `videoId`)
- `prompts/07-blog-post-prompt.md`

Write `output/blog-post.html`:
- HTML content only (no `<html>`, `<head>`, `<body>` wrappers)
- YouTube embed at top using real videoId
- 600-1000 word article body (NOT a transcript dump — restructure and polish)
- Key takeaways box at bottom (styled div)
- Disclaimer at the very end
- Use only: `<h2>`, `<h3>`, `<p>`, `<a>`, `<ul>`, `<li>`, `<strong>`, `<em>`, `<blockquote>`, `<div>`

### Step 8 prerequisite: WordPress mu-plugin
The publish script writes `youtube_video` and `text_transcript` via the WP REST API. For those writes to land, the site must have `publish/wordpress/podcast-acf-rest.php` installed at `wp-content/mu-plugins/podcast-acf-rest.php` on learncardano.io. mu-plugins auto-load — there is no activation step. Without this file the post body still publishes but the two ACF fields stay empty (the script does not error).

### Step 8: Publish to WordPress [SCRIPT]
```bash
node scripts/08-publish-wordpress.js
```
- **Input:** `output/blog-post.html`, `output/metadata.json`, `output/youtube-result.json`, `output/spreaker-result.json`, transcript
- **Output:** `output/wordpress-result.json`
- **Status:** Published as DRAFT
- **⚠️ Known issue:** `findEpisodeTranscript()` grabs the FIRST `.transcript.txt` alphabetically. If old transcripts exist in `output/`, it may grab the wrong one. This is why cleaning outputs first is critical.

### Step 9: Draft X Posts [AGENT TASK — you write this]
Read these files:
- `output/metadata.json`
- `output/youtube-result.json`
- `prompts/09-x-posts-prompt.md`

Write `output/x-posts.md` with 3 post variants:
1. **Viral launch post** — broad hook, names competitors for reach
2. **Quote-tweet / community post** — technical angle, 6-8hrs after launch
3. **Thread** — 3-4 tweets, key takeaways, ends with video link

Replace `YOUTUBE_URL` with the actual URL from `youtube-result.json`.

### Step 10: Generate Summary [SCRIPT]
```bash
node scripts/10-summary.js
```
- **Output:** `output/publish-summary.md`
- **What it does:** Aggregates all results into a review checklist for Peter

---

## Compliance Rules (ALL generated content)
- No price predictions or investment advice
- Frame volume/activity as ecosystem growth, not investment signals
- No "buy" or financial advice language
- Clean compliance language throughout (Midnight Ambassador standards)
- Include disclaimer where appropriate

---

## Common Pitfalls (learned the hard way)

| Issue | Cause | Fix |
|-------|-------|-----|
| YouTube upload killed mid-transfer | Running inline in an agent session that times out | Always use `nohup` (see Step 5) |
| Duplicate YouTube uploads | Session drops before `youtube-result.json` is written, then a retry | Lock file (`output/.youtube-upload.lock`) now prevents this; also clean outputs before starting |
| YouTube script skips upload | `youtube-result.json` already exists | Clean outputs before starting |
| WordPress uses wrong transcript | Multiple `.transcript.txt` files in output | Clean outputs before starting |
| Shell quoting breaks on apostrophes | Episode name has `'` in it | Use filenames without apostrophes |
| `youtube-result.json` has `"DRY_RUN"` videoId | Previous dry-run result not cleaned | Delete the file and re-run without `--dry-run` |
| Transcription fails on large file | `ffmpeg` not installed | `sudo apt-get install ffmpeg` — script now fails fast with a clear message |
| JSON parse error on metadata upload | Literal newlines inside a JSON string value | Always use `\n` escape sequences, never actual line breaks inside JSON strings |

---

## Quick-Start Command Sequence

Replace `EPISODE` with the actual episode name:

```bash
EPISODE="Why Banks Dont Want Ethereum or Solana"
cd /home/aiagent/.openclaw/workspace/publish

# Clean everything including lock file
rm -f output/*.json output/*.html output/*.md output/*.transcript.txt output/*.segments.json output/chapters.txt output/.youtube-upload.lock

# Step 1: Transcribe (requires ffmpeg if >25MB)
node scripts/01-transcribe.js --episode "${EPISODE}"

# Step 2: References
node scripts/02-analyse-references.js

# Steps 3, 4, 4b: [AGENT TASKS]
# Generate metadata.json — IMPORTANT: use \n not literal newlines in JSON strings
# Generate title-and-thumbnail-suggestions.md
# Generate chapters.txt

# Step 5: YouTube upload — ALWAYS use nohup for large files
nohup node scripts/05-upload-youtube.js --episode "${EPISODE}" > /tmp/youtube-upload.log 2>&1 &
echo "YouTube upload started in background. PID: $!"
echo "Monitor: tail -f /tmp/youtube-upload.log"
echo "Check done: cat output/youtube-result.json"

# Wait until youtube-result.json exists, then continue...

# Step 6: Spreaker upload
node scripts/06-upload-spreaker.js --episode "${EPISODE}"

# Steps 7, 9: [AGENT TASKS — generate blog-post.html and x-posts.md]

# Step 8: WordPress publish
node scripts/08-publish-wordpress.js

# Step 10: Summary
node scripts/10-summary.js
```

---

## Checking YouTube Upload Progress (Low-Token Method)

Do NOT poll in a tight loop — each poll costs tokens. Use this pattern instead:

```bash
# Check current progress (single check)
tail -3 /tmp/youtube-upload.log

# Check if complete
ls output/youtube-result.json 2>/dev/null && echo "DONE" || echo "Still uploading..."
```

Check once every 5-10 minutes. When `output/youtube-result.json` exists, the upload is done.

---

## After Pipeline — Peter's Manual Steps
1. Pick YouTube title from `title-and-thumbnail-suggestions.md`
2. Create thumbnail from AI image prompts
3. Update title on YouTube, Spreaker, and WordPress
4. Review auto-generated chapter timestamps (already in YouTube description from Step 4b)
5. Review all content for accuracy
6. **Enable monetization in YouTube Studio** (Videos → select video → Monetization tab) — must be done before publishing
7. Set YouTube to public → Publish Spreaker → Publish WordPress draft
8. Post X launch tweet, queue quote-tweet for 6-8 hrs later
9. When on Spotify: update WordPress ACF fields (`spotify_id`, `embed_code`)
