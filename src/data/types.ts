// Re-export types from shared package
export * from '../../packages/shared/src/types';

// Re-export schemas
export {
  // Schemas
  projectStatusSchema,
  detailLevelSchema,
  analyticsEventTypeSchema,
  homeLayoutSectionTypeSchema,
  themeTokensSchema,
  navItemSchema,
  siteSettingsSchema,
  siteSettingsInputSchema,
  homeLayoutSectionSchema,
  homeLayoutSchema,
  homeLayoutInputSchema,
  projectContentSchema,
  projectContentInputSchema,
  projectSchema,
  projectInputSchema,
  writingItemSchema,
  writingItemInputSchema,
  writingCategorySchema,
  writingCategoryInputSchema,
  writingDataSchema,
  analyticsEventSchema,
  trackEventSchema,
  loginCredentialsSchema,
  adminUserSchema,
  // Input types (from Zod inference)
  type SiteSettingsInput,
  type HomeLayoutInput,
  type ProjectInput,
  type ProjectContentInput,
  type WritingCategoryInput,
  type WritingItemInput,
  type TrackEventInput,
  type LoginInput,
} from '../../packages/shared/src/schemas';

export { type DataClient } from '../../packages/shared/src/client';
