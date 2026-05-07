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
- **Post 1 — Viral launch:** broadest hook, drives clicks. Goes live at launch. Include the YouTube URL on every network EXCEPT X (X uses media or quoted post — no external link).
- **Post 2 — Community / quote-tweet angle:** reply value, technical or community-specific take. Posted later (scheduler will pick a later slot automatically).
- **Post 3 — Takeaways:** condensed key insights. Single post per network, not a multi-tweet thread (the scheduler does not support threads — collapse the thread into one strong post per network).

## Output 1: `output/x-posts.md`
Same markdown structure as before, kept for Peter's review. Show the X text, character count, and (after `09-queue-x-posts.js` runs) the slot the scheduler assigned.

## Output 2: `output/x-posts-queue.json`
A JSON array. Each element matches the scheduler POST `/api/posts` body. Example:

```json
[
  {
    "title": "Episode launch — Tweag on Cardano core dev",
    "networks": ["x", "bluesky", "linkedin", "facebook"],
    "media": { "image": null, "video": null },
    "content": {
      "x":        { "text": "..." },
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
- [ ] X post text contains no external URLs
- [ ] No post exceeds its network's character limit
- [ ] Post 1 includes the YouTube URL on every non-X network
- [ ] No price predictions / financial advice
- [ ] Each variant tells a distinct angle (launch / community / takeaways)
