import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('DataClient Switching', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should use MockDataClient when VITE_DATA_MODE is mock', async () => {
    vi.stubEnv('VITE_DATA_MODE', 'mock');
    
    // Dynamic import to pick up new env
    const { createDataClient } = await import('../../data/index');
    const client = createDataClient();
    
    expect(client.constructor.name).toBe('MockDataClient');
  });

  it('should use HttpDataClient when VITE_DATA_MODE is http', async () => {
    vi.stubEnv('VITE_DATA_MODE', 'http');
    
    const { createDataClient } = await import('../../data/index');
    const client = createDataClient();
    
    expect(client.constructor.name).toBe('HttpDataClient');
  });

  it('should default to MockDataClient when VITE_DATA_MODE is unset', async () => {
    vi.stubEnv('VITE_DATA_MODE', undefined);
    
    const { createDataClient } = await import('../../data/index');
    const client = createDataClient();
    
    // Defaults to mock when undefined
    expect(client.constructor.name).toBe('MockDataClient');
  });

  describe('MockDataClient', () => {
    it('should have all required methods', async () => {
      const { MockDataClient } = await import('../../data/MockDataClient');
      const client = new MockDataClient();
      
      // Auth methods
      expect(typeof client.adminLogin).toBe('function');
      expect(typeof client.adminLogout).toBe('function');
      expect(typeof client.getAdminUser).toBe('function');
      
      // Public methods
      expect(typeof client.getSettings).toBe('function');
      expect(typeof client.getHomeLayout).toBe('function');
      expect(typeof client.getProjects).toBe('function');
      expect(typeof client.getProjectBySlug).toBe('function');
      expect(typeof client.getWriting).toBe('function');
      expect(typeof client.trackEvent).toBe('function');
    });
  });

  describe('HttpDataClient', () => {
    it('should have all required methods', async () => {
      const { HttpDataClient } = await import('../../data/HttpDataClient');
      const client = new HttpDataClient();
      
      // Auth methods
      expect(typeof client.adminLogin).toBe('function');
      expect(typeof client.adminLogout).toBe('function');
      expect(typeof client.getAdminUser).toBe('function');
      
      // Public methods
      expect(typeof client.getSettings).toBe('function');
      expect(typeof client.getHomeLayout).toBe('function');
      expect(typeof client.getProjects).toBe('function');
      expect(typeof client.getProjectBySlug).toBe('function');
      expect(typeof client.getWriting).toBe('function');
      expect(typeof client.trackEvent).toBe('function');
    });
  });
});
