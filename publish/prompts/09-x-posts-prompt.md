# Step 9: Draft X Posts (and queue them)

## Instructions
Read the metadata and YouTube result, then draft social posts for the episode launch and write **two** files:

1. `output/x-posts.md` — human-readable preview (markdown, same structure as before).
2. `output/x-posts-queue.json` — machine-readable array of scheduler post objects, fed into `node scripts/09-queue-x-posts.js`, which POSTs each entry to the scheduler API. The scheduler assigns the next available `slotKey` + `scheduledFor` automatically.

**Context files to read:**
- `output/metadata.json` — Description, takeaways, keywords, excerpt
- `output/youtube-result.json` — `videoId` for the YouTube URL
- `output/title-and-thumbnail-suggestions.md` — for tone/angle alignment

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
2. **Add the YouTube URL into `content.x.text`** — this is the only case where the X post may include an external URL. Reach will be lower than native video, but it's better than no link at all.
3. **Add a warning at the top of `output/x-posts.md`** that says clearly:

   > ⚠️ No clip found in `upload/`. X launch post is using the YouTube link as a fallback (lower reach). To improve next time, add `<episode>-clip.mp4` (≤140 s, ≤512 MB) to `upload/` before running step 9.

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
    "//": "No clip in upload/ — video.media is null on X, and the YouTube URL is in content.x.text. x-posts.md must open with a warning.",
    "media": { "image": null, "video": null },
    "content": {
      "x":        { "text": "Hook + curiosity gap.\n\nhttps://youtu.be/VIDEO_ID" },
      "bluesky":  { "text": "... https://youtu.be/VIDEO_ID" },
      "linkedin": { "text": "...", "link": "https://youtu.be/VIDEO_ID" },
      "facebook": { "message": "...", "link": "https://youtu.be/VIDEO_ID" }
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
- [ ] **Launch post X media.video is either a real clip ≤140 s / ≤512 MB, or null (never the full episode mp4)**
- [ ] If `media.video` is null on X, the YouTube URL IS in `content.x.text` AND `x-posts.md` opens with the ⚠️ "no clip found" warning block
- [ ] If `media.video` is set on X, `content.x.text` contains NO external URL
- [ ] No post exceeds its network's character limit
- [ ] Post 1 includes the YouTube URL on every non-X network
- [ ] No price predictions / financial advice
- [ ] Each variant tells a distinct angle (launch / community / takeaways)
