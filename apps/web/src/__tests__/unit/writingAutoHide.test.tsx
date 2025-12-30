import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { HomeLayoutSection, WritingData } from '../../data/types';
import { WritingSection } from '../../components/home/WritingSection';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Writing Auto-Hide Logic', () => {
  const createSection = (): HomeLayoutSection => ({
    id: 'writing-1',
    type: 'writing',
    enabled: true,
    order: 0,
  });

  it('should hide section when writingData is null', () => {
    const { container } = render(
      <Wrapper>
        <WritingSection section={createSection()} writingData={null} />
      </Wrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should hide section when categories array is empty', () => {
    const writingData: WritingData = {
      settings: { pageTitle: 'Writing', pageIntro: '' },
      categories: [],
    };

    const { container } = render(
      <Wrapper>
        <WritingSection section={createSection()} writingData={writingData} />
      </Wrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should hide section when all categories are disabled', () => {
    const writingData: WritingData = {
      settings: { pageTitle: 'Writing', pageIntro: '' },
      categories: [
        {
          id: 'cat-1',
          slug: 'disabled',
          name: 'Disabled',
          enabled: false,
          order: 0,
          items: [
            {
              id: 'item-1',
              categoryId: 'cat-1',
              slug: 'article',
              title: 'Article',
              externalUrl: 'https://example.com',
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
        <WritingSection section={createSection()} writingData={writingData} />
      </Wrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should hide section when no items are featured AND enabled', () => {
    const writingData: WritingData = {
      settings: { pageTitle: 'Writing', pageIntro: '' },
      categories: [
        {
          id: 'cat-1',
          slug: 'active',
          name: 'Active',
          enabled: true,
          order: 0,
          items: [
            // Featured but disabled
            {
              id: 'item-1',
              categoryId: 'cat-1',
              slug: 'disabled',
              title: 'Disabled Featured',
              externalUrl: 'https://example.com',
              featured: true,
              enabled: false,
              order: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            // Enabled but not featured
            {
              id: 'item-2',
              categoryId: 'cat-1',
              slug: 'not-featured',
              title: 'Enabled Not Featured',
              externalUrl: 'https://example.com',
              featured: false,
              enabled: true,
              order: 1,
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
        <WritingSection section={createSection()} writingData={writingData} />
      </Wrapper>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show section when at least one item is featured AND enabled in enabled category', () => {
    const writingData: WritingData = {
      settings: { pageTitle: 'Writing', pageIntro: '' },
      categories: [
        {
          id: 'cat-1',
          slug: 'active',
          name: 'Active',
          enabled: true,
          order: 0,
          items: [
            {
              id: 'item-1',
              categoryId: 'cat-1',
              slug: 'visible',
              title: 'Visible Article',
              externalUrl: 'https://example.com',
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
        <WritingSection section={createSection()} writingData={writingData} />
      </Wrapper>
    );

    expect(container.firstChild).not.toBeNull();
  });

  it('should limit displayed items to 4', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      categoryId: 'cat-1',
      slug: `article-${i}`,
      title: `Article ${i}`,
      externalUrl: 'https://example.com',
      featured: true,
      enabled: true,
      order: i,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const writingData: WritingData = {
      settings: { pageTitle: 'Writing', pageIntro: '' },
      categories: [
        {
          id: 'cat-1',
          slug: 'active',
          name: 'Active',
          enabled: true,
          order: 0,
          items,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    const { container } = render(
      <Wrapper>
        <WritingSection section={createSection()} writingData={writingData} />
      </Wrapper>
    );

    // Should only render 4 items (check for links)
    const links = container.querySelectorAll('a[href="https://example.com"]');
    // 4 items + 1 "View all writing" link
    expect(links.length).toBe(5);
  });
});
