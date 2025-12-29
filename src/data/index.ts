import type { DataClient } from './types';
import { MockDataClient } from './MockDataClient';
import { HttpDataClient } from './HttpDataClient';

const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'mock';

export function createDataClient(): DataClient {
  return DATA_MODE === 'http' ? new HttpDataClient() : new MockDataClient();
}

export const dataClient = createDataClient();

export * from './types';
export { MockDataClient } from './MockDataClient';
export { HttpDataClient } from './HttpDataClient';