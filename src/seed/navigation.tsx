import type { ReactNode } from 'react';
import { cx, rc, type Style } from './recipe';
import { Glyph, Icon, type GlyphName, type IconName } from './Icon';

export interface AppBarButton {
  label: string;
  icon?: IconName;
  glyph?: GlyphName;
  onClick?: () => void;
}

export interface AppBarProps {
  title?: string;
  subtitle?: string;
  left?: AppBarButton[];
  right?: AppBarButton[];
  back?: boolean;
  onBack?: () => void;
  divider?: boolean;
  titleAlign?: 'left' | 'center';
  className?: string;
  style?: Style;
}

export function AppBar({ title, subtitle, left, right, back, onBack, divider = false, titleAlign, className, style }: AppBarProps) {
  const t = { theme: 'cupertino', tone: 'layer' };
  const btn = (b: AppBarButton, i: number) => (
    <button
      key={i}
      type="button"
      aria-label={b.label}
      onClick={b.onClick}
      className={rc('seed-app-bar__iconButton', t)}
      style={{ position: 'relative', color: 'inherit', cursor: 'pointer' }}
    >
      {b.glyph ? <Glyph name={b.glyph} className={rc('seed-app-bar__icon', t)} /> : <Icon slot="none" name={b.icon} className={rc('seed-app-bar__icon', t)} />}
    </button>
  );
  const lefts: AppBarButton[] = [...(back ? [{ glyph: 'chevronLeft' as const, label: '뒤로', onClick: onBack }] : []), ...(left || [])];
  return (
    <div className={cx(rc('seed-app-bar__root', t), className)} style={{ color: 'var(--seed-color-fg-neutral)', ...style }}>
      <div
        className={rc('seed-app-bar__background', { tone: 'layer' })}
        style={{
          background: 'var(--seed-color-bg-layer-default)',
          boxShadow: divider ? 'inset 0 -1px var(--seed-color-stroke-neutral-muted)' : undefined,
        }}
      />
      <div className={rc('seed-app-bar__left', t)}>{lefts.map(btn)}</div>
      <div className={rc('seed-app-bar-main__root', { theme: titleAlign === 'left' ? 'android' : 'cupertino', tone: 'layer' })}>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span className={rc('seed-app-bar-main__title', { layout: subtitle ? 'withSubtitle' : 'titleOnly', tone: 'layer' })}>{title}</span>
          {subtitle && <span className={rc('seed-app-bar-main__subtitle', { layout: 'withSubtitle', tone: 'layer' })}>{subtitle}</span>}
        </div>
      </div>
      <div className={rc('seed-app-bar__right', t)}>{(right || []).map(btn)}</div>
    </div>
  );
}

export interface BottomSheetProps {
  title?: string;
  description?: string;
  onClose: () => void;
  /** Position inside the nearest positioned ancestor (the phone frame) instead of the viewport. */
  contained?: boolean;
  children: ReactNode;
}

export function BottomSheet({ title, description, onClose, contained = false, children }: BottomSheetProps) {
  const pos = contained ? { position: 'absolute' as const } : undefined;
  return (
    <div className="seed-bottom-sheet__positioner" style={pos}>
      <div className="seed-bottom-sheet__backdrop" data-state="open" data-open="" style={pos} onClick={onClose} />
      <div
        role="dialog"
        className="seed-bottom-sheet__content"
        data-state="open"
        data-open=""
        data-show-close-button=""
        style={{ animation: 'drawer-slide-from-bottom var(--seed-duration-d6) var(--seed-timing-function-enter-expressive)' }}
      >
        <div className="seed-bottom-sheet-handle__root" />
        {(title || description) && (
          <div className={rc('seed-bottom-sheet__header', { headerAlign: 'left' })}>
            {title && <h2 className={rc('seed-bottom-sheet__title', { headerAlign: 'left' })}>{title}</h2>}
            {description && <p className="seed-bottom-sheet__description">{description}</p>}
          </div>
        )}
        <div className="seed-bottom-sheet__body">{children}</div>
        <button type="button" aria-label="닫기" className="seed-bottom-sheet__closeButton" onClick={onClose}>
          <Glyph name="close" width={22} height={22} />
        </button>
      </div>
    </div>
  );
}
