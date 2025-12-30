import { describe, it, expect } from 'vitest';
import {
  loginCredentialsSchema,
  projectInputSchema,
  siteSettingsInputSchema,
  homeLayoutInputSchema,
  writingCategoryInputSchema,
  writingItemInputSchema,
  trackEventSchema,
} from '@ammar-resume/shared';

describe('Zod Validators', () => {
  describe('loginCredentialsSchema', () => {
    it('should accept valid credentials', () => {
      const result = loginCredentialsSchema.safeParse({
        email: 'admin@example.com',
        password: 'securePassword123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = loginCredentialsSchema.safeParse({
        email: 'not-an-email',
        password: 'securePassword123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const result = loginCredentialsSchema.safeParse({
        email: 'admin@example.com',
        password: '1234567', // less than 8 chars
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = loginCredentialsSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('projectInputSchema', () => {
    it('should accept valid project input', () => {
      const result = projectInputSchema.safeParse({
        slug: 'my-project',
        title: 'My Project',
        status: 'PUBLIC',
        featured: true,
        tags: ['react', 'typescript'],
        order: 0,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug format', () => {
      const result = projectInputSchema.safeParse({
        slug: 'Invalid Slug With Spaces',
        title: 'My Project',
        status: 'PUBLIC',
        featured: false,
        tags: [],
        order: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid status enum', () => {
      const result = projectInputSchema.safeParse({
        slug: 'my-project',
        title: 'My Project',
        status: 'INVALID_STATUS',
        featured: false,
        tags: [],
        order: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
      const result = projectInputSchema.safeParse({
        slug: 'my-project',
        title: 'My Project',
        status: 'CONCEPT',
        featured: false,
        tags: [],
        order: 1,
        thumbnailUrl: 'https://example.com/image.png',
        externalUrl: 'https://github.com/example',
        startDate: '2024-01-01',
        endDate: '2024-06-01',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('siteSettingsInputSchema', () => {
    it('should accept valid partial settings', () => {
      const result = siteSettingsInputSchema.safeParse({
        siteName: 'My Portfolio',
        ownerName: 'John Doe',
      });
      expect(result.success).toBe(true);
    });

    it('should accept complete settings', () => {
      const result = siteSettingsInputSchema.safeParse({
        siteName: 'My Portfolio',
        siteDescription: 'A portfolio website',
        ownerName: 'John Doe',
        ownerEmail: 'john@example.com',
        socialLinks: {
          github: 'https://github.com/johndoe',
        },
        theme: {
          fontPrimary: 'Inter',
          fontSecondary: 'Roboto',
          colorBackground: '#ffffff',
          colorForeground: '#000000',
          colorPrimary: '#3b82f6',
          colorAccent: '#f59e0b',
          colorMuted: '#6b7280',
        },
        navigation: [
          { id: 'home', label: 'Home', href: '/', enabled: true, order: 0 },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = siteSettingsInputSchema.safeParse({
        ownerEmail: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('homeLayoutInputSchema', () => {
    it('should accept valid sections array', () => {
      const result = homeLayoutInputSchema.safeParse({
        sections: [
          { id: 'hero-1', type: 'hero', enabled: true, order: 0 },
          { id: 'exp-1', type: 'experience', enabled: true, order: 1 },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid section type', () => {
      const result = homeLayoutInputSchema.safeParse({
        sections: [
          { id: 'invalid-1', type: 'invalid_type', enabled: true, order: 0 },
        ],
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing required section fields', () => {
      const result = homeLayoutInputSchema.safeParse({
        sections: [{ id: 'hero-1' }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('writingCategoryInputSchema', () => {
    it('should accept valid category input', () => {
      const result = writingCategoryInputSchema.safeParse({
        slug: 'technical-articles',
        name: 'Technical Articles',
        enabled: true,
        order: 0,
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = writingCategoryInputSchema.safeParse({
        slug: 'tech',
        name: '',
        enabled: true,
        order: 0,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('writingItemInputSchema', () => {
    it('should accept valid item input', () => {
      const result = writingItemInputSchema.safeParse({
        categoryId: 'cat-123',
        slug: 'my-article',
        title: 'My Article',
        externalUrl: 'https://medium.com/my-article',
        featured: true,
        enabled: true,
        order: 0,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid URL', () => {
      const result = writingItemInputSchema.safeParse({
        categoryId: 'cat-123',
        slug: 'my-article',
        title: 'My Article',
        externalUrl: 'not-a-url',
        featured: false,
        enabled: true,
        order: 0,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('trackEventSchema', () => {
    it('should accept valid event', () => {
      const result = trackEventSchema.safeParse({
        type: 'page_view',
        path: '/projects',
        referrer: 'https://google.com',
        metadata: { projectId: '123' },
      });
      expect(result.success).toBe(true);
    });

    it('should accept minimal event', () => {
      const result = trackEventSchema.safeParse({
        type: 'resume_download',
        path: '/resume',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid event type', () => {
      const result = trackEventSchema.safeParse({
        type: 'invalid_event',
        path: '/',
      });
      expect(result.success).toBe(false);
    });
  });
});
