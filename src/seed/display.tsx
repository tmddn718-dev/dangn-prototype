import type { ReactNode } from 'react';
import { cx, rc, type Style } from './recipe';

export type Tone = 'neutral' | 'brand' | 'informative' | 'positive' | 'warning' | 'critical';

export interface BadgeProps {
  tone?: Tone;
  variant?: 'weak' | 'solid' | 'outline';
  size?: 'medium' | 'large';
  className?: string;
  style?: Style;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', variant = 'weak', size = 'medium', className, style, children }: BadgeProps) {
  return (
    <span className={cx(rc('seed-badge__root', { size, variant }), `seed-badge__root--tone_${tone}-variant_${variant}`, className)} style={style}>
      <span className="seed-badge__label">{children}</span>
    </span>
  );
}

const TEMP_BOUNDS = [-Infinity, 30, 36, 36.5, 37, 40, 45, 55, 65, 80, Infinity];

export function mannerTempToLevel(t: number) {
  for (let i = 0; i < TEMP_BOUNDS.length - 1; i++) if (t >= TEMP_BOUNDS[i] && t < TEMP_BOUNDS[i + 1]) return `l${i + 1}`;
  return 'l1';
}

export function MannerTempBadge({ temperature, level, className, style }: { temperature: number; level?: string; className?: string; style?: Style }) {
  return (
    <span className={cx(rc('seed-manner-temp-badge', { level: level || mannerTempToLevel(temperature) }), className)} style={style}>
      {temperature}°C
    </span>
  );
}

export interface ProgressCircleProps {
  value?: number;
  tone?: 'neutral' | 'brand' | 'staticWhite' | 'inherit';
  size?: '24' | '40' | 'inherit';
  className?: string;
  style?: Style;
}

export function ProgressCircle({ value, tone = 'neutral', size = '40', className, style }: ProgressCircleProps) {
  const [s, t] = ({ '24': [24, 3], '40': [40, 5], inherit: [16, 2] } as const)[size];
  const r = (s - t) / 2;
  const c = 2 * Math.PI * r;
  const ind = value == null;
  const state = ind ? 'indeterminate' : value >= 100 ? 'complete' : 'loading';
  return (
    <svg
      className={cx(rc('seed-progress-circle__root', { tone, size }), className)}
      data-progress-state={state}
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={style}
      role="progressbar"
      aria-valuenow={ind ? undefined : value}
    >
      <circle className="seed-progress-circle__track" cx={s / 2} cy={s / 2} r={r} fill="none" strokeWidth={t} />
      <circle
        className="seed-progress-circle__range"
        data-progress-state={state}
        cx={s / 2}
        cy={s / 2}
        r={r}
        fill="none"
        strokeWidth={t}
        transform={`rotate(-90 ${s / 2} ${s / 2})`}
        style={{ '--circumference': `${c}px`, strokeDasharray: ind ? undefined : `${(c * value) / 100} ${c}` } as Style}
      />
    </svg>
  );
}

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: '0' | '8' | '16' | 'full' | string;
  tone?: 'neutral' | 'magic';
  className?: string;
  style?: Style;
}

export function Skeleton({ width = '100%', height = 16, radius = '8', tone = 'neutral', className, style }: SkeletonProps) {
  return <div aria-hidden="true" className={cx(rc('seed-skeleton', { radius, tone }), className)} style={{ width, height, ...style }} />;
}
