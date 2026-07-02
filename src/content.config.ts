import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { mastodonLoader } from "./loaders/mastodon.js";

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/data/blog" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        heroImage: image().optional(),
        heroImageAlt: z.string().optional(),
        mastodonUrl: z.string().url().optional()
    }),
});
const reads = defineCollection({
    // Load data from Markdown files on disk
    loader: glob({ pattern: "**/*.md", base: "./src/data/reads" }),
    schema: z.object({
        pubDate: z.coerce.date(),
    }),
});

const talks = defineCollection({
    // Load data from Markdown files on disk
    loader: glob({ pattern: "**/*.md", base: "./src/data/talks" }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
    }),
});

const mastodon = defineCollection({
    loader: mastodonLoader({
        instance: import.meta.env.MASTODON_INSTANCE || 'mastodon.social',
        userId: import.meta.env.MASTODON_USER_ID || '107151811153023138',
        limit: 40
    })
});

export const collections = { blog, reads, talks, mastodon }
