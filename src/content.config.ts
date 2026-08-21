import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['case-study', 'coursework', 'research']),
    course: z.string().optional(),
    tags: z.array(z.string()),
    status: z.enum(['complete', 'in-progress']),
    featured: z.boolean().default(false),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { projects };
