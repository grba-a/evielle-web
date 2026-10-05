// Simple geometric glyphs used across the site chrome (two strokes, a bag, a cross, arrows).
type P = { className?: string };

export const MenuIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M4 9h16M4 15h11" />
  </svg>
);

export const BagIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 8h14l-1.2 12H6.2z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const PrevIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.5 6l-6 6 6 6" />
  </svg>
);

export const NextIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.5 6l6 6-6 6" />
  </svg>
);

export const PauseIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="7" y="5.5" width="3.4" height="13" rx="1" />
    <rect x="13.6" y="5.5" width="3.4" height="13" rx="1" />
  </svg>
);

export const PlayIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l10.5-6.5z" />
  </svg>
);
