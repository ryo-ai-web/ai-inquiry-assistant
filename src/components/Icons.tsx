/** 線のアイコン（24x24・currentColor）。装飾用なので aria-hidden。 */
type P = { className?: string };
const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconInbox = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 13l2.5-7h11L20 13v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5Z" />
    <path d="M4 13h4.5l1.5 2.5h4l1.5-2.5H20" />
  </svg>
);
export const IconTag = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9-8-8Z" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </svg>
);
export const IconSummary = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="4.5" y="3.5" width="15" height="17" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);
export const IconFlag = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
  </svg>
);
export const IconChecklist = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 6.5l1.5 1.5L8.5 5M4 12.5l1.5 1.5 3-3M4 18.5l1.5 1.5 3-3M11.5 7h8.5M11.5 13h8.5M11.5 19h8.5" />
  </svg>
);
export const IconPen = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 20l1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3" />
  </svg>
);
export const IconTone = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 7h10M4 17h6M18 7h2M14 17h6" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="12" cy="17" r="2" />
  </svg>
);
export const IconCopy = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </svg>
);
export const IconPlay = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10.5 9l4.5 3-4.5 3V9Z" />
  </svg>
);
export const IconShield = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 3.5l7 2.5v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
export const IconUserCheck = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="10" cy="8" r="3.5" />
    <path d="M3.5 20c.5-3.5 3.2-5.5 6.5-5.5 1.3 0 2.5.3 3.5.9M15.5 18l2 2 3.5-3.5" />
  </svg>
);
export const IconCode = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14" />
  </svg>
);
export const IconClock = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const IconArrowRight = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconCheck = ({ className }: P) => (
  <svg {...base} className={className} strokeWidth={2.4}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const IconAlert = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5.5M12 16.2v.3" />
  </svg>
);

/** 緑の丸の中にアイコンを置く */
export function IconBadge({ children, size = "md" }: { children: React.ReactNode; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-14 w-14 [&>svg]:h-7 [&>svg]:w-7" : size === "sm" ? "h-9 w-9 [&>svg]:h-5 [&>svg]:w-5" : "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6";
  return <span className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand ${s}`}>{children}</span>;
}
