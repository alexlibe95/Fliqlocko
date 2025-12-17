import { AppSettings, StoredSettings } from '../types';

const STORAGE_KEY = 'flipclock-settings';
const VERSION = '1.0';

const defaultSettings: AppSettings = {
  is24Hour: false,
  showSeconds: false,
  showDate: false,
  theme: 'auto',
  animationSpeed: 'normal',
  randomizeTiming: false,
  brightness: 1.0,
  scale: 1.0,
  soundNotificationEnabled: false,
  soundNotificationInterval: 5, // default 5 minutes
};

export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultSettings;
    }

    const parsed: StoredSettings = JSON.parse(stored);
    
    // Version check - migrate if needed
    if (parsed.version !== VERSION) {
      return migrateSettings(parsed.settings);
    }

    return { ...defaultSettings, ...parsed.settings };
  } catch (error) {
    console.warn('Failed to load settings:', error);
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    const stored: StoredSettings = {
      version: VERSION,
      settings,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
}

function migrateSettings(oldSettings: Partial<AppSettings>): AppSettings {
  // Migration logic for future versions
  return { ...defaultSettings, ...oldSettings };
}

export function getTheme(settings: AppSettings): 'light' | 'dark' {
  if (settings.theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return settings.theme;
}

