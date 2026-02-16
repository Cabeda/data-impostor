# Mastodon Integration

This integration adds two features to your Astro blog:

1. **Import Mastodon posts as articles** - Your public Mastodon posts are automatically imported as a separate collection during build
2. **Display Mastodon replies as comments** - Blog posts with a `mastodonUrl` in frontmatter will show replies as comments

## Features

- **Automatic sync**: Posts are fetched on every build
- **Hybrid comments**: Comments are fetched at build time and refreshed client-side if the build is older than 24 hours
- **Images only**: Only image attachments are imported (videos are excluded)
- **Separate collection**: Mastodon posts are in their own collection, not mixed with blog posts

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
MASTODON_INSTANCE=mastodon.social
MASTODON_USER_ID=107151811153023138
```

### Adding Comments to Blog Posts

Add `mastodonUrl` to any blog post's frontmatter:

```yaml
---
title: "My Blog Post"
pubDate: 2025-02-16
mastodonUrl: https://mastodon.social/@josecabeda/116079594437948946
---
```

## Files Created

- `src/lib/mastodon.ts` - Mastodon API client
- `src/loaders/mastodon.ts` - Custom Astro loader for Mastodon posts
- `src/components/MastodonComments.astro` - Comments component with hybrid loading
- `src/pages/mastodon/index.astro` - List all Mastodon posts
- `src/pages/mastodon/[id].astro` - Individual Mastodon post pages
- `.env.example` - Environment variables template

## Files Modified

- `src/content.config.ts` - Added mastodon collection and mastodonUrl field to blog schema
- `src/layouts/BlogPost.astro` - Added conditional comments section

## Usage

### View Mastodon Posts

Visit `/mastodon/` to see all imported Mastodon posts.

### Add Comments to Blog Posts

1. Share your blog post on Mastodon
2. Copy the Mastodon post URL
3. Add `mastodonUrl: <url>` to the blog post's frontmatter
4. Rebuild the site

Replies to that Mastodon post will appear as comments on your blog post.

## How It Works

### Build Time

1. The Mastodon loader fetches your latest 40 posts from the Mastodon API
2. Posts are transformed into Astro content collection entries
3. Individual pages are generated for each post at `/mastodon/{id}`
4. For blog posts with `mastodonUrl`, replies are fetched and rendered

### Client Side

When a user visits a blog post with comments:
- If the build is less than 24 hours old, static comments are shown
- If the build is older than 24 hours, fresh comments are fetched from Mastodon API
- This ensures comments stay relatively fresh without requiring constant rebuilds

## Customization

### Change Refresh Threshold

Edit `src/components/MastodonComments.astro`:

```javascript
const REFRESH_THRESHOLD = 24 * 60 * 60 * 1000; // Change to desired milliseconds
```

### Change Number of Posts

Edit `src/content.config.ts`:

```typescript
loader: mastodonLoader({
  instance: import.meta.env.MASTODON_INSTANCE || 'mastodon.social',
  userId: import.meta.env.MASTODON_USER_ID || '107151811153023138',
  limit: 40 // Change this number
})
```

### Styling

Comments styling is in `src/components/MastodonComments.astro` in the `<style>` section.

## Notes

- The integration uses Mastodon's public API (no authentication required)
- Only public posts and replies are fetched
- Images are linked to Mastodon's CDN (not downloaded locally)
- Videos are excluded to keep the integration lightweight
