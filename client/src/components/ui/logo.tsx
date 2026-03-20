interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = "", size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-[46px] h-[46px]',
    lg: 'w-16 h-16'
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-white border border-slate-100 rounded-xl shadow-sm relative overflow-hidden group focus:outline-none focus:ring-0`}>
      {/* Subtle light pulse background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/30 opacity-100 group-hover:opacity-80 transition-opacity duration-300"></div>

      <svg
        viewBox="0 0 40 40"
        className={`${iconSizeClasses[size]} text-slate-900 fill-current relative z-10 group-hover:scale-110 transition-transform duration-300`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Calculator base - Transitioned to Slate-900 (Black) */}
        <rect x="8" y="10" width="24" height="24" rx="3" className="fill-none stroke-slate-900 stroke-[2] opacity-100" />

        {/* Screen */}
        <rect x="11" y="13" width="18" height="6" rx="1.5" className="fill-slate-100/50 stroke-slate-900 stroke-[0.5]" />

        {/* Buttons grid - Professional Contrast */}
        <circle cx="14" cy="24" r="1.5" className="fill-slate-900" />
        <circle cx="20" cy="24" r="1.5" className="fill-slate-900" />
        <circle cx="26" cy="24" r="1.5" className="fill-slate-900" />

        <circle cx="14" cy="29" r="1.5" className="fill-slate-900" />
        <circle cx="20" cy="29" r="1.5" className="fill-slate-900" />
        <circle cx="26" cy="29" r="1.5" className="fill-blue-600" />

        {/* Logo text accent */}
        <path d="M18 8 L22 8" className="stroke-slate-900 stroke-[2] stroke-round" />
      </svg>
    </div>
  );
}