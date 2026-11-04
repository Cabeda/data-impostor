export interface MastodonPost {
  id: string;
  created_at: string;
  content: string;
  url: string;
  account: {
    username: string;
    display_name: string;
    avatar: string;
  };
  media_attachments?: Array<{
    type: string;
    url: string;
    preview_url: string;
    description?: string;
  }>;
  replies_count?: number;
  reblogs_count?: number;
  favourites_count?: number;
  emojis?: Array<{
    shortcode: string;
    url: string;
    static_url: string;
  }>;
  sensitive?: boolean;
  spoiler_text?: string;
  visibility?: string;
}

export interface MastodonReply {
  id: string;
  created_at: string;
  content: string;
  url: string;
  account: {
    username: string;
    display_name: string;
    avatar: string;
  };
}

export interface SocialComment {
  id: string;
  platform: string;
  created_at: string;
  content: string;
  url: string;
  account: {
    username: string;
    display_name: string;
    avatar: string;
  };
}

export class MastodonClient {
  private instance: string;
  private userId: string;

  constructor(instance = 'mastodon.social', userId = '') {
    this.instance = instance;
    this.userId = userId;
  }

  get instanceHost(): string {
    return this.instance;
  }

  async fetchUserPosts(limit = 20): Promise<MastodonPost[]> {
    const url = `https://${this.instance}/api/v1/accounts/${this.userId}/statuses?limit=${limit}&exclude_replies=true&exclude_reblogs=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch posts: ${response.statusText}`);
    return response.json();
  }

  async fetchPostReplies(postId: string): Promise<MastodonReply[]> {
    const url = `https://${this.instance}/api/v1/statuses/${postId}/context`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch replies: ${response.statusText}`);
    const data = await response.json();
    return (data.descendants || []) as MastodonReply[];
  }

  async fetchComments(postUrl: string): Promise<SocialComment[]> {
    const postId = this.extractPostIdFromUrl(postUrl);
    if (!postId) return [];
    const replies = await this.fetchPostReplies(postId);
    return replies.map((r) => ({
      id: r.id,
      platform: 'mastodon',
      created_at: r.created_at,
      content: r.content,
      url: r.url,
      account: r.account,
    }));
  }

  async publishStatus(token: string, status: string, visibility = 'public'): Promise<{ id: string; url: string }> {
    const url = `https://${this.instance}/api/v1/statuses`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, visibility }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to publish status: ${response.status} ${response.statusText} ${text}`);
    }
    const data = await response.json();
    const postUrl = data.url || `https://${this.instance}/@${data.account?.username || ''}/${data.id}`;
    return { id: data.id, url: postUrl };
  }

  extractPostIdFromUrl(url: string): string | null {
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : null;
  }

  static instanceFromUrl(url: string): string {
    try {
      return new URL(url).host;
    } catch {
      return 'mastodon.social';
    }
  }
}