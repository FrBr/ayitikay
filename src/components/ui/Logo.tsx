interface LogoProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className = '', size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Rounded square background */}
      <rect width="32" height="32" rx="8" fill="#1D9E75" />
      {/* House shape */}
      <path
        d="M16 7L6 15h3v10h6v-6h2v6h6V15h3L16 7z"
        fill="white"
      />
    </svg>
  );
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={32} />
      <span className="text-xl font-bold text-slate-900">
        Ayiti<span className="text-[#1D9E75]">Kay</span>
      </span>
    </span>
  );
}
