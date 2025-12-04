import { useState, useEffect } from 'react';
import '../styles/digit.css';
import { AnimationSpeed } from '../types';

interface FlipDigitProps {
  value: string;
  animationSpeed: AnimationSpeed;
  randomizeTiming: boolean;
}

export default function FlipDigit({ value, animationSpeed, randomizeTiming }: FlipDigitProps) {
  const [animatingValue, setAnimatingValue] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== animatingValue) {
      setFlipping(true);
      
      // Randomize timing if enabled
      const delay = randomizeTiming ? Math.random() * 50 : 0;
      
      const timeout = setTimeout(() => {
        setAnimatingValue(value);
        setFlipping(false);
      }, 600 + delay); // Base duration + random delay

      return () => clearTimeout(timeout);
    }
  }, [value, animatingValue, randomizeTiming]);

  const speedClass = animationSpeed === 'fast' ? 'fast' : animationSpeed === 'slow' ? 'slow' : '';

  return (
    <div className="digit-container">
      {/* Background Top: Shows NEW value */}
      <div className="digit-card top">
        <span className="digit-content">{value}</span>
      </div>
      
      {/* Background Bottom: Shows OLD value */}
      <div className="digit-card bottom">
        <span className="digit-content">{animatingValue}</span>
      </div>
      
      {/* Front Leaf: Shows OLD value, flips down */}
      <div className={`digit-card flip-leaf front ${flipping ? 'flipping' : ''} ${speedClass}`}>
        <span className="digit-content">{animatingValue}</span>
      </div>
      
      {/* Back Leaf: Shows NEW value, flips down */}
      <div className={`digit-card flip-leaf back ${flipping ? 'flipping' : ''} ${speedClass}`}>
        <span className="digit-content">{value}</span>
      </div>
      
      {/* Split line */}
      <div className="split-line"></div>
    </div>
  );
}

