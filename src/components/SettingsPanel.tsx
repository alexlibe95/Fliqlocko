import '../styles/settings.css';
import Logo from './Logo';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingChange: (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => void;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onSettingChange, onClose }: SettingsPanelProps) {
  const handleChange = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    onSettingChange(key, value);
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size="small" />
            <h2>Settings</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close settings">
            ×
          </button>
        </div>
        
        <div className="setting-item">
          <label>12-Hour Mode</label>
          <input 
            type="checkbox" 
            checked={!settings.is24Hour} 
            onChange={(e) => handleChange('is24Hour', !e.target.checked)} 
          />
        </div>

        <div className="setting-item">
          <label>Show Seconds</label>
          <input 
            type="checkbox" 
            checked={settings.showSeconds} 
            onChange={(e) => handleChange('showSeconds', e.target.checked)} 
          />
        </div>

        <div className="setting-item">
          <label>Show Date</label>
          <input 
            type="checkbox" 
            checked={settings.showDate} 
            onChange={(e) => handleChange('showDate', e.target.checked)} 
          />
        </div>

        <div className="setting-item">
          <label>Theme</label>
          <div className="radio-group">
            <div className="radio-option">
              <input 
                type="radio" 
                id="theme-auto"
                name="theme" 
                checked={settings.theme === 'auto'} 
                onChange={() => handleChange('theme', 'auto')} 
              />
              <label htmlFor="theme-auto">Auto</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="theme-light"
                name="theme" 
                checked={settings.theme === 'light'} 
                onChange={() => handleChange('theme', 'light')} 
              />
              <label htmlFor="theme-light">Light</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="theme-dark"
                name="theme" 
                checked={settings.theme === 'dark'} 
                onChange={() => handleChange('theme', 'dark')} 
              />
              <label htmlFor="theme-dark">Dark</label>
            </div>
          </div>
        </div>

        <div className="setting-item">
          <label>Animation Speed</label>
          <div className="radio-group">
            <div className="radio-option">
              <input 
                type="radio" 
                id="speed-slow"
                name="speed" 
                checked={settings.animationSpeed === 'slow'} 
                onChange={() => handleChange('animationSpeed', 'slow')} 
              />
              <label htmlFor="speed-slow">Slow</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="speed-normal"
                name="speed" 
                checked={settings.animationSpeed === 'normal'} 
                onChange={() => handleChange('animationSpeed', 'normal')} 
              />
              <label htmlFor="speed-normal">Normal</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="speed-fast"
                name="speed" 
                checked={settings.animationSpeed === 'fast'} 
                onChange={() => handleChange('animationSpeed', 'fast')} 
              />
              <label htmlFor="speed-fast">Fast</label>
            </div>
          </div>
        </div>

        <div className="setting-item">
          <label>Randomize Timing</label>
          <input 
            type="checkbox" 
            checked={settings.randomizeTiming} 
            onChange={(e) => handleChange('randomizeTiming', e.target.checked)} 
          />
        </div>

        <div className="setting-item">
          <label>Brightness ({Math.round(settings.brightness * 100)}%)</label>
          <input 
            type="range" 
            min="0.1" 
            max="1" 
            step="0.05" 
            value={settings.brightness} 
            onChange={(e) => handleChange('brightness', parseFloat(e.target.value))} 
          />
        </div>

        <div className="setting-item">
          <label>Scale ({Math.round(settings.scale * 100)}%)</label>
          <input 
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.05" 
            value={settings.scale} 
            onChange={(e) => handleChange('scale', parseFloat(e.target.value))} 
          />
        </div>

        <div className="setting-item">
          <label>Sound Notifications</label>
          <input 
            type="checkbox" 
            checked={settings.soundNotificationEnabled} 
            onChange={(e) => handleChange('soundNotificationEnabled', e.target.checked)} 
          />
        </div>

        {settings.soundNotificationEnabled && (
          <div className="setting-item">
            <label>Notification Interval ({settings.soundNotificationInterval} min)</label>
            <input 
              type="range" 
              min="1" 
              max="60" 
              step="1" 
              value={settings.soundNotificationInterval} 
              onChange={(e) => handleChange('soundNotificationInterval', parseInt(e.target.value, 10))} 
            />
          </div>
        )}

        <div className="shortcuts-panel">
          <h3>Keyboard Shortcuts</h3>
          <div className="shortcut-item">
            <span>[S]</span>
            <span className="shortcut-key">Settings</span>
          </div>
          <div className="shortcut-item">
            <span>[T]</span>
            <span className="shortcut-key">Theme</span>
          </div>
          <div className="shortcut-item">
            <span>[+/-]</span>
            <span className="shortcut-key">Brightness</span>
          </div>
          <div className="shortcut-item">
            <span>[[/]]</span>
            <span className="shortcut-key">Scale</span>
          </div>
          <div className="shortcut-item">
            <span>[Esc]</span>
            <span className="shortcut-key">Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

