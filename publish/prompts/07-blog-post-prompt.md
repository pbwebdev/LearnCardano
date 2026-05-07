# Step 7: Generate Blog Post

## Instructions
Read the transcript, metadata, reference context, and YouTube result, then write a proper blog post for learncardano.io.

**Context files to read:**
- `output/transcript.txt` — Full episode transcript
- `output/metadata.json` — Description, takeaways, keywords
- `output/references-context.json` — Reference URLs with titles and summaries
- `output/youtube-result.json` — Contains `videoId` for the YouTube embed

Write the output as HTML to `output/blog-post.html`.

## Important: This Is NOT a Transcript Dump
Write a proper article that someone would want to read even if they watched the video. Restructure, condense, and add clarity. The transcript is your source material — the blog post is a polished article.

## Compliance Rules
- No price predictions or investment advice
- No "buy" language
- Include disclaimer at the bottom
- Clean compliance throughout

## HTML Structure
Write clean HTML using only these tags: `<h2>`, `<h3>`, `<p>`, `<a>`, `<ul>`, `<li>`, `<strong>`, `<em>`, `<blockquote>`, `<div>`

Do NOT include `<html>`, `<head>`, `<body>`, or `<!DOCTYPE>` — just the article content.

## Do NOT include a YouTube embed
The `podcasts` custom post type on learncardano.io renders the video itself via the ACF field `youtube_video` (the site template embeds it above the post body). The publish script populates that ACF field automatically from `output/youtube-result.json`, and also writes the corrected transcript into the ACF field `text_transcript`.

Your blog post HTML must therefore **not** contain a `<div class="video-embed">` / `<iframe ...youtube.com/embed/...>` block — that would render a duplicate player.

## Required Sections (in this order)

### 1. Introduction (1-2 paragraphs)
Brief overview of what the episode covers and why it matters. Hook the reader.

### 2. Article Body (600-1000 words)
- Use `<h2>` for major sections, `<h3>` for subsections
- Embed reference links naturally within the text using `<a href="URL" target="_blank">title</a>`
- Break complex topics into digestible paragraphs
- Include relevant quotes or data points from the episode
- Write for someone who may not be deep in the Cardano ecosystem

### 3. Key Takeaways Box
End with this styled box (populate from metadata.json keyTakeaways):

```html
<div class="key-takeaways" style="background:#f0f4f8;border-left:4px solid #0033ad;padding:1.5em;margin:2em 0;border-radius:4px;">
<h3>Key Takeaways</h3>
<ul>
<li>Takeaway 1</li>
<li>Takeaway 2</li>
</ul>
</div>
```

### 4. Disclaimer
```html
<p><em>Disclaimer: This content is for educational purposes only. Nothing in this article constitutes financial advice. Always do your own research.</em></p>
```

## Tone
Informative, educational, accessible. Not overly casual, not stiff. Think tech journalism for a crypto-literate audience. Match Peter's approachable style.
