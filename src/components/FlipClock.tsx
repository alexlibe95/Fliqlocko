import { useMemo } from 'react';
import FlipDigit from './FlipDigit';
import '../styles/clock.css';
import { TimeComponents, AppSettings } from '../types';

interface FlipClockProps {
  time: TimeComponents;
  settings: AppSettings;
  notificationCountdown: number | null;
}

export default function FlipClock({ time, settings, notificationCountdown }: FlipClockProps) {
  const digitValues = useMemo(() => {
    const formatNumber = (num: number): string => {
      return String(num).padStart(2, '0');
    };

    const hoursStr = formatNumber(time.hours);
    const minutesStr = formatNumber(time.minutes);
    const secondsStr = formatNumber(time.seconds);

    return {
      hours: [hoursStr[0], hoursStr[1]],
      minutes: [minutesStr[0], minutesStr[1]],
      seconds: [secondsStr[0], secondsStr[1]],
    };
  }, [time]);

  const dateString = useMemo(() => {
    if (!settings.showDate) return null;
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, [settings.showDate]);

  return (
    <div 
      className="clock-container"
      style={{
        transform: `scale(${settings.scale})`,
        opacity: settings.brightness,
      }}
    >
      <div className="clock-group">
        <FlipDigit 
          value={digitValues.hours[0]} 
          animationSpeed={settings.animationSpeed}
          randomizeTiming={settings.randomizeTiming}
        />
        <FlipDigit 
          value={digitValues.hours[1]} 
          animationSpeed={settings.animationSpeed}
          randomizeTiming={settings.randomizeTiming}
        />
      </div>
      
      <div className="clock-separator">:</div>
      
      <div className="clock-group">
        <FlipDigit 
          value={digitValues.minutes[0]} 
          animationSpeed={settings.animationSpeed}
          randomizeTiming={settings.randomizeTiming}
        />
        <FlipDigit 
          value={digitValues.minutes[1]} 
          animationSpeed={settings.animationSpeed}
          randomizeTiming={settings.randomizeTiming}
        />
      </div>
      
      {settings.showSeconds && (
        <>
          <div className="clock-separator">:</div>
          <div className="clock-group">
            <FlipDigit 
              value={digitValues.seconds[0]} 
              animationSpeed={settings.animationSpeed}
              randomizeTiming={settings.randomizeTiming}
            />
            <FlipDigit 
              value={digitValues.seconds[1]} 
              animationSpeed={settings.animationSpeed}
              randomizeTiming={settings.randomizeTiming}
            />
          </div>
        </>
      )}
      
      {notificationCountdown !== null && (
        <div className="notification-countdown">
          {Math.floor(notificationCountdown / 60)}:{(notificationCountdown % 60).toString().padStart(2, '0')}
        </div>
      )}
      {dateString && (
        <div className="date-display">{dateString}</div>
      )}
    </div>
  );
}

