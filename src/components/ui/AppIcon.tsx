interface AppIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AppIcon({ className = "", size = 'md' }: AppIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} bg-ocean-blue rounded-lg flex items-center justify-center relative overflow-hidden`}>
      {/* Custom Form Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-5 h-5 text-white" 
        viewBox="0 0 24 24" 
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Document outline */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        
        {/* Form elements - checkboxes and lines */}
        <rect x="8" y="12" width="2" height="2" rx="0.5" />
        <line x1="12" y1="13" x2="16" y2="13" />
        
        <rect x="8" y="16" width="2" height="2" rx="0.5" />
        <line x1="12" y1="17" x2="16" y2="17" />
        
        {/* Accent dot for visual interest */}
        <circle cx="9" cy="13" r="0.5" fill="currentColor" />
      </svg>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-deep-blue opacity-20 rounded-lg"></div>
    </div>
  );
} 