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

/* ---- 野菜（追加） ---- */
export function IllustEggplant({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M28 13c1 2 0 4-2 5 3 0 7 3 7 9 0 7-5 12-10 12-6 0-10-5-9-11 1-5 5-9 9-9-2-1-3-4-2-6 2 0 6 0 7 0Z" fill="#7a4fa3" />
      <path d="M27 13c-2 0-5 0-6 1 1 1 2 2 1 4 2-1 4-3 5-5Z" fill="#5fa44a" />
    </svg>
  );
}
export function IllustGreenPepper({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="22" y="11" width="3" height="5" rx="1.5" fill="#4f8f3e" />
      <path d="M17 20c0-3 3-5 7-5s7 2 7 5c2 8-1 16-7 16s-9-8-7-16Z" fill="#5fb24a" />
      <path d="M21 19c1 8 0 14 0 14M27 19c-1 8 0 14 0 14" stroke="#4a9a3a" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
export function IllustDaikon({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M18 12c1 3 4 5 6 4M30 12c-1 3-4 5-6 4" stroke="#5fa44a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M24 15c4 0 7 2 7 5 0 7-4 17-7 19-3-2-7-12-7-19 0-3 3-5 7-5Z" fill="#f3f0ea" />
      <path d="M21 22h6" stroke="#d9d2c4" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
export function IllustCorn({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M16 18c2-5 4-8 8-8s6 3 8 8c2 6 0 18-8 20-8-2-10-14-8-20Z" fill="#f2c84b" />
      <path d="M20 16c2 12 2 18 2 18M24 14v20M28 16c-2 12-2 18-2 18" stroke="#d9a82e" strokeWidth="1" fill="none" />
      <path d="M16 18c-3-1-5-3-5-6 3 0 5 2 6 4M32 18c3-1 5-3 5-6-3 0-5 2-6 4Z" fill="#7cbf5e" />
    </svg>
  );
}

/* ---- 果物 ---- */
export function IllustApple({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="23" y="11" width="2" height="5" rx="1" fill="#7a5230" />
      <path d="M25 14c0-3 2-5 5-5 0 3-2 5-5 5Z" fill="#6aa84f" />
      <path d="M24 16c-2-1-5-1-7 1-3 3-3 9-1 13 2 3 4 5 6 5 1 0 1-.5 2-.5s1 .5 2 .5c2 0 4-2 6-5 2-4 2-10-1-13-2-2-5-2-7-1Z" fill="#e0473a" />
    </svg>
  );
}
export function IllustBanana({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M13 18c2 12 11 19 23 16 3-1 2-4-1-3-9 1-16-6-18-15-1-2-3-1-4 2Z" fill="#f2c84b" />
      <path d="M35 31l3-1-1 3z" fill="#9c7b2a" />
      <path d="M12 17l-1-3 3 1z" fill="#9c7b2a" />
    </svg>
  );
}
export function IllustMandarin({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <circle cx="24" cy="27" r="12" fill="#f3963f" />
      <ellipse cx="24" cy="15" rx="3.5" ry="1.8" fill="#6aa84f" />
      <path d="M24 23a4 4 0 0 0 0 8" stroke="#dd7e2c" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
export function IllustStrawberry({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M24 17c6-3 12 1 11 8-1 6-7 13-11 14-4-1-10-8-11-14-1-7 5-11 11-8Z" fill="#e0473a" />
      <path d="M18 16l6 2 6-2-2 3 2 1-3 1 1 3-4-2-4 2 1-3-3-1 3-1z" fill="#5fa44a" />
      <circle cx="21" cy="26" r="0.8" fill="#ffe08a" />
      <circle cx="26" cy="25" r="0.8" fill="#ffe08a" />
      <circle cx="24" cy="30" r="0.8" fill="#ffe08a" />
      <circle cx="28" cy="29" r="0.8" fill="#ffe08a" />
    </svg>
  );
}
export function IllustGrapes({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M24 12v4" stroke="#6f4b22" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M24 13c2-2 5-2 6-4" stroke="#6aa84f" strokeWidth="2" fill="none" strokeLinecap="round" />
      <g fill="#8e6fb0">
        <circle cx="20" cy="20" r="3.4" />
        <circle cx="28" cy="20" r="3.4" />
        <circle cx="24" cy="22" r="3.4" />
        <circle cx="22" cy="26" r="3.4" />
        <circle cx="30" cy="25" r="3.4" />
        <circle cx="26" cy="27" r="3.4" />
        <circle cx="18" cy="25" r="3.4" />
        <circle cx="24" cy="31" r="3.4" />
      </g>
    </svg>
  );
}

/* ---- 肉・魚・卵 ---- */
export function IllustEgg({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <ellipse cx="20" cy="28" rx="8" ry="10" fill="#fff" stroke="#ece3d6" strokeWidth="1.5" />
      <ellipse cx="30" cy="26" rx="7" ry="9" fill="#fdf6ea" stroke="#ece3d6" strokeWidth="1.5" />
    </svg>
  );
}
export function IllustMeat({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M14 24c0-7 6-11 13-11 6 0 9 4 8 9-1 6-7 11-13 11-5 0-8-3-8-9Z" fill="#d9614f" />
      <path d="M19 24c2-2 6-2 8 0M22 28c2-1 4-1 6 0" stroke="#f0b3a6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="21" r="3" fill="#f3ece1" />
    </svg>
  );
}
export function IllustFish({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M10 24c5-7 16-9 24-4-1 2-1 6 0 8-8 5-19 3-24-4Z" fill="#6fb0c9" />
      <path d="M34 20l5-3v14l-5-3z" fill="#5a9eba" />
      <circle cx="16" cy="22" r="1.4" fill="#274a55" />
      <path d="M22 20c2 3 2 5 0 8" stroke="#4d92ad" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
export function IllustChicken({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M30 12c5 1 7 6 4 10s-9 4-11 2l-9 9c-1 1-4 0-4-2l4-3c-2-1-2-4 0-5l9-9c-2-3 0-7 7-2z" fill="#e8b06a" />
      <rect x="11" y="30" width="6" height="3" rx="1.5" transform="rotate(45 14 31)" fill="#f3f0ea" />
    </svg>
  );
}
export function IllustHam({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <circle cx="24" cy="24" r="13" fill="#f0a9a0" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="#e08a7e" strokeWidth="2" />
      <circle cx="24" cy="24" r="3" fill="#e08a7e" />
    </svg>
  );
}

/* ---- 乳製品・パン ---- */
export function IllustMilk({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M16 18h16v18a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2z" fill="#fff" stroke="#dfe6ea" strokeWidth="1.5" />
      <path d="M16 18l3-6h10l3 6z" fill="#eaf3fa" stroke="#dfe6ea" strokeWidth="1.5" />
      <rect x="18" y="26" width="12" height="8" rx="1" fill="#5aa0d0" />
      <path d="M20 30h8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
export function IllustBread({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M12 24c0-6 5-10 12-10s12 4 12 10c0 2-1 3-3 3v9a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2v-9c-2 0-3-1-3-3Z" fill="#dca85a" />
      <path d="M15 27v11M33 27v11" stroke="#b9863f" strokeWidth="1.2" />
      <path d="M16 22c2-3 14-3 16 0" stroke="#b9863f" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
export function IllustCheese({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M12 32l22-14 2 2v12a1 1 0 0 1-1 1H13a1 1 0 0 1-1-1z" fill="#f2c84b" />
      <path d="M12 32l22-14" stroke="#e0b23a" strokeWidth="1.2" />
      <circle cx="20" cy="29" r="1.6" fill="#e9d27a" />
      <circle cx="27" cy="27" r="1.3" fill="#e9d27a" />
      <circle cx="24" cy="31" r="1.1" fill="#e9d27a" />
    </svg>
  );
}
export function IllustYogurt({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M15 20h18l-2 16a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2z" fill="#f3f0ea" stroke="#e3ddd2" strokeWidth="1.2" />
      <rect x="14" y="16" width="20" height="5" rx="2" fill="#e7b3c6" />
      <path d="M20 28c2-2 6-2 8 0" stroke="#cf8aa6" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---- 主食・大豆 ---- */
export function IllustRice({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M12 26c2-2 22-2 24 0-1 6-6 10-12 10s-11-4-12-10Z" fill="#f3efe7" stroke="#e3ddd2" strokeWidth="1.2" />
      <path d="M14 26c2-4 18-4 20 0" fill="#fff" stroke="#e3ddd2" strokeWidth="1" />
      <path d="M19 22l2-2M24 21v-3M29 22l-2-2" stroke="#cbb58f" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
export function IllustTofu({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M12 20l12-5 12 5-12 5z" fill="#fff" stroke="#e3ddd2" strokeWidth="1.2" />
      <path d="M12 20v10l12 5V25z" fill="#f3f0ea" stroke="#e3ddd2" strokeWidth="1.2" />
      <path d="M36 20v10l-12 5V25z" fill="#eae3d6" stroke="#e3ddd2" strokeWidth="1.2" />
    </svg>
  );
}
export function IllustNatto({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M13 22h22l-2 12a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2z" fill="#f3f0ea" stroke="#e3ddd2" strokeWidth="1.2" />
      <g fill="#b78b3f">
        <circle cx="19" cy="27" r="1.6" />
        <circle cx="24" cy="26" r="1.6" />
        <circle cx="29" cy="27" r="1.6" />
        <circle cx="21" cy="31" r="1.6" />
        <circle cx="27" cy="31" r="1.6" />
      </g>
    </svg>
  );
}

/* ---- 調味料 ---- */
export function IllustSoySauce({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="22" y="9" width="4" height="4" fill="#444" />
      <path d="M19 14h10l1 22a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2z" fill="#5b3a2e" />
      <rect x="21" y="24" width="6" height="9" rx="1" fill="#caa27a" opacity="0.5" />
    </svg>
  );
}
export function IllustSalt({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M17 21h14l-1 15a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2z" fill="#f3f0ea" stroke="#e3ddd2" strokeWidth="1.2" />
      <rect x="16" y="16" width="16" height="5" rx="1.5" fill="#9fb1bd" />
      <g fill="#7d8d99">
        <circle cx="22" cy="18" r="0.7" />
        <circle cx="24" cy="19" r="0.7" />
        <circle cx="26" cy="18" r="0.7" />
      </g>
    </svg>
  );
}
export function IllustSugar({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M16 16l4-3h8l4 3v20a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2z" fill="#f3f0ea" stroke="#e3ddd2" strokeWidth="1.2" />
      <path d="M16 16h16" stroke="#e3ddd2" strokeWidth="1.2" />
      <rect x="19" y="24" width="10" height="7" rx="1" fill="#fff" stroke="#e3ddd2" strokeWidth="1" />
      <g fill="#dfe6ea">
        <rect x="21" y="26" width="2.5" height="2.5" />
        <rect x="24.5" y="26" width="2.5" height="2.5" />
      </g>
    </svg>
  );
}
export function IllustOil({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="22" y="9" width="4" height="4" fill="#caa24a" />
      <path d="M19 14h10l1 22a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2z" fill="#f0cf6a" />
      <rect x="21" y="22" width="6" height="11" rx="1" fill="#fff" opacity="0.35" />
    </svg>
  );
}
export function IllustKetchup({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M22 9h4v3l2 2v22a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V14l2-2z" fill="#d6453a" />
      <rect x="20" y="22" width="8" height="6" rx="1" fill="#fff" />
      <path d="M22 25h4" stroke="#d6453a" strokeWidth="1.2" />
    </svg>
  );
}
export function IllustMayo({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M22 9h4v3l2 2v22a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V14l2-2z" fill="#f6efdc" stroke="#e3ddd2" strokeWidth="1.2" />
      <rect x="20" y="22" width="8" height="6" rx="1" fill="#fff" stroke="#e3ddd2" strokeWidth="1" />
      <path d="M24 14v6" stroke="#dfd6bb" strokeWidth="1.2" />
    </svg>
  );
}

/* ---- 飲料 ---- */
export function IllustWater({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="21" y="8" width="6" height="4" rx="1" fill="#8fd0e6" />
      <path d="M19 14c2-1 8-1 10 0 1 6 1 6 0 8 1 2 1 14 0 16-2 1-8 1-10 0-1-2-1-14 0-16-1-2-1-2 0-8Z" fill="#bfe6f2" />
      <path d="M22 22v10M26 22v10" stroke="#9bd2e6" strokeWidth="1.2" />
    </svg>
  );
}
export function IllustTea({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="21" y="8" width="6" height="4" rx="1" fill="#5a8a3a" />
      <path d="M19 14c2-1 8-1 10 0 1 6 1 6 0 8 1 2 1 14 0 16-2 1-8 1-10 0-1-2-1-14 0-16-1-2-1-2 0-8Z" fill="#9ac46f" />
      <rect x="20.5" y="24" width="7" height="8" rx="1" fill="#fff" opacity="0.5" />
    </svg>
  );
}
export function IllustCoffee({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M14 18h16v8a8 8 0 0 1-16 0z" fill="#fff" stroke="#cbb59a" strokeWidth="1.5" />
      <path d="M30 19h3a3 3 0 0 1 0 6h-3" fill="none" stroke="#cbb59a" strokeWidth="1.5" />
      <path d="M16 20h12v4a6 6 0 0 1-12 0z" fill="#7a5230" />
      <path d="M19 13c-1 1-1 2 0 3M23 13c-1 1-1 2 0 3" stroke="#cbb59a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
export function IllustBeer({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M16 18h14v18a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2z" fill="#f2b32e" />
      <path d="M16 18h14v5H16z" fill="#fff" />
      <path d="M30 21h3a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-3z" fill="none" stroke="#d99b1e" strokeWidth="2" />
      <path d="M19 26v8M23 26v8M27 26v8" stroke="#e0a727" strokeWidth="1" />
    </svg>
  );
}

/* ---- 日用品（追加） ---- */
export function IllustKitchenPaper({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="17" y="10" width="14" height="26" rx="3" fill="#f3f0ea" stroke="#e3ddd2" strokeWidth="1.2" />
      <rect x="22" y="6" width="4" height="32" rx="2" fill="#cdbfae" />
      <path d="M31 16h4v18l-4-2z" fill="#fff" stroke="#e3ddd2" strokeWidth="1" />
    </svg>
  );
}
export function IllustToothpaste({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="22" y="9" width="4" height="4" rx="1" fill="#4aa3b8" />
      <path d="M21 13h6l4 23-7 2-7-2z" fill="#eef4f6" stroke="#cfe0e4" strokeWidth="1.2" />
      <path d="M22 22h4" stroke="#7fc0cf" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
export function IllustShampoo({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="23" y="8" width="4" height="4" fill="#9aa6ad" />
      <path d="M27 10l4 2v2l-4 1z" fill="#9aa6ad" />
      <path d="M18 16c0-1 1-2 2-2h8c1 0 2 1 2 2v20a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2z" fill="#c79fd0" />
      <rect x="20" y="22" width="8" height="9" rx="1" fill="#efe3f3" />
    </svg>
  );
}
export function IllustBattery({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="18" y="12" width="12" height="26" rx="2" fill="#caa24a" />
      <rect x="18" y="12" width="12" height="9" rx="2" fill="#3a332c" />
      <rect x="21" y="8" width="6" height="4" rx="1" fill="#9aa6ad" />
      <path d="M24 24l-2 4h3l-2 4" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- 洗剤 ---- */
export function IllustDishSoap({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M22 8c2 0 2 2 4 3 2 1 2 3 0 3h-4z" fill="#3f9d6a" />
      <path d="M19 16h10v20a2 2 0 0 1-2 2H21a2 2 0 0 1-2-2z" fill="#6cc796" />
      <rect x="21" y="22" width="6" height="10" rx="1" fill="#eafaf2" />
    </svg>
  );
}
export function IllustLaundry({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <path d="M14 16h20v20a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z" fill="#4f8fc4" />
      <rect x="14" y="16" width="20" height="6" fill="#3f7fb0" />
      <circle cx="24" cy="29" r="5" fill="#eaf3fa" />
      <path d="M21 29a3 3 0 0 1 6 0" stroke="#4f8fc4" strokeWidth="1.4" fill="none" />
    </svg>
  );
}
export function IllustSoftener({ className }: P) {
  return (
    <svg viewBox={VB} className={className}>
      <rect x="22" y="9" width="4" height="4" rx="1" fill="#cf8aa6" />
      <path d="M18 15c0-1 1-2 2-1h8c1-1 2 0 2 1l1 21a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2z" fill="#e7b3c6" />
      <path d="M24 22c2 2 2 4 0 6-2-2-2-4 0-6z" fill="#fff" />
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
  eggplant: IllustEggplant,
  greenpepper: IllustGreenPepper,
  daikon: IllustDaikon,
  corn: IllustCorn,
  apple: IllustApple,
  banana: IllustBanana,
  mandarin: IllustMandarin,
  strawberry: IllustStrawberry,
  grapes: IllustGrapes,
  egg: IllustEgg,
  meat: IllustMeat,
  fish: IllustFish,
  chicken: IllustChicken,
  ham: IllustHam,
  milk: IllustMilk,
  bread: IllustBread,
  cheese: IllustCheese,
  yogurt: IllustYogurt,
  rice: IllustRice,
  tofu: IllustTofu,
  natto: IllustNatto,
  soysauce: IllustSoySauce,
  salt: IllustSalt,
  sugar: IllustSugar,
  oil: IllustOil,
  ketchup: IllustKetchup,
  mayo: IllustMayo,
  water: IllustWater,
  tea: IllustTea,
  coffee: IllustCoffee,
  beer: IllustBeer,
  toiletpaper: IllustToiletPaper,
  tissue: IllustTissue,
  kitchenpaper: IllustKitchenPaper,
  toothbrush: IllustToothbrush,
  toothpaste: IllustToothpaste,
  soap: IllustSoap,
  shampoo: IllustShampoo,
  battery: IllustBattery,
  trashbag: IllustTrashBag,
  detergent: IllustDetergent,
  dishsoap: IllustDishSoap,
  laundry: IllustLaundry,
  softener: IllustSoftener,
};

/** icon 識別子に対応するイラストを描画。未知なら既定のプレースホルダ。 */
export function ProductIcon({ name, className }: { name: string; className?: string }) {
  const Illust = ILLUSTRATIONS[name];
  if (!Illust) return <PhotoPlaceholder className={className} />;
  return <Illust className={className ?? 'product-illust'} />;
}
