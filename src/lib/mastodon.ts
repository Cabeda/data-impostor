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

export class MastodonClient {
  private instance: string;
  private userId: string;

  constructor(instance: string, userId: string) {
    this.instance = instance;
    this.userId = userId;
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
    return data.descendants || [];
  }

  extractPostIdFromUrl(url: string): string | null {
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : null;
  }
}
