import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each article is one Markdown file in src/content/articles.
// The voice-note pipeline can later commit new files here; Netlify rebuilds the site on every push.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    date: z.coerce.date(),
    topic: z.enum(['estates', 'wills', 'planning', 'ask-magda']),
    /** true = written but not yet approved by Magda. Drafts never build into the live site. */
    draft: z.boolean().default(true),
    /** Approval log for the 5-year advertising record: who approved, when. */
    approvedBy: z.string().optional(),
    approvedOn: z.coerce.date().optional(),
    legal: z.boolean().default(false),
  }),
});

export const collections = { articles };
