import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { prisma } from '../setup';
import { hashPassword } from '../../lib/password.js';
import app from '../../index.js';

describe('CRUD Endpoints', () => {
  let authCookie: string;
  let csrfToken: string;

  const testUser = {
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    name: 'Admin User',
  };

  beforeEach(async () => {
    // Create admin user
    const passwordHash = await hashPassword(testUser.password);
    await prisma.adminUser.create({
      data: {
        email: testUser.email,
        passwordHash,
        name: testUser.name,
      },
    });

    // Login to get auth cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const cookies = loginResponse.headers['set-cookie'];
    authCookie = cookies.find((c: string) => c.includes('auth_token'));
    const csrfCookie = cookies.find((c: string) => c.includes('csrf_token'));
    
    // Extract CSRF token from cookie
    const csrfMatch = csrfCookie?.match(/csrf_token=([^;]+)/);
    csrfToken = csrfMatch?.[1] || '';
  });

  describe('Projects CRUD', () => {
    it('should create a project', async () => {
      const projectData = {
        slug: 'test-project',
        title: 'Test Project',
        status: 'PUBLIC',
        featured: true,
        tags: ['react', 'typescript'],
        order: 0,
      };

      const response = await request(app)
        .post('/admin/projects')
        .set('Cookie', authCookie)
        .set('x-csrf-token', csrfToken)
        .send(projectData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('test-project');
      expect(response.body.data.title).toBe('Test Project');
    });

    it('should get all projects', async () => {
      // Create a project first
      await prisma.project.create({
        data: {
          slug: 'existing-project',
          title: 'Existing Project',
          status: 'PUBLIC',
          featured: false,
          tags: [],
          order: 0,
        },
      });

      const response = await request(app)
        .get('/admin/projects')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should update a project', async () => {
      // Create a project
      const project = await prisma.project.create({
        data: {
          slug: 'update-me',
          title: 'Update Me',
          status: 'CONCEPT',
          featured: false,
          tags: [],
          order: 0,
        },
      });

      const response = await request(app)
        .put(`/admin/projects/${project.id}`)
        .set('Cookie', authCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          title: 'Updated Title',
          status: 'PUBLIC',
          featured: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.featured).toBe(true);
    });

    it('should delete a project', async () => {
      const project = await prisma.project.create({
        data: {
          slug: 'delete-me',
          title: 'Delete Me',
          status: 'CONCEPT',
          featured: false,
          tags: [],
          order: 0,
        },
      });

      const response = await request(app)
        .delete(`/admin/projects/${project.id}`)
        .set('Cookie', authCookie)
        .set('x-csrf-token', csrfToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify deleted
      const deleted = await prisma.project.findUnique({
        where: { id: project.id },
      });
      expect(deleted).toBeNull();
    });

    it('should reject CRUD without CSRF token', async () => {
      const response = await request(app)
        .post('/admin/projects')
        .set('Cookie', authCookie)
        // No CSRF token
        .send({
          slug: 'no-csrf',
          title: 'No CSRF',
          status: 'PUBLIC',
          featured: false,
          tags: [],
          order: 0,
        });

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('CSRF_TOKEN_MISSING');
    });
  });

  describe('Writing CRUD', () => {
    it('should create a writing category', async () => {
      const categoryData = {
        slug: 'tech-articles',
        name: 'Technical Articles',
        enabled: true,
        order: 0,
      };

      const response = await request(app)
        .post('/admin/writing/categories')
        .set('Cookie', authCookie)
        .set('x-csrf-token', csrfToken)
        .send(categoryData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('tech-articles');
    });

    it('should create a writing item', async () => {
      // Create category first
      const category = await prisma.writingCategory.create({
        data: {
          slug: 'articles',
          name: 'Articles',
          enabled: true,
          order: 0,
        },
      });

      const itemData = {
        categoryId: category.id,
        slug: 'my-article',
        title: 'My Article',
        externalUrl: 'https://medium.com/my-article',
        featured: true,
        enabled: true,
        order: 0,
      };

      const response = await request(app)
        .post('/admin/writing/items')
        .set('Cookie', authCookie)
        .set('x-csrf-token', csrfToken)
        .send(itemData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('My Article');
    });

    it('should get writing data via public endpoint', async () => {
      // Create default writing settings
      await prisma.writingSettings.create({
        data: {
          pageTitle: 'Writing',
          pageIntro: 'My writings',
        },
      });

      const response = await request(app)
        .get('/public/writing');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('settings');
      expect(response.body.data).toHaveProperty('categories');
    });
  });

  describe('Public Endpoints', () => {
    it('should get projects without auth', async () => {
      await prisma.project.create({
        data: {
          slug: 'public-project',
          title: 'Public Project',
          status: 'PUBLIC',
          featured: true,
          tags: ['demo'],
          order: 0,
        },
      });

      const response = await request(app)
        .get('/public/projects');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get project by slug', async () => {
      await prisma.project.create({
        data: {
          slug: 'my-project',
          title: 'My Project',
          status: 'PUBLIC',
          featured: false,
          tags: [],
          order: 0,
        },
      });

      const response = await request(app)
        .get('/public/projects/my-project');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('my-project');
    });

    it('should track analytics events', async () => {
      const response = await request(app)
        .post('/public/events')
        .send({
          type: 'page_view',
          path: '/projects',
          referrer: 'https://google.com',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);

      // Verify event was created
      const events = await prisma.analyticsEvent.findMany();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('page_view');
    });
  });
});
