import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx, da, rc, type Style } from './recipe';
import { ProgressCircle } from './display';

const SCALE = { xsmall: 0.9375, small: 0.944, medium: 0.95, large: 0.96 };

export type ActionButtonVariant =
  | 'brandSolid' | 'neutralSolid' | 'neutralWeak' | 'criticalSolid' | 'brandOutline' | 'neutralOutline' | 'ghost';

export interface ActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'style'> {
  variant?: ActionButtonVariant;
  size?: keyof typeof SCALE;
  layout?: 'withText' | 'iconOnly';
  loading?: boolean;
  flexGrow?: boolean | number;
  color?: string;
  style?: Style;
}

export function ActionButton({
  variant = 'brandSolid', size = 'medium', layout = 'withText', loading = false, disabled = false,
  flexGrow, color, className, style, children, ...rest
}: ActionButtonProps) {
  const st: Style = {
    '--seed-feedback-scale': SCALE[size],
    ...(flexGrow ? { '--seed-box-flex-grow': flexGrow === true ? 1 : flexGrow } : {}),
    ...(color ? { '--seed-box-color': color } : {}),
    ...style,
  };
  return (
    <button
      type="button"
      className={cx(rc('seed-action-button', { variant, size, layout }, [['size', 'layout']]), className)}
      disabled={disabled}
      data-disabled={da(disabled)}
      data-loading={da(loading)}
      aria-busy={loading || undefined}
      style={st}
      {...rest}
    >
      {loading ? <span style={{ visibility: 'hidden', display: 'contents' }}>{children}</span> : children}
      {loading && (
        <span className="seed-loading-indicator">
          <ProgressCircle size="inherit" tone="inherit" />
        </span>
      )}
    </button>
  );
}

export interface FloatingActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  icon: ReactNode;
  label: ReactNode;
  extended?: boolean;
  style?: Style;
}

export function FloatingActionButton({ icon, label, extended = false, className, style, ...rest }: FloatingActionButtonProps) {
  const ext = { extended: String(extended) };
  return (
    <button
      type="button"
      aria-label={typeof label === 'string' ? label : undefined}
      className={cx(rc('seed-floating-action-button__root', ext), className)}
      style={{ '--seed-feedback-scale': 0.96, ...style } as Style}
      {...rest}
    >
      <span className={rc('seed-floating-action-button__icon', ext)} style={{ display: 'inline-flex' }}>{icon}</span>
      <span className={rc('seed-floating-action-button__label', ext)}>{label}</span>
    </button>
  );
}
