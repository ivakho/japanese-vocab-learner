import type { SVGProps } from 'react';

type IconName = 'book' | 'upload' | 'trash' | 'x' | 'arrow-left' | 'check' | 'alert' | 'play' | 'download' | 'sparkle' | 'trophy';

export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...props };

  switch (name) {
    case 'book':
      return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 6h8"/></svg>;
    case 'upload':
      return <svg {...common}><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"/></svg>;
    case 'trash':
      return <svg {...common}><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6 18 20H6L5 6"/><path d="M10 10v6"/><path d="M14 10v6"/></svg>;
    case 'x':
      return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
    case 'arrow-left':
      return <svg {...common}><path d="m15 18-6-6 6-6"/></svg>;
    case 'check':
      return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>;
    case 'alert':
      return <svg {...common}><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.2 3.5 2.6 17a2 2 0 0 0 1.8 3h15.2a2 2 0 0 0 1.8-3L13.8 3.5a2 2 0 0 0-3.6 0Z"/></svg>;
    case 'play':
      return <svg {...common} fill="currentColor" stroke="none"><path d="m8 5 11 7-11 7V5Z"/></svg>;
    case 'download':
      return <svg {...common}><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 19h14"/></svg>;
    case 'sparkle':
      return <svg {...common}><path d="m12 3-1.3 5.1L6 10l4.7 1.9L12 17l1.3-5.1L18 10l-4.7-1.9L12 3Z"/><path d="m19 15-.7 2.3L16 18l2.3.7L19 21l.7-2.3L22 18l-2.3-.7L19 15Z"/></svg>;
    case 'trophy':
      return <svg {...common}><path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/></svg>;
  }
}
