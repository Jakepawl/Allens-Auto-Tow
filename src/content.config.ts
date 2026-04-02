import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    icon: z.string(),
    heroImage: z.string().optional(),
    order: z.number(),
    relatedServices: z.array(z.string()).optional(),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
  }),
});

const brandsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/brands' }),
  schema: z.object({
    brand: z.string(),
    title: z.string(),
    description: z.string(),
    logoIcon: z.string().optional(),
    specialties: z.array(z.string()),
    yearRange: z.string().optional(),
  }),
});

const locationsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    area: z.string(),
    title: z.string(),
    description: z.string(),
    distanceFromShop: z.string().optional(),
    landmarks: z.array(z.string()).optional(),
  }),
});

const testimonialsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    author: z.string(),
    rating: z.number().min(1).max(5),
    date: z.string(),
    service: z.string().optional(),
    vehicle: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    author: z.string().default("Allen's Automotive"),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  services: servicesCollection,
  brands: brandsCollection,
  locations: locationsCollection,
  testimonials: testimonialsCollection,
  blog: blogCollection,
};
