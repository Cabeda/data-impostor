import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { MastodonClient } from '../lib/mastodon.js';

export interface MastodonLoaderOptions {
  instance: string;
  userId: string;
  limit?: number;
}

export function mastodonLoader(options: MastodonLoaderOptions): Loader {
  return {
    name: 'mastodon-loader',
    load: async ({ store, logger, generateDigest }) => {
      logger.info(`Loading posts from ${options.instance}`);
      
      const client = new MastodonClient(options.instance, options.userId);
      const posts = await client.fetchUserPosts(options.limit || 40);
      
      store.clear();
      
      for (const post of posts) {
        // Skip posts with empty content (boosts/reblogs that weren't filtered by API)
        if (!post.content || post.content.trim() === '') continue;
        
        const images = post.media_attachments?.filter(m => m.type === 'image') || [];
        const postUrl = post.url || `https://${options.instance}/@${post.account.username}/${post.id}`;
        
        store.set({
          id: post.id,
          data: {
            content: post.content,
            created_at: post.created_at,
            url: postUrl,
            account: post.account,
            images: images.map(img => ({
              url: img.url,
              preview_url: img.preview_url,
              description: img.description
            }))
          },
          rendered: {
            html: post.content
          },
          digest: generateDigest(post)
        });
      }
      
      logger.info(`Loaded ${posts.length} posts`);
    },
    schema: async () => z.object({
      content: z.string(),
      created_at: z.string(),
      url: z.string().url(),
      account: z.object({
        username: z.string(),
        display_name: z.string(),
        avatar: z.string()
      }),
      images: z.array(z.object({
        url: z.string(),
        preview_url: z.string(),
        description: z.string().optional()
      })).optional()
    })
  };
}
