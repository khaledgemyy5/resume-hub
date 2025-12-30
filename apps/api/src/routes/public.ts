import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { trackEventSchema } from '@ammar-resume/shared';
import prisma from '../lib/prisma.js';
import { validateBody, validateParams, ApiError } from '../middleware/index.js';

const router = Router();

/**
 * GET /public/settings
 * Get site settings (public fields only)
 */
router.get('/settings', async (_req: Request, res: Response): Promise<void> => {
  const settings = await prisma.siteSettings.findFirst();
  
  if (!settings) {
    throw new ApiError(404, 'NOT_FOUND', 'Settings not found');
  }
  
  res.json({
    success: true,
    data: {
      id: settings.id,
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      ownerName: settings.ownerName,
      ownerEmail: settings.ownerEmail,
      ownerTitle: settings.ownerTitle,
      socialLinks: settings.socialLinks,
      theme: settings.theme,
      navigation: settings.navigation,
      seoDefaults: settings.seoDefaults,
      faviconUrl: settings.faviconUrl,
      appleTouchIconUrl: settings.appleTouchIconUrl,
      resumePdfUrl: settings.resumePdfUrl,
      resumeData: settings.resumeData,
      calendarUrl: settings.calendarUrl,
      externalLinks: settings.externalLinks,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    },
  });
});

/**
 * GET /public/home-layout
 * Get home page layout configuration
 */
router.get('/home-layout', async (_req: Request, res: Response): Promise<void> => {
  const layout = await prisma.homeLayout.findFirst();
  
  if (!layout) {
    throw new ApiError(404, 'NOT_FOUND', 'Home layout not found');
  }
  
  res.json({
    success: true,
    data: {
      id: layout.id,
      sections: layout.sections,
      createdAt: layout.createdAt.toISOString(),
      updatedAt: layout.updatedAt.toISOString(),
    },
  });
});

/**
 * GET /public/projects
 * Get all public projects
 */
router.get('/projects', async (_req: Request, res: Response): Promise<void> => {
  const projects = await prisma.project.findMany({
    where: { status: 'PUBLIC' },
    include: { content: true },
    orderBy: { order: 'asc' },
  });
  
  const data = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    status: p.status,
    featured: p.featured,
    tags: p.tags,
    thumbnailUrl: p.thumbnailUrl,
    startDate: p.startDate,
    endDate: p.endDate,
    externalUrl: p.externalUrl,
    order: p.order,
    relatedProjectSlugs: p.relatedProjectSlugs,
    content: p.content.map((c) => ({
      id: c.id,
      projectId: c.projectId,
      detailLevel: c.detailLevel,
      headline: c.headline,
      summary: c.summary,
      body: c.body,
      sections: c.sections,
      decisions: c.decisions,
      metrics: c.metrics,
      media: c.media,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
  
  res.json({ success: true, data });
});

/**
 * GET /public/projects/:slug
 * Get a single project by slug
 */
const slugParamSchema = z.object({
  slug: z.string().min(1).max(100),
});

router.get(
  '/projects/:slug',
  validateParams(slugParamSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { slug, status: 'PUBLIC' },
      include: { content: true },
    });
    
    if (!project) {
      throw new ApiError(404, 'NOT_FOUND', 'Project not found');
    }
    
    res.json({
      success: true,
      data: {
        id: project.id,
        slug: project.slug,
        title: project.title,
        status: project.status,
        featured: project.featured,
        tags: project.tags,
        thumbnailUrl: project.thumbnailUrl,
        startDate: project.startDate,
        endDate: project.endDate,
        externalUrl: project.externalUrl,
        order: project.order,
        relatedProjectSlugs: project.relatedProjectSlugs,
        content: project.content.map((c) => ({
          id: c.id,
          projectId: c.projectId,
          detailLevel: c.detailLevel,
          headline: c.headline,
          summary: c.summary,
          body: c.body,
          sections: c.sections,
          decisions: c.decisions,
          metrics: c.metrics,
          media: c.media,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        })),
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
    });
  }
);

/**
 * GET /public/writing
 * Get writing data (enabled categories and items only)
 */
router.get('/writing', async (_req: Request, res: Response): Promise<void> => {
  const [settings, categories] = await Promise.all([
    prisma.writingSettings.findFirst(),
    prisma.writingCategory.findMany({
      where: { enabled: true },
      include: {
        items: {
          where: { enabled: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    }),
  ]);
  
  res.json({
    success: true,
    data: {
      settings: settings || { pageTitle: 'Selected Writing', pageIntro: '' },
      categories: categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        enabled: c.enabled,
        order: c.order,
        items: c.items.map((i) => ({
          id: i.id,
          categoryId: i.categoryId,
          slug: i.slug,
          title: i.title,
          externalUrl: i.externalUrl,
          platform: i.platform,
          featured: i.featured,
          enabled: i.enabled,
          whyThisMatters: i.whyThisMatters,
          order: i.order,
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.updatedAt.toISOString(),
        })),
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    },
  });
});

/**
 * POST /public/events
 * Track analytics event
 */
router.post(
  '/events',
  validateBody(trackEventSchema),
  async (req: Request, res: Response): Promise<void> => {
    const { type, path, referrer, metadata } = req.body;
    
    await prisma.analyticsEvent.create({
      data: {
        type,
        path,
        referrer,
        metadata: metadata as object,
      },
    });
    
    res.status(201).json({
      success: true,
      data: { message: 'Event tracked' },
    });
  }
);

export default router;
