import '../styles/logo.css';
import logoImage from '../assets/logo.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Logo({ size = 'medium', className = '' }: LogoProps) {
  return (
    <div className={`logo-container logo-${size} ${className}`}>
      <img 
        src={logoImage} 
        alt="Fliqlocko Logo" 
        className="logo-image"
      />
    </div>
  );
}

