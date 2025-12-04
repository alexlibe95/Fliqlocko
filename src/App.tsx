import { useState, useEffect, useCallback, useRef } from 'react';
import FlipClock from './components/FlipClock';
import SettingsPanel from './components/SettingsPanel';
import { ClockEngine } from './utils/clockEngine';
import { loadSettings, saveSettings, getTheme } from './utils/storage';
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

  // Initialize clock engine
  useEffect(() => {
    engineRef.current = new ClockEngine();
    engineRef.current.start();

    const unsubscribe = engineRef.current.onTimeChange(() => {
      if (engineRef.current) {
        setTime(engineRef.current.getTimeComponents(settings.is24Hour));
      }
    });

    return () => {
      unsubscribe();
      engineRef.current?.stop();
    };
  }, [settings.is24Hour]);

  // Update theme
  useEffect(() => {
    const theme = getTheme(settings);
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [settings.theme]);

  // Save settings on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      switch (key) {
        case 's':
          setShowSettings(prev => !prev);
          break;
        case 't':
          const themes: Array<AppSettings['theme']> = ['auto', 'light', 'dark'];
          const currentIndex = themes.indexOf(settings.theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setSettings(prev => ({ ...prev, theme: themes[nextIndex] }));
          break;
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
  }, [settings.theme, settings.brightness, settings.scale]);

  const updateSetting = useCallback((key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="app-container">
      <FlipClock time={time} settings={settings} />
      
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

