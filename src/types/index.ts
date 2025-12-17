export interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
  hours12: number;
  ampm: 'AM' | 'PM';
}

export interface AppSettings {
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  theme: 'auto' | 'light' | 'dark';
  animationSpeed: 'slow' | 'normal' | 'fast';
  randomizeTiming: boolean;
  brightness: number;
  scale: number;
  soundNotificationEnabled: boolean;
  soundNotificationInterval: number; // in minutes
}

export interface StoredSettings {
  version: string;
  settings: AppSettings;
}

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

