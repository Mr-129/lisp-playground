import type { ReactNode, SVGProps } from 'react';

type IconName =
  | 'learn'
  | 'guide'
  | 'glossary'
  | 'editor'
  | 'terminal'
  | 'updates'
  | 'contact'
  | 'spark'
  | 'problem'
  | 'bookmark'
  | 'lock'
  | 'check'
  | 'hint'
  | 'solution'
  | 'note'
  | 'clear'
  | 'back'
  | 'compass'
  | 'reference'
  | 'check-circle'
  | 'x-circle'
  | 'warning'
  | 'chevron-left'
  | 'chevron-right'
  | 'play';

const ICONS: Record<IconName, ReactNode> = {
  learn: (
    <>
      <path d="M4.75 6.25h5.5c1.9 0 3.67.87 4.75 2.35v10.4a6.02 6.02 0 0 0-4.75-2.17h-5.5z" />
      <path d="M19.25 6.25h-5.5c-1.9 0-3.67.87-4.75 2.35v10.4a6.02 6.02 0 0 1 4.75-2.17h5.5z" />
    </>
  ),
  guide: (
    <>
      <path d="M5.25 5.5h7.25c1.66 0 3.16.78 4.12 2v11.75a5.25 5.25 0 0 0-4.12-1.9H5.25z" />
      <path d="M16.62 7.5v8.75l-2.62-1.65-2.63 1.65V7.5" />
    </>
  ),
  glossary: (
    <>
      <rect x="4.5" y="5.5" width="9" height="13" rx="2" />
      <path d="M9 8.75h2.5" />
      <path d="M9 11.75h2.5" />
      <path d="M14.5 8.5h5a2 2 0 0 1 2 2V18.5h-7" />
      <path d="M17 11.75h2.5" />
      <path d="M17 14.75h2.5" />
    </>
  ),
  editor: (
    <>
      <path d="M4 20l4.5-1 9.75-9.75-3.5-3.5L5 15.5 4 20Z" />
      <path d="M13.75 6.75l3.5 3.5" />
      <path d="M12 20h8" />
    </>
  ),
  terminal: (
    <>
      <rect x="3.5" y="4.5" width="17" height="14" rx="2.5" />
      <path d="M7 9.5l3 3-3 3" />
      <path d="M12.5 15.5h4.5" />
    </>
  ),
  updates: (
    <>
      <path d="M8.5 17.5h7" />
      <path d="M10 20.25a2.2 2.2 0 0 0 4 0" />
      <path d="M17.25 15.25V10.5a5.25 5.25 0 1 0-10.5 0v4.75L5 17h14l-1.75-1.75Z" />
    </>
  ),
  contact: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
      <path d="M4.75 7.75 12 13l7.25-5.25" />
    </>
  ),
  spark: (
    <>
      <path d="M12 4.75 13.75 9l4.25 1.75-4.25 1.75L12 16.75l-1.75-4.25L6 10.75 10.25 9Z" />
      <path d="M18.25 4.75v2.5" />
      <path d="M17 6h2.5" />
    </>
  ),
  problem: (
    <>
      <rect x="4.5" y="5.25" width="15" height="13.5" rx="2.5" />
      <path d="M8.25 9h7.5" />
      <path d="M8.25 12.25h7.5" />
      <path d="M8.25 15.5h5.25" />
    </>
  ),
  bookmark: <path d="M7 4.5h10v15l-5-3.4L7 19.5Z" />,
  lock: (
    <>
      <rect x="5.25" y="11" width="13.5" height="9.5" rx="2" />
      <path d="M8.25 11V8.75a3.75 3.75 0 1 1 7.5 0V11" />
    </>
  ),
  check: <path d="m5.75 12.5 4 4L18.5 7.75" />,
  hint: (
    <>
      <path d="M9.5 18.25h5" />
      <path d="M10.5 21h3" />
      <path d="M12 3.75a5.75 5.75 0 0 1 3.6 10.24c-.72.58-1.25 1.39-1.52 2.26H9.92c-.27-.87-.8-1.68-1.52-2.26A5.75 5.75 0 0 1 12 3.75Z" />
    </>
  ),
  solution: (
    <>
      <path d="M7.5 4.5h6l4 4v11a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
      <path d="M13.5 4.5v4h4" />
      <path d="m9.5 15.25 1.75 1.75 3.75-3.75" />
    </>
  ),
  note: (
    <>
      <path d="M7.5 4.5h7l3 3v12a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
      <path d="M14.5 4.5v3.25h3.25" />
      <path d="M8.75 11.5h6.5" />
      <path d="M8.75 14.75h6.5" />
    </>
  ),
  clear: (
    <>
      <path d="M4.5 7.5h15" />
      <path d="M9 7.5v-2h6v2" />
      <path d="M7.5 7.5 8.5 19a2 2 0 0 0 1.99 1.75h3a2 2 0 0 0 1.99-1.75l1-11.5" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </>
  ),
  back: (
    <>
      <path d="m10 7-5 5 5 5" />
      <path d="M6 12h13" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="m10 14 2-5 5-2-2 5-5 2Z" />
    </>
  ),
  reference: (
    <>
      <path d="M5 7.25h9.5v3.5H5Z" />
      <path d="M9.5 11.75H19v3.5H9.5Z" />
      <path d="M5 16.25h9.5v3.5H5Z" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m8.25 12.25 2.5 2.5 5-5" />
    </>
  ),
  'x-circle': (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4.5 20 18.5H4L12 4.5Z" />
      <path d="M12 9v4.25" />
      <circle cx="12" cy="16.25" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  'chevron-left': <path d="m14.5 6.5-5 5.5 5 5.5" />,
  'chevron-right': <path d="m9.5 6.5 5 5.5-5 5.5" />,
  play: <path d="M8.5 6.75 17 12l-8.5 5.25Z" fill="currentColor" stroke="none" />,
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  name: IconName;
}

export function Icon({ name, className = '', ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`ui-icon ${className}`.trim()}
      {...props}
    >
      {ICONS[name]}
    </svg>
  );
}

interface BrandMarkProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {}

export function BrandMark({ className = '', ...props }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={`brand-mark ${className}`.trim()} {...props}>
      <rect x="5" y="5" width="54" height="54" rx="16" fill="#091321" />
      <path d="M19.5 17.5c-4.6 3.9-7.5 8.8-7.5 14.5s2.9 10.6 7.5 14.5" fill="none" stroke="#f1b35d" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44.5 17.5C49.1 21.4 52 26.3 52 32s-2.9 10.6-7.5 14.5" fill="none" stroke="#f1b35d" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 30v15" fill="none" stroke="#f7fbff" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 37h12" fill="none" stroke="#7cb0ff" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M24 43h16" fill="none" stroke="#dce9ff" strokeWidth="2.8" strokeLinecap="round" />
      <ellipse cx="32" cy="28" rx="5.2" ry="4.3" fill="#f6b7c7" />
      <circle cx="23.5" cy="22.5" r="2.2" fill="#ffdbe3" />
      <circle cx="28.5" cy="17.5" r="2.2" fill="#ffdbe3" />
      <circle cx="35.5" cy="17.5" r="2.2" fill="#ffdbe3" />
      <circle cx="40.5" cy="22.5" r="2.2" fill="#ffdbe3" />
    </svg>
  );
}