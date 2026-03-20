import React from 'react';

// ─── Base icon wrapper ────────────────────────────────────────────────────────
interface IcoProps {
  d: string | string[];
  size?: number;
  sw?: number;
  fill?: string;
}

const Ico = ({ d, size = 16, sw = 2, fill = 'none' }: IcoProps) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />}
  </svg>
);

// ─── Named icons ──────────────────────────────────────────────────────────────
export const IBeaker  = () => <Ico size={22} d={["M9 3h6l1 7H8L9 3z","M8 10l-4 10h16L16 10"]} />;
export const IBook    = ({ size = 14 }: { size?: number }) => <Ico size={size} d={["M2 3h9v18H2z","M13 3h9v18h-9z"]} />;
export const IChevD   = ({ size = 13 }: { size?: number }) => <Ico size={size} sw={2.5} d="M6 9l6 6 6-6" />;
export const IChevR   = ({ size = 13 }: { size?: number }) => <Ico size={size} sw={2.5} d="M9 18l6-6-6-6" />;
export const IPlay    = ({ size = 12 }: { size?: number }) => <Ico size={size} fill="currentColor" stroke="none" d="M5 3l14 9-14 9V3z" />;
export const IBookTxt = ({ size = 12 }: { size?: number }) => <Ico size={size} d={["M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M8 7h8","M8 11h8","M8 15h5"]} />;
export const IUndo    = ({ size = 16 }: { size?: number }) => <Ico size={size} sw={2.5} d={["M3 7v6h6","M3 13C5 7 10 4 16 6a9 9 0 0 1 5 8"]} />;
export const IRedo    = ({ size = 16 }: { size?: number }) => <Ico size={size} sw={2.5} d={["M21 7v6h-6","M21 13C19 7 14 4 8 6a9 9 0 0 0-5 8"]} />;
export const ITrash   = ({ size = 16 }: { size?: number }) => <Ico size={size} d={["M3 6h18","M19 6l-1 14H6L5 6","M9 6V4h6v2","M10 11v6","M14 11v6"]} />;
export const IDl      = ({ size = 14 }: { size?: number }) => <Ico size={size} sw={2.5} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} />;
export const IRotate  = ({ size = 12 }: { size?: number }) => <Ico size={size} d={["M21 2v6h-6","M21 13a9 9 0 1 1-3-7.7L21 8"]} />;
export const IFlip    = ({ size = 12 }: { size?: number }) => <Ico size={size} d={["M3 7l9-5 9 5","M3 17l9 5 9-5","M12 2v20"]} />;
export const IType    = ({ size = 13 }: { size?: number }) => <Ico size={size} d={["M4 7V4h16v3","M9 20h6","M12 4v16"]} />;
export const IPlus    = ({ size = 14 }: { size?: number }) => <Ico size={size} sw={2.5} d="M12 5v14M5 12h14" />;
export const IX       = ({ size = 14, sw = 2 }: { size?: number; sw?: number }) => <Ico size={size} sw={sw} d="M18 6L6 18M6 6l12 12" />;
export const IPtr     = ({ size = 13 }: { size?: number }) => <Ico size={size} d="M4 2l16 9-7 1-4 7z" />;
export const ICheck   = ({ size = 14, sw = 2.5 }: { size?: number; sw?: number }) => <Ico size={size} sw={sw} d="M20 6L9 17l-5-5" />;
export const IArrow   = ({ size = 15 }: { size?: number }) => <Ico size={size} sw={2.5} d={["M5 12h14","M15 8l4 4-4 4"]} />;
export const IEquil   = ({ size = 15 }: { size?: number }) => <Ico size={size} sw={2.5} d={["M4 9h16M18 7l2 2-2 2","M20 15H4M6 13l-2 2 2 2"]} />;
export const ICurve   = ({ size = 15 }: { size?: number }) => <Ico size={size} sw={2.5} d="M5 18c0-5 4-9 9-9s9 4 9 9" />;
export const IText    = ({ size = 15 }: { size?: number }) => <Ico size={size} d={["M4 6h16","M4 12h10","M4 18h12","M17 14l4 4-4 4"]} />;
export const IMol     = ({ size = 15 }: { size?: number }) => <Ico size={size} d={["M12 2l4 7h5l-4 5 2 7-7-4-7 4 2-7-4-5h5z"]} />;
export const IEye     = ({ size = 15 }: { size?: number }) => <Ico size={size} d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} />;
