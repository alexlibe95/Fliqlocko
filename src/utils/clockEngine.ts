import { TimeComponents } from '../types';

export class ClockEngine {
  private timeReference: number = Date.now();
  private schedulerInterval: number | null = null;
  private rafId: number | null = null;
  private isFocused: boolean = true;
  private lastDisplayedSecond: number = -1;
  private listeners: Set<(time: Date) => void> = new Set();
  private visibilityHandler: (() => void) | null = null;
  private focusHandler: (() => void) | null = null;
  private blurHandler: (() => void) | null = null;

  constructor() {
    this.setupWindowListeners();
  }

  start(): void {
    // Always start scheduler (runs in background)
    this.startScheduler();
    
    // Start visual driver if focused
    if (this.isFocused) {
      this.startVisualDriver();
    }
  }

  stop(): void {
    this.cleanup();
  }

  onTimeChange(callback: (time: Date) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  getCurrentTime(): Date {
    return new Date(this.timeReference);
  }

  getTimeComponents(is24Hour: boolean): TimeComponents {
    const date = new Date(this.timeReference);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    let hours12 = hours;
    let ampm: 'AM' | 'PM' = 'AM';

    if (!is24Hour) {
      hours12 = hours % 12 || 12;
      ampm = hours >= 12 ? 'PM' : 'AM';
    }

    return {
      hours: is24Hour ? hours : hours12,
      minutes,
      seconds,
      hours12,
      ampm,
    };
  }

  private startScheduler(): void {
    this.schedulerInterval = window.setInterval(() => {
      const now = Date.now();
      this.timeReference = now;
      
      const currentSecond = Math.floor(now / 1000);
      
      // Only notify if second changed
      if (currentSecond !== this.lastDisplayedSecond) {
        this.lastDisplayedSecond = currentSecond;
        this.notifyListeners();
      }
    }, 1000);
  }

  private startVisualDriver(): void {
    const update = () => {
      const now = this.timeReference;
      const currentSecond = Math.floor(now / 1000);
      
      if (currentSecond !== this.lastDisplayedSecond) {
        this.lastDisplayedSecond = currentSecond;
        this.notifyListeners();
      }
      
      if (this.isFocused) {
        this.rafId = requestAnimationFrame(update);
      }
    };
    
    this.rafId = requestAnimationFrame(update);
  }

  private notifyListeners(): void {
    const time = new Date(this.timeReference);
    this.listeners.forEach(callback => {
      try {
        callback(time);
      } catch (error) {
        console.error('Error in time change listener:', error);
      }
    });
  }

  private setupWindowListeners(): void {
    // Visibility change
    this.visibilityHandler = () => {
      const isVisible = !document.hidden;
      this.handleFocusChange(isVisible);
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);

    // Focus/blur
    this.focusHandler = () => {
      this.handleFocusChange(true);
    };
    window.addEventListener('focus', this.focusHandler);

    this.blurHandler = () => {
      this.handleFocusChange(false);
    };
    window.addEventListener('blur', this.blurHandler);
  }

  private handleFocusChange(focused: boolean): void {
    this.isFocused = focused;
    
    if (focused) {
      // Window gained focus - sync immediately
      this.timeReference = Date.now();
      this.lastDisplayedSecond = -1; // Force update
      this.notifyListeners();
      
      // Start visual driver
      if (!this.rafId) {
        this.startVisualDriver();
      }
    } else {
      // Window lost focus - stop RAF, scheduler continues
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }

  private cleanup(): void {
    if (this.schedulerInterval !== null) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    // Remove event listeners to prevent memory leaks
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    
    if (this.focusHandler) {
      window.removeEventListener('focus', this.focusHandler);
      this.focusHandler = null;
    }
    
    if (this.blurHandler) {
      window.removeEventListener('blur', this.blurHandler);
      this.blurHandler = null;
    }
    
    this.listeners.clear();
  }
}

