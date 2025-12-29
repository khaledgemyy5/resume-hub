// Shared utility functions

/**
 * Format a date for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    ...options,
  });
}

/**
 * Format a date range (e.g., "Jan 2020 - Present")
 */
export function formatDateRange(
  startDate: Date | string,
  endDate?: Date | string | null,
  current = false
): string {
  const start = formatDate(startDate);
  if (current || !endDate) {
    return `${start} - Present`;
  }
  return `${start} - ${formatDate(endDate)}`;
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Group items by a key
 */
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Sort items by order field
 */
export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

/**
 * Generate a random ID (for client-side use only)
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a value is empty (null, undefined, empty string, or empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Create API response object
 */
export function createApiResponse<T>(
  data: T,
  meta?: { requestId?: string; pagination?: object }
): {
  success: true;
  data: T;
  meta: { timestamp: string; requestId: string };
} {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: meta?.requestId || generateId(),
      ...meta,
    },
  };
}

/**
 * Create API error response
 */
export function createApiError(
  code: string,
  message: string,
  details?: Record<string, unknown>
): {
  success: false;
  error: { code: string; message: string; details?: Record<string, unknown> };
  meta: { timestamp: string };
} {
  return {
    success: false,
    error: { code, message, details },
    meta: { timestamp: new Date().toISOString() },
  };
}
