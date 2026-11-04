import { MastodonClient, type SocialComment } from './mastodon.ts';

export type PlatformId = 'mastodon' | 'linkedin';

export interface Platform {
  id: PlatformId;
  name: string;
  supportsComments: boolean;
  fetchComments(url: string): Promise<SocialComment[]>;
  publish(post: { title: string; url: string; description?: string; tags?: string[] }): Promise<string>;
}

export interface SyndicationUrls {
  [platform: string]: string;
}

export function normalizeSyndication(input: {
  mastodonUrl?: string;
  syndication?: SyndicationUrls;
}): SyndicationUrls {
  const out: SyndicationUrls = { ...(input.syndication || {}) };
  if (input.mastodonUrl && !out.mastodon) {
    out.mastodon = input.mastodonUrl;
  }
  return out;
}

export const mastodonPlatform: Platform = {
  id: 'mastodon',
  name: 'Mastodon',
  supportsComments: true,
  async fetchComments(url: string): Promise<SocialComment[]> {
    const client = new MastodonClient(MastodonClient.instanceFromUrl(url));
    return client.fetchComments(url);
  },
  async publish(post): Promise<string> {
    const instance = (typeof process !== 'undefined' && process.env?.MASTODON_INSTANCE) || 'mastodon.social';
    const token = (typeof process !== 'undefined' && process.env?.MASTODON_ACCESS_TOKEN) || '';
    if (!token) throw new Error('MASTODON_ACCESS_TOKEN is required to publish to Mastodon');
    const client = new MastodonClient(instance);
    const tags = (post.tags || []).map((t) => '#' + t.replace(/\s+/g, '')).join(' ');
    const status = post.title + '\n\n' + post.url + (post.description ? '\n\n' + post.description : '') + (tags ? '\n\n' + tags : '');
    const result = await client.publishStatus(token, status);
    return result.url;
  },
};

export const linkedinPlatform: Platform = {
  id: 'linkedin',
  name: 'LinkedIn',
  supportsComments: false,
  async fetchComments(): Promise<SocialComment[]> {
    return [];
  },
  async publish(): Promise<string> {
    throw new Error('LinkedIn publishing is not automated yet; post manually and store the URL in syndication.linkedin');
  },
};

export const PLATFORMS: Record<PlatformId, Platform> = {
  mastodon: mastodonPlatform,
  linkedin: linkedinPlatform,
};

export function getPlatform(id: string): Platform | undefined {
  return (PLATFORMS as Record<string, Platform>)[id];
}

export const PLATFORM_IDS: PlatformId[] = ['mastodon', 'linkedin'];