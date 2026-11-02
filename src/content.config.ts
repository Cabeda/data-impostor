import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { mastodonLoader } from "./loaders/mastodon.js";
import { identityGlob } from "./lib/identity-loader.ts";

const blog = defineCollection({
    // .mdx stays out: its PyScript demo needs a worker-mode terminal, which
    // cross-origin isolation alone did not start. The file is repaired and
    // ready; the component is the blocker, not the glob.
    loader: identityGlob({ collection: "blog", pattern: '**/[^_]*.md', base: "./src/data/blog" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        heroImage: image().optional(),
        heroImageAlt: z.string().optional(),
        mastodonUrl: z.url().optional()
    }),
});
const reads = defineCollection({
    // Load data from Markdown files on disk
    loader: identityGlob({ collection: "reads", pattern: "**/*.md", base: "./src/data/reads" }),
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
