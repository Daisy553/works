import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    dateLabel: z.string().optional(),
    tags: z.array(z.string()).min(1),
    category: z.string(),
    lang: z.enum(['zh', 'en']),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    sample: z.boolean().default(false),
    draft: z.boolean().default(false),
    sort: z.number().default(0),
    sourceItem: z.string().optional(),
  }),
});

export const collections = { posts };
