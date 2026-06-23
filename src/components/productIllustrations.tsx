import type { ReactElement } from 'react';
import { PhotoPlaceholder } from './icons';

type P = { className?: string };
const VB = '0 0 48 48';

/* ---- 野菜 ---- */
export function IllustCarrot({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M22 17c-2-3-5-4-8-3 1 3 4 5 8 4Z" fill="#65a84e" />
      <path d="M26 17c2-3 5-4 8-3-1 3-4 5-8 4Z" fill="#7bbd61" />
      <path d="M24 9c-2 2-2 5 0 8 2-3 2-6 0-8Z" fill="#65a84e" />
      <path d="M24 16c4 0 8 3 8 6 0 6-5 17-8 19-3-2-8-13-8-19 0-3 4-6 8-6Z" fill="#ed7d3e" />
      <path d="M20 24l2 1M27 23l-2 1M22 30l2 1M26 30l-1 1" stroke="#c9622a" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
export function IllustPotato({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M14 26c-2-7 4-13 12-13 8 0 10 5 9 11-1 7-7 11-12 11-5 0-8-3-9-9Z" fill="#c8975a" />
      <circle cx="20" cy="22" r="1.3" fill="#9c6f3a" />
      <circle cx="28" cy="20" r="1.1" fill="#9c6f3a" />
      <circle cx="26" cy="28" r="1.3" fill="#9c6f3a" />
      <circle cx="19" cy="29" r="1" fill="#9c6f3a" />
    </svg>
  );
}
export function IllustOnion({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M24 13c-1-2-3-3-5-3 0 2 1 4 3 4M24 13c1-2 3-3 5-3 0 2-1 4-3 4" fill="#7bbd61" />
      <path d="M24 14c7 0 11 6 11 13 0 8-5 12-11 12s-11-4-11-12c0-7 4-13 11-13Z" fill="#cdaad9" />
      <path d="M24 15c-2 4-3 9-3 17M24 15c2 4 3 9 3 17" stroke="#a982bd" strokeWidth="1.3" fill="none" />
    </svg>
  );
}
export function IllustTomato({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <circle cx="24" cy="27" r="13" fill="#e4503b" />
      <path d="M24 14l-3-4M24 14l3-4M24 14l-5-1M24 14l5-1M24 14v-5" stroke="#5fa44a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="14" r="2.4" fill="#5fa44a" />
      <path d="M19 23c1-2 3-3 5-3" stroke="#f2a597" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
export function IllustCucumber({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M15 33c-3-3-3-8 0-12 4-5 12-10 16-7 3 3-1 11-6 15-4 4-7 7-10 4Z" fill="#4f9b42" />
      <path d="M18 30c-2-2-2-5 0-8 3-4 8-7 11-5 2 2-1 7-4 10-3 3-5 5-7 3Z" fill="#6cb556" />
      <circle cx="20" cy="26" r="0.9" fill="#3c7a32" />
      <circle cx="24" cy="23" r="0.9" fill="#3c7a32" />
      <circle cx="27" cy="20" r="0.9" fill="#3c7a32" />
    </svg>
  );
}
export function IllustCabbage({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <circle cx="24" cy="25" r="14" fill="#8fc96f" />
      <path d="M24 11c-6 3-9 9-9 14 0 5 4 8 9 8s9-3 9-8c0-5-3-11-9-14Z" fill="#a7d98a" />
      <path d="M24 14c-4 3-6 8-6 12M24 14c4 3 6 8 6 12M24 16v16" stroke="#76b85a" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

/* ---- 日用品 ---- */
export function IllustToiletPaper({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="12" y="16" width="22" height="20" rx="4" fill="#f3f0ea" />
      <rect x="12" y="16" width="22" height="6" rx="3" fill="#e3ddd2" />
      <ellipse cx="23" cy="22" rx="6" ry="3" fill="#cdbfae" />
      <ellipse cx="23" cy="22" rx="2.4" ry="1.2" fill="#a8927a" />
      <path d="M31 23l5 1v11l-5-2z" fill="#fff" stroke="#e3ddd2" strokeWidth="1" />
    </svg>
  );
}
export function IllustTissue({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="12" y="22" width="24" height="14" rx="2.5" fill="#6ab0d6" />
      <rect x="12" y="22" width="24" height="5" rx="2.5" fill="#5a9ec4" />
      <path d="M22 24c1-5 3-8 0-12-1 4-1 8 0 12Z" fill="#fff" />
      <path d="M26 24c-1-4-3-6-1-9 0 3 0 6 1 9Z" fill="#eef4f8" />
    </svg>
  );
}
export function IllustDetergent({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="21" y="9" width="6" height="5" rx="1" fill="#3f7fb0" />
      <path d="M18 16c0-1 1-2 2-2h8c1 0 2 1 2 2l1 19c0 2-1 3-3 3H20c-2 0-3-1-3-3l1-19Z" fill="#5aa0d0" />
      <rect x="19" y="22" width="10" height="8" rx="1.5" fill="#eaf3fa" />
      <path d="M21 26h6" stroke="#5aa0d0" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
export function IllustToothbrush({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="9" y="29" width="26" height="5" rx="2.5" transform="rotate(-28 22 31)" fill="#56b3c9" />
      <path d="M30 15l1 2M32.5 13.5l1 2M35 12l1 2" stroke="#9bd4df" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
export function IllustSoap({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="24" y="9" width="5" height="4" rx="1" fill="#8a8f98" />
      <rect x="27" y="11" width="3" height="5" fill="#8a8f98" />
      <rect x="29" y="13" width="4" height="2.4" rx="1" fill="#8a8f98" />
      <rect x="18" y="16" width="12" height="22" rx="4" fill="#7ec6a6" />
      <rect x="19.5" y="24" width="9" height="9" rx="1.5" fill="#eafaf2" />
    </svg>
  );
}
export function IllustTrashBag({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M18 16c2-1 4-1 6 0 2-1 4-1 6 0l3 18c0 3-3 5-9 5s-9-2-9-5z" fill="#8a8f98" />
      <path d="M20 15l-2-4M28 15l2-4M24 15v-5" stroke="#6f747d" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M21 24c2 2 5 2 7 0" stroke="#6f747d" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const ILLUSTRATIONS: Record<string, (p: P) => ReactElement> = {
  carrot: IllustCarrot,
  potato: IllustPotato,
  onion: IllustOnion,
  tomato: IllustTomato,
  cucumber: IllustCucumber,
  cabbage: IllustCabbage,
  toiletpaper: IllustToiletPaper,
  tissue: IllustTissue,
  detergent: IllustDetergent,
  toothbrush: IllustToothbrush,
  soap: IllustSoap,
  trashbag: IllustTrashBag,
};

/** icon 識別子に対応するイラストを描画。未知なら既定のプレースホルダ。 */
export function ProductIcon({ name, className }: { name: string; className?: string }) {
  const Illust = ILLUSTRATIONS[name];
  if (!Illust) return <PhotoPlaceholder className={className} />;
  return <Illust className={className ?? 'product-illust'} />;
}
