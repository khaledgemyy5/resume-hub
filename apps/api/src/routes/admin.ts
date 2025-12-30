import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import {
  siteSettingsInputSchema,
  homeLayoutInputSchema,
  projectInputSchema,
  projectContentInputSchema,
  writingCategoryInputSchema,
  writingItemInputSchema,
} from '@ammar-resume/shared';
import prisma from '../lib/prisma.js';
import { requireAuth, verifyCsrf, validateBody, validateParams, ApiError } from '../middleware/index.js';

const router = Router();

// All admin routes require authentication
router.use(requireAuth);

// All state-changing routes require CSRF protection
router.use(verifyCsrf);

// ============= Settings =============

/**
 * GET /admin/settings
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
 * PUT /admin/settings
 */
router.put(
  '/settings',
  validateBody(siteSettingsInputSchema),
  async (req: Request, res: Response): Promise<void> => {
    const existing = await prisma.siteSettings.findFirst();
    
    if (!existing) {
      throw new ApiError(404, 'NOT_FOUND', 'Settings not found');
    }
    
    const updated = await prisma.siteSettings.update({
      where: { id: existing.id },
      data: {
        ...req.body,
        socialLinks: req.body.socialLinks as object,
        theme: req.body.theme as object,
        navigation: req.body.navigation as object[],
        seoDefaults: req.body.seoDefaults as object,
        resumeData: req.body.resumeData as object,
        externalLinks: req.body.externalLinks as object[],
      },
    });
    
    res.json({
      success: true,
      data: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  }
);

// ============= Home Layout =============

/**
 * GET /admin/home-layout
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
 * PUT /admin/home-layout
 */
router.put(
  '/home-layout',
  validateBody(homeLayoutInputSchema),
  async (req: Request, res: Response): Promise<void> => {
    const existing = await prisma.homeLayout.findFirst();
    
    if (!existing) {
      throw new ApiError(404, 'NOT_FOUND', 'Home layout not found');
    }
    
    const updated = await prisma.homeLayout.update({
      where: { id: existing.id },
      data: { sections: req.body.sections as object[] },
    });
    
    res.json({
      success: true,
      data: {
        id: updated.id,
        sections: updated.sections,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  }
);

// ============= Projects =============

const idParamSchema = z.object({ id: z.string().uuid() });

/**
 * GET /admin/projects
 */
router.get('/projects', async (_req: Request, res: Response): Promise<void> => {
  const projects = await prisma.project.findMany({
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
 * GET /admin/projects/:id
 */
router.get(
  '/projects/:id',
  validateParams(idParamSchema),
  async (req: Request, res: Response): Promise<void> => {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { content: true },
    });
    
    if (!project) {
      throw new ApiError(404, 'NOT_FOUND', 'Project not found');
    }
    
    res.json({
      success: true,
      data: {
        ...project,
        content: project.content.map((c) => ({
          ...c,
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
 * POST /admin/projects
 */
router.post(
  '/projects',
  validateBody(projectInputSchema),
  async (req: Request, res: Response): Promise<void> => {
    const project = await prisma.project.create({
      data: req.body,
      include: { content: true },
    });
    
    res.status(201).json({
      success: true,
      data: {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
    });
  }
);

/**
 * PUT /admin/projects/:id
 */
router.put(
  '/projects/:id',
  validateParams(idParamSchema),
  validateBody(projectInputSchema.partial()),
  async (req: Request, res: Response): Promise<void> => {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
      include: { content: true },
    });
    
    res.json({
      success: true,
      data: {
        ...project,
        content: project.content.map((c) => ({
          ...c,
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
 * DELETE /admin/projects/:id
 */
router.delete(
  '/projects/:id',
  validateParams(idParamSchema),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: 'Project deleted' } });
  }
);

// ============= Project Content =============

const contentParamsSchema = z.object({
  id: z.string().uuid(),
  contentId: z.string().uuid().optional(),
});

/**
 * POST /admin/projects/:id/content
 */
router.post(
  '/projects/:id/content',
  validateParams(idParamSchema),
  validateBody(projectContentInputSchema.omit({ projectId: true })),
  async (req: Request, res: Response): Promise<void> => {
    const content = await prisma.projectContent.create({
      data: {
        ...req.body,
        projectId: req.params.id,
        sections: req.body.sections as object,
        decisions: req.body.decisions as object[],
        metrics: req.body.metrics as object[],
        media: req.body.media as object[],
      },
    });
    
    res.status(201).json({
      success: true,
      data: {
        ...content,
        createdAt: content.createdAt.toISOString(),
        updatedAt: content.updatedAt.toISOString(),
      },
    });
  }
);

/**
 * PUT /admin/projects/:id/content/:contentId
 */
router.put(
  '/projects/:id/content/:contentId',
  validateParams(contentParamsSchema),
  validateBody(projectContentInputSchema.omit({ projectId: true }).partial()),
  async (req: Request, res: Response): Promise<void> => {
    const content = await prisma.projectContent.update({
      where: { id: req.params.contentId },
      data: {
        ...req.body,
        sections: req.body.sections as object,
        decisions: req.body.decisions as object[],
        metrics: req.body.metrics as object[],
        media: req.body.media as object[],
      },
    });
    
    res.json({
      success: true,
      data: {
        ...content,
        createdAt: content.createdAt.toISOString(),
        updatedAt: content.updatedAt.toISOString(),
      },
    });
  }
);

/**
 * DELETE /admin/projects/:id/content/:contentId
 */
router.delete(
  '/projects/:id/content/:contentId',
  validateParams(contentParamsSchema),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.projectContent.delete({ where: { id: req.params.contentId } });
    res.json({ success: true, data: { message: 'Content deleted' } });
  }
);

// ============= Writing Categories =============

/**
 * GET /admin/writing/categories
 */
router.get('/writing/categories', async (_req: Request, res: Response): Promise<void> => {
  const categories = await prisma.writingCategory.findMany({
    include: { items: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  });
  
  res.json({
    success: true,
    data: categories.map((c) => ({
      ...c,
      items: c.items.map((i) => ({
        ...i,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
  });
});

/**
 * POST /admin/writing/categories
 */
router.post(
  '/writing/categories',
  validateBody(writingCategoryInputSchema),
  async (req: Request, res: Response): Promise<void> => {
    const category = await prisma.writingCategory.create({
      data: req.body,
      include: { items: true },
    });
    
    res.status(201).json({
      success: true,
      data: {
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      },
    });
  }
);

/**
 * PUT /admin/writing/categories/:id
 */
router.put(
  '/writing/categories/:id',
  validateParams(idParamSchema),
  validateBody(writingCategoryInputSchema.partial()),
  async (req: Request, res: Response): Promise<void> => {
    const category = await prisma.writingCategory.update({
      where: { id: req.params.id },
      data: req.body,
      include: { items: true },
    });
    
    res.json({
      success: true,
      data: {
        ...category,
        items: category.items.map((i) => ({
          ...i,
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.updatedAt.toISOString(),
        })),
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      },
    });
  }
);

/**
 * DELETE /admin/writing/categories/:id
 */
router.delete(
  '/writing/categories/:id',
  validateParams(idParamSchema),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.writingCategory.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: 'Category deleted' } });
  }
);

// ============= Writing Items =============

/**
 * POST /admin/writing/items
 */
router.post(
  '/writing/items',
  validateBody(writingItemInputSchema),
  async (req: Request, res: Response): Promise<void> => {
    const item = await prisma.writingItem.create({ data: req.body });
    
    res.status(201).json({
      success: true,
      data: {
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    });
  }
);

/**
 * PUT /admin/writing/items/:id
 */
router.put(
  '/writing/items/:id',
  validateParams(idParamSchema),
  validateBody(writingItemInputSchema.partial()),
  async (req: Request, res: Response): Promise<void> => {
    const item = await prisma.writingItem.update({
      where: { id: req.params.id },
      data: req.body,
    });
    
    res.json({
      success: true,
      data: {
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    });
  }
);

/**
 * DELETE /admin/writing/items/:id
 */
router.delete(
  '/writing/items/:id',
  validateParams(idParamSchema),
  async (req: Request, res: Response): Promise<void> => {
    await prisma.writingItem.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: { message: 'Item deleted' } });
  }
);

// ============= Analytics =============

const analyticsQuerySchema = z.object({
  days: z.string().regex(/^\d+$/).transform(Number).optional().default('30'),
});

/**
 * GET /admin/analytics
 */
router.get('/analytics', async (req: Request, res: Response): Promise<void> => {
  const { days } = analyticsQuerySchema.parse(req.query);
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  const events = await prisma.analyticsEvent.findMany({
    where: { timestamp: { gte: since } },
  });
  
  // Compute summary
  const totalViews = events.filter((e) => e.type === 'page_view').length;
  const resumeDownloads = events.filter((e) => e.type === 'resume_download').length;
  const contactClicks = events.filter((e) => e.type === 'contact_click').length;
  const writingClicks = events.filter((e) => e.type === 'writing_click').length;
  
  // Top projects
  const projectViews = events.filter((e) => e.type === 'project_view');
  const projectCounts: Record<string, number> = {};
  for (const e of projectViews) {
    const slug = e.path.replace('/projects/', '');
    projectCounts[slug] = (projectCounts[slug] || 0) + 1;
  }
  
  const topProjects = Object.entries(projectCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([slug, views]) => ({ slug, title: slug, views }));
  
  res.json({
    success: true,
    data: {
      totalViews,
      topProjects,
      resumeDownloads,
      contactClicks,
      writingClicks,
    },
  });
});

export default router;
