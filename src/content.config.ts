import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const notes = defineCollection({
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    displayTitle: z.string().optional(),
    description: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    topLink: z.string().url().optional(),
    topLinkLabel: z.string().optional(),
    featuredImage: z.string().optional(),
  }),
});

export const collections = { notes };
