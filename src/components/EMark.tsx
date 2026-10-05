// The slanted three-stroke E from the cotton bag, drawn from the film until the client sends the vector.
export default function EMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <g transform="rotate(-38 12 12)">
        <rect x="7" y="4" width="3" height="16" rx=".6" />
        <rect x="7" y="4" width="10" height="3" rx=".6" />
        <rect x="7" y="10.5" width="8" height="3" rx=".6" />
        <rect x="7" y="17" width="10" height="3" rx=".6" />
      </g>
    </svg>
  );
}
