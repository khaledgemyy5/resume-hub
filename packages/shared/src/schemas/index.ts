import { z } from 'zod';

// ============= Enums =============

export const projectStatusSchema = z.enum(['PUBLIC', 'CONFIDENTIAL', 'CONCEPT']);
export const detailLevelSchema = z.enum(['BRIEF', 'STANDARD', 'DEEP']);
export const analyticsEventTypeSchema = z.enum([
  'page_view',
  'project_view',
  'writing_view',
  'external_link_click',
  'contact_click',
]);
export const homeLayoutSectionTypeSchema = z.enum([
  'hero',
  'experience',
  'featuredProjects',
  'skills',
  'writing',
  'contactCta',
]);

// ============= Theme & Nav =============

export const themeTokensSchema = z.object({
  fontPrimary: z.string().min(1),
  fontSecondary: z.string().min(1),
  colorBackground: z.string().min(1),
  colorForeground: z.string().min(1),
  colorPrimary: z.string().min(1),
  colorAccent: z.string().min(1),
  colorMuted: z.string().min(1),
});

export const navItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(50),
  href: z.string().min(1),
  enabled: z.boolean(),
  order: z.number().int().min(0),
});

// ============= Site Settings =============

export const siteSettingsSchema = z.object({
  id: z.string().min(1),
  siteName: z.string().min(1).max(100),
  siteDescription: z.string().max(500),
  ownerName: z.string().min(1).max(100),
  ownerEmail: z.string().email(),
  socialLinks: z.object({
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }),
  theme: themeTokensSchema,
  navigation: z.array(navItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const siteSettingsInputSchema = siteSettingsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

// ============= Home Layout =============

export const homeLayoutSectionSchema = z.object({
  id: z.string().min(1),
  type: homeLayoutSectionTypeSchema,
  enabled: z.boolean(),
  order: z.number().int().min(0),
  config: z.record(z.unknown()).optional(),
});

export const homeLayoutSchema = z.object({
  id: z.string().min(1),
  sections: z.array(homeLayoutSectionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const homeLayoutInputSchema = z.object({
  sections: z.array(homeLayoutSectionSchema),
});

// ============= Project Content =============

export const projectContentSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  detailLevel: detailLevelSchema,
  headline: z.string().min(1).max(200),
  summary: z.string().max(500),
  body: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const projectContentInputSchema = projectContentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============= Project =============

export const projectSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  status: projectStatusSchema,
  featured: z.boolean(),
  tags: z.array(z.string().max(50)),
  thumbnailUrl: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  externalUrl: z.string().url().optional(),
  order: z.number().int().min(0),
  content: z.array(projectContentSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const projectInputSchema = projectSchema.omit({
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
});

// ============= Writing Item =============

export const writingItemSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500),
  body: z.string(),
  published: z.boolean(),
  publishedAt: z.string().optional(),
  order: z.number().int().min(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const writingItemInputSchema = writingItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============= Writing Category =============

export const writingCategorySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0),
  items: z.array(writingItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const writingCategoryInputSchema = writingCategorySchema.omit({
  id: true,
  items: true,
  createdAt: true,
  updatedAt: true,
});

// ============= Writing Data =============

export const writingDataSchema = z.object({
  categories: z.array(writingCategorySchema),
});

// ============= Analytics Event =============

export const analyticsEventSchema = z.object({
  id: z.string().min(1),
  type: analyticsEventTypeSchema,
  path: z.string().min(1),
  referrer: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  timestamp: z.string(),
});

export const trackEventSchema = analyticsEventSchema.omit({
  id: true,
  timestamp: true,
});

// ============= Auth =============

export const loginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const adminUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

// ============= Inferred Types =============

export type SiteSettingsInput = z.infer<typeof siteSettingsInputSchema>;
export type HomeLayoutInput = z.infer<typeof homeLayoutInputSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectContentInput = z.infer<typeof projectContentInputSchema>;
export type WritingCategoryInput = z.infer<typeof writingCategoryInputSchema>;
export type WritingItemInput = z.infer<typeof writingItemInputSchema>;
export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type LoginInput = z.infer<typeof loginCredentialsSchema>;
