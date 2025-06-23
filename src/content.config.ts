import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { notionLoader } from "notion-astro-loader";
import {
    notionPageSchema,
    transformedPropertySchema,
} from "notion-astro-loader/schemas";

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

const database = defineCollection({
    loader: notionLoader({
        auth: import.meta.env.NOTION_TOKEN,
        database_id: import.meta.env.NOTION_DATABASE_ID,
        filter: {
            property: "Published",
            checkbox: { equals: true },
        },
    }),
    schema: notionPageSchema({
        properties: z.object({
            "Name": transformedPropertySchema.title,
            pubDate: transformedPropertySchema.created_time.pipe(z.coerce.date()),
            description: transformedPropertySchema.rich_text.optional(),
            tags: z.array(z.string()).optional(),
            heroImageAlt: z.string().optional()
        })
    }),
});

export const collections = { blog, reads, talks, database }
