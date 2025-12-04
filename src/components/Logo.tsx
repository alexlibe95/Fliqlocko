import '../styles/logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Logo({ size = 'medium', className = '' }: LogoProps) {
  return (
    <div className={`logo-container logo-${size} ${className}`}>
      <img 
        src="/logo.png" 
        alt="Fliqlocko Logo" 
        className="logo-image"
      />
    </div>
  );
}

