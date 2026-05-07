# Step 9: Draft X Posts (and queue them)

## Instructions
Read the metadata and YouTube result, then draft social posts for the episode launch and write **two** files:

1. `output/x-posts.md` — human-readable preview (markdown, same structure as before).
2. `output/x-posts-queue.json` — machine-readable array of scheduler post objects, fed into `node scripts/09-queue-x-posts.js`, which POSTs each entry to the scheduler API. The scheduler assigns the next available `slotKey` + `scheduledFor` automatically.

**Context files to read (in this order):**
1. `rules/astroboysoup-x-writing-rules-concise.md` — **Pete's voice rules. Read first. The X content of every post in this step must comply with these rules.** They're stricter than the generic compliance block below: no YouTube/external links in X posts, no banned openers ("Big takeaways", "I…", "Just…", "So…"), no bullet lists in standalone posts, no setup-payoff "not X, but Y" framing, every post ends with an opinion or specific question, hooks must use a number / named event / direct claim. When in doubt, defer to the rules file, not this prompt.
2. `output/metadata.json` — Description, takeaways, keywords, excerpt
3. `output/youtube-result.json` — `videoId` for the YouTube URL (used in non-X networks only)
4. `output/title-and-thumbnail-suggestions.md` — for tone/angle alignment

## Compliance Rules
- No price predictions or financial advice
- No "buy" or urgency around purchasing
- Clean compliance throughout

## Per-network character limits (from scheduler)
- x: 600 (single post — never a thread; never include external links)
- bluesky: 300
- linkedin: 3000
- discord: 2000
- facebook: unlimited
- mastodon: 500
- telegram: 4096

## How to think about the 3 variants
- **Post 1 — Viral launch:** broadest hook, drives clicks. Goes live at launch.
  - On X: prefer **native video** via `media.video` — X actively suppresses posts that link out to YouTube and rewards reach for native video. But X Basic/Free caps video at **512 MB / 140 seconds**, so this only works if a clip is supplied (see below).
  - On every other network (Bluesky, LinkedIn, Facebook, etc.): include the YouTube URL — those platforms don't penalise external links the way X does.
- **Post 2 — Community / quote-tweet angle:** reply value, technical or community-specific take. Posted later (scheduler will pick a later slot automatically). Usually no media on X for this one — it's a follow-up text post.
- **Post 3 — Takeaways:** condensed key insights. Single post per network, not a multi-tweet thread (the scheduler does not support threads — collapse the thread into one strong post per network).

## Choosing the video file for X (`media.video`)
Look in `publish/upload/` and pick, in this priority order:
1. `upload/<episode>-clip.mp4` (a short trailer/teaser, ideal for X — under 140 s and 512 MB)
2. `upload/<episode>-trailer.mp4` (same size/duration constraints)
3. **No fallback to the full episode mp4.** X Basic/Free will reject anything over 512 MB / 140 s; the upload script (`upload-x-media.js`) hard-blocks oversize files before posting. Do NOT set `media.video` to the full episode file.

### If no clip exists
1. Leave `media.video` set to `null` on the X post.
2. **Do NOT put the YouTube URL into `content.x.text`.** Pete's writing rules (section 9) ban YouTube/external links in X posts outright. The post must stand on its own — strong hook, real claim, opinion or question close.
3. **Add a warning at the top of `output/x-posts.md`** that tells Peter to drop the YouTube link as a manual reply within the first 30-60 minutes after launch:

   > ⚠️ No clip found in `upload/`. The X launch post is text-only — no YouTube link in the X post itself, per `rules/astroboysoup-x-writing-rules-concise.md` section 9. Drop the link as a manual reply within 30-60 minutes after launch. To improve next launch, add `<episode>-clip.mp4` (≤140 s, ≤512 MB) to `upload/` before running step 9.

4. In each X post entry of `output/x-posts.md`, include a `**Manual reply (after launch):**` line listing the YouTube URL so Peter has the reply text ready.

This warning must be present every time the fallback is used — Peter relies on it as the reminder to record a clip in future episodes.

## Output 1: `output/x-posts.md`
Same markdown structure as before, kept for Peter's review. Show the X text, character count, and (after `09-queue-x-posts.js` runs) the slot the scheduler assigned.

## Output 2: `output/x-posts-queue.json`
A JSON array. Each element matches the scheduler POST `/api/posts` body. Example:

```json
[
  {
    "title": "Episode launch — Tweag on Cardano core dev",
    "networks": ["x", "bluesky", "linkedin", "facebook"],
    "//": "Clip available — attach to X, no URL in X text.",
    "media": { "image": null, "video": "/home/aiagent/.openclaw/workspace/publish/upload/EPISODE-clip.mp4" },
    "content": {
      "x":        { "text": "Hook + curiosity gap. NO youtube URL — the clip in media.video does the heavy lifting." },
      "bluesky":  { "text": "... https://youtu.be/VIDEO_ID" },
      "linkedin": { "text": "...", "link": "https://youtu.be/VIDEO_ID" },
      "facebook": { "message": "...", "link": "https://youtu.be/VIDEO_ID" }
    }
  },
  {
    "title": "Episode launch — fallback when no clip exists",
    "networks": ["x", "bluesky", "linkedin", "facebook"],
    "//": "No clip in upload/ — media.video is null AND no YouTube URL in content.x.text. The X post stands on its own. x-posts.md must open with the ⚠️ warning and list the YouTube URL as a Manual reply.",
    "media": { "image": null, "video": null },
    "content": {
      "x":        { "text": "Specific number / named claim hook.\n\nReal insight that pays off the hook.\n\nOpinion or question close — no link, no link, no link." },
      "bluesky":  { "text": "Tighter version. https://youtu.be/VIDEO_ID" },
      "linkedin": { "text": "Long-form professional version.", "link": "https://youtu.be/VIDEO_ID" },
      "facebook": { "message": "Friendly version.", "link": "https://youtu.be/VIDEO_ID" }
    }
  },
  { "title": "Community angle — ...", "networks": ["x", "bluesky"], "content": { "x": { "text": "..." }, "bluesky": { "text": "..." } } },
  { "title": "Takeaways — ...",       "networks": ["x", "bluesky", "linkedin"], "content": { } }
]
```

### Field rules
- `title` — internal label only (shown in the dashboard); not posted publicly.
- `networks` — only include the networks you actually populate in `content`.
- `content[x].text` — must NOT contain external URLs (per scheduler rules). Use a quoted-post URL only inside `content[x].quotedPost`.
- All other networks may include the YouTube URL.
- Don't set `scheduledFor` or `slotKey` — let the scheduler auto-assign.

## After writing both files
Run:
```bash
node scripts/09-queue-x-posts.js
```
This writes `output/x-posts-queue-result.json` with the assigned slot for each post. Update `x-posts.md` with those slot timestamps so Peter can see when each will go out.

## Quality Checks
- [ ] **No X post contains an external URL** (rules section 9 — applies whether or not a clip is attached)
- [ ] Every X post hook uses a number, named event, direct claim, tension, or contradiction (rules section 3)
- [ ] No X post starts with banned openers: I, We, Here's, Just, So, Big update, Excited to share, Governance season is here (rules section 3)
- [ ] Every X post ends with an opinion, specific question, or low-friction action — not "what do you think?" or "hope this helps" (rules section 5)
- [ ] No bullet lists in standalone X posts (rules section 4) — comma lists in body prose are fine
- [ ] No setup-payoff or "not X, but Y" symmetric framing (rules section 12.2 — also smells AI in posts)
- [ ] Launch post `media.video` is either a real clip ≤140 s / ≤512 MB, or null (never the full episode mp4)
- [ ] If no clip, `x-posts.md` opens with the ⚠️ "no clip found, link in reply" warning, and each X post has a `**Manual reply (after launch):**` line carrying the YouTube URL
- [ ] No post exceeds its network's character limit
- [ ] Post 1 includes the YouTube URL on every non-X network (Bluesky, LinkedIn, Facebook)
- [ ] No price predictions / financial advice
- [ ] Each variant tells a distinct angle (launch / community / takeaways)
