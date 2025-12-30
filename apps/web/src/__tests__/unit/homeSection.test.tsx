import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { HomeLayoutSection, WritingData } from '../../data/types';

// Import sections
import { HeroSection } from '../../components/home/HeroSection';
import { WritingSection } from '../../components/home/WritingSection';
import { ExperienceSection } from '../../components/home/ExperienceSection';

// Wrapper for routing
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Home Section Rendering', () => {
  describe('HeroSection', () => {
    it('should render with owner name', () => {
      const section: HomeLayoutSection = {
        id: 'hero-1',
        type: 'hero',
        enabled: true,
        order: 0,
      };

      render(
        <Wrapper>
          <HeroSection section={section} ownerName="John Doe" />
        </Wrapper>
      );

      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    it('should render with title override', () => {
      const section: HomeLayoutSection = {
        id: 'hero-1',
        type: 'hero',
        enabled: true,
        order: 0,
        titleOverride: 'Welcome to My Portfolio',
      };

      render(
        <Wrapper>
          <HeroSection section={section} ownerName="John Doe" />
        </Wrapper>
      );

      expect(screen.getByText(/Welcome to My Portfolio/i)).toBeInTheDocument();
    });
  });

  describe('ExperienceSection', () => {
    it('should render section title', () => {
      const section: HomeLayoutSection = {
        id: 'exp-1',
        type: 'experience',
        enabled: true,
        order: 1,
        titleOverride: 'Work Experience',
      };

      render(
        <Wrapper>
          <ExperienceSection section={section} />
        </Wrapper>
      );

      expect(screen.getByText(/Work Experience/i)).toBeInTheDocument();
    });
  });

  describe('WritingSection', () => {
    it('should render featured writing items', () => {
      const section: HomeLayoutSection = {
        id: 'writing-1',
        type: 'writing',
        enabled: true,
        order: 2,
      };

      const writingData: WritingData = {
        settings: {
          pageTitle: 'Writing',
          pageIntro: 'My writings',
        },
        categories: [
          {
            id: 'cat-1',
            slug: 'articles',
            name: 'Articles',
            enabled: true,
            order: 0,
            items: [
              {
                id: 'item-1',
                categoryId: 'cat-1',
                slug: 'featured-article',
                title: 'Featured Article Title',
                externalUrl: 'https://example.com/article',
                featured: true,
                enabled: true,
                order: 0,
                platform: 'Medium',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      render(
        <Wrapper>
          <WritingSection section={section} writingData={writingData} />
        </Wrapper>
      );

      expect(screen.getByText('Featured Article Title')).toBeInTheDocument();
      expect(screen.getByText('(Medium)')).toBeInTheDocument();
    });

    it('should return null when no featured items', () => {
      const section: HomeLayoutSection = {
        id: 'writing-1',
        type: 'writing',
        enabled: true,
        order: 2,
      };

      const writingData: WritingData = {
        settings: {
          pageTitle: 'Writing',
          pageIntro: 'My writings',
        },
        categories: [
          {
            id: 'cat-1',
            slug: 'articles',
            name: 'Articles',
            enabled: true,
            order: 0,
            items: [], // No items
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      const { container } = render(
        <Wrapper>
          <WritingSection section={section} writingData={writingData} />
        </Wrapper>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should filter out disabled categories', () => {
      const section: HomeLayoutSection = {
        id: 'writing-1',
        type: 'writing',
        enabled: true,
        order: 2,
      };

      const writingData: WritingData = {
        settings: {
          pageTitle: 'Writing',
          pageIntro: 'My writings',
        },
        categories: [
          {
            id: 'cat-1',
            slug: 'disabled-category',
            name: 'Disabled Category',
            enabled: false, // Disabled
            order: 0,
            items: [
              {
                id: 'item-1',
                categoryId: 'cat-1',
                slug: 'hidden-article',
                title: 'Hidden Article',
                externalUrl: 'https://example.com/hidden',
                featured: true,
                enabled: true,
                order: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      const { container } = render(
        <Wrapper>
          <WritingSection section={section} writingData={writingData} />
        </Wrapper>
      );

      // Should return null because category is disabled
      expect(container.firstChild).toBeNull();
    });

    it('should filter out non-featured items', () => {
      const section: HomeLayoutSection = {
        id: 'writing-1',
        type: 'writing',
        enabled: true,
        order: 2,
      };

      const writingData: WritingData = {
        settings: {
          pageTitle: 'Writing',
          pageIntro: 'My writings',
        },
        categories: [
          {
            id: 'cat-1',
            slug: 'articles',
            name: 'Articles',
            enabled: true,
            order: 0,
            items: [
              {
                id: 'item-1',
                categoryId: 'cat-1',
                slug: 'non-featured',
                title: 'Non Featured Article',
                externalUrl: 'https://example.com/article',
                featured: false, // Not featured
                enabled: true,
                order: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      const { container } = render(
        <Wrapper>
          <WritingSection section={section} writingData={writingData} />
        </Wrapper>
      );

      // Should return null because no featured items
      expect(container.firstChild).toBeNull();
    });

    it('should filter out disabled items', () => {
      const section: HomeLayoutSection = {
        id: 'writing-1',
        type: 'writing',
        enabled: true,
        order: 2,
      };

      const writingData: WritingData = {
        settings: {
          pageTitle: 'Writing',
          pageIntro: 'My writings',
        },
        categories: [
          {
            id: 'cat-1',
            slug: 'articles',
            name: 'Articles',
            enabled: true,
            order: 0,
            items: [
              {
                id: 'item-1',
                categoryId: 'cat-1',
                slug: 'disabled-article',
                title: 'Disabled Article',
                externalUrl: 'https://example.com/article',
                featured: true,
                enabled: false, // Disabled
                order: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      const { container } = render(
        <Wrapper>
          <WritingSection section={section} writingData={writingData} />
        </Wrapper>
      );

      // Should return null because item is disabled
      expect(container.firstChild).toBeNull();
    });
  });
});
