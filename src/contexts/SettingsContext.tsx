import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { dataClient } from '@/data';
import type { SiteSettings, WritingData } from '@/data/types';

interface SettingsContextValue {
  settings: SiteSettings | null;
  writingData: WritingData | null;
  isLoading: boolean;
  error: Error | null;
  isDark: boolean;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [writingData, setWritingData] = useState<WritingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [settingsData, writing] = await Promise.all([
          dataClient.getPublicSettings(),
          dataClient.getWritingData(),
        ]);
        setSettings(settingsData);
        setWritingData(writing);

        // Apply theme from settings
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load settings'));
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <SettingsContext.Provider value={{ settings, writingData, isLoading, error, isDark, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
