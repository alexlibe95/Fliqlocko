import { useState, useEffect, useCallback, useRef } from 'react';
import FlipClock from './components/FlipClock';
import SettingsPanel from './components/SettingsPanel';
import { ClockEngine } from './utils/clockEngine';
import { loadSettings, saveSettings, getTheme } from './utils/storage';
import { playNotificationSound } from './utils/soundNotification';
import { AppSettings, TimeComponents } from './types';
import './styles/app.css';
import './styles/variables.css';

function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [time, setTime] = useState<TimeComponents>(() => {
    const engine = new ClockEngine();
    return engine.getTimeComponents(settings.is24Hour);
  });
  const [, setCurrentTheme] = useState<'light' | 'dark'>(getTheme(settings));
  const engineRef = useRef<ClockEngine | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastNotificationTimeRef = useRef<number>(Date.now());
  const is24HourRef = useRef<boolean>(settings.is24Hour);
  const settingsRef = useRef<AppSettings>(settings);
  const [notificationCountdown, setNotificationCountdown] = useState<number | null>(null);

  // Update is24Hour ref when it changes
  useEffect(() => {
    is24HourRef.current = settings.is24Hour;
  }, [settings.is24Hour]);

  // Initialize clock engine
  useEffect(() => {
    engineRef.current = new ClockEngine();
    engineRef.current.start();

    const unsubscribe = engineRef.current.onTimeChange(() => {
      if (engineRef.current) {
        // Use ref to always get the latest is24Hour value
        setTime(engineRef.current.getTimeComponents(is24HourRef.current));
      }
    });

    return () => {
      unsubscribe();
      engineRef.current?.stop();
      engineRef.current = null;
    };
  }, [settings.is24Hour]);

  // Update settings ref when settings change
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Update theme
  useEffect(() => {
    const theme = getTheme(settings);
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [settings]);

  // Save settings on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Sound notification timer
  useEffect(() => {
    let isMounted = true;
    
    // Clear any existing timers
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
    if (notificationIntervalRef.current) {
      clearInterval(notificationIntervalRef.current);
      notificationIntervalRef.current = null;
    }

    // Only start timer if notifications are enabled and interval is valid
    if (settings.soundNotificationEnabled && settings.soundNotificationInterval > 0) {
      const intervalMs = settings.soundNotificationInterval * 60 * 1000; // Convert minutes to milliseconds

      // Calculate time until next notification
      const timeSinceLastNotification = Date.now() - lastNotificationTimeRef.current;
      const timeUntilNext = Math.max(0, intervalMs - timeSinceLastNotification);

      // Set initial timeout if we haven't reached the interval yet
      notificationTimerRef.current = setTimeout(() => {
        // Check if component is still mounted before proceeding
        if (!isMounted) return;
        
        playNotificationSound();
        lastNotificationTimeRef.current = Date.now();

        // Then set up recurring interval
        notificationIntervalRef.current = setInterval(() => {
          // Check if component is still mounted before proceeding
          if (!isMounted) {
            if (notificationIntervalRef.current) {
              clearInterval(notificationIntervalRef.current);
              notificationIntervalRef.current = null;
            }
            return;
          }
          playNotificationSound();
          lastNotificationTimeRef.current = Date.now();
        }, intervalMs);
      }, timeUntilNext);
    } else {
      // Reset last notification time when disabled
      lastNotificationTimeRef.current = Date.now();
      setNotificationCountdown(null);
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
        notificationTimerRef.current = null;
      }
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
    };
  }, [settings.soundNotificationEnabled, settings.soundNotificationInterval]);

  // Countdown timer update (updates every second)
  useEffect(() => {
    if (!settings.soundNotificationEnabled || settings.soundNotificationInterval <= 0) {
      setNotificationCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const intervalMs = settings.soundNotificationInterval * 60 * 1000;
      const timeSinceLastNotification = Date.now() - lastNotificationTimeRef.current;
      const remaining = Math.max(0, intervalMs - timeSinceLastNotification);
      const remainingSeconds = Math.ceil(remaining / 1000);
      setNotificationCountdown(remainingSeconds);
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, [settings.soundNotificationEnabled, settings.soundNotificationInterval]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      switch (key) {
        case 's':
          setShowSettings(prev => !prev);
          break;
        case 't': {
          const themes: Array<AppSettings['theme']> = ['auto', 'light', 'dark'];
          // Use ref to get latest theme value
          const currentIndex = themes.indexOf(settingsRef.current.theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setSettings(prev => ({ ...prev, theme: themes[nextIndex] }));
          break;
        }
        case 'escape':
          setShowSettings(false);
          break;
        case '+':
        case '=':
          setSettings(prev => ({
            ...prev,
            brightness: Math.min(1, prev.brightness + 0.05),
          }));
          break;
        case '-':
        case '_':
          setSettings(prev => ({
            ...prev,
            brightness: Math.max(0.1, prev.brightness - 0.05),
          }));
          break;
        case '0':
          setSettings(prev => ({ ...prev, brightness: 1.0 }));
          break;
        case '[':
          setSettings(prev => ({
            ...prev,
            scale: Math.max(0.5, prev.scale - 0.05),
          }));
          break;
        case ']':
          setSettings(prev => ({
            ...prev,
            scale: Math.min(1.5, prev.scale + 0.05),
          }));
          break;
        case 'arrowup':
          setSettings(prev => ({
            ...prev,
            brightness: Math.min(1, prev.brightness + 0.05),
          }));
          break;
        case 'arrowdown':
          setSettings(prev => ({
            ...prev,
            brightness: Math.max(0.1, prev.brightness - 0.05),
          }));
          break;
        case 'arrowleft':
          setSettings(prev => ({
            ...prev,
            scale: Math.max(0.5, prev.scale - 0.05),
          }));
          break;
        case 'arrowright':
          setSettings(prev => ({
            ...prev,
            scale: Math.min(1.5, prev.scale + 0.05),
          }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array - use refs for current values

  const updateSetting = useCallback((key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="app-container">
      <FlipClock 
        time={time} 
        settings={settings} 
        notificationCountdown={notificationCountdown}
      />
      
      {showSettings && (
        <SettingsPanel 
          settings={settings} 
          onSettingChange={updateSetting}
          onClose={() => setShowSettings(false)} 
        />
      )}
      
      {!showSettings && (
        <div className="settings-hint">Press 'S' for settings</div>
      )}
    </div>
  );
}

export default App;

