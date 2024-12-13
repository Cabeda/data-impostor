import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/data/blog" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string().optional(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        heroImage: image().optional(),
        heroImageAlt: z.string().optional()
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

export const collections = { blog, reads, talks }