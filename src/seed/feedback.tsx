import { cx, da, rc, type Style } from './recipe';
import type { Tone } from './display';

export interface CalloutProps {
  tone?: Exclude<Tone, 'brand'> | 'magic';
  title?: string;
  description: string;
  linkLabel?: string;
  onLinkClick?: () => void;
  className?: string;
  style?: Style;
}

export function Callout({ tone = 'neutral', title, description, linkLabel, onLinkClick, className, style }: CalloutProps) {
  const t = { tone };
  return (
    <div className={cx(rc('seed-callout__root', t), className)} style={style}>
      <div className="seed-callout__content">
        {title && <span className={rc('seed-callout__title', t)}>{title}</span>}
        <span className={rc('seed-callout__description', t)}>{description}</span>
        {linkLabel && (
          <button type="button" className={rc('seed-callout__link', t)} onClick={onLinkClick}>
            {linkLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export interface PageBannerProps {
  tone?: Exclude<Tone, 'brand'>;
  variant?: 'weak' | 'solid';
  title?: string;
  description: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  className?: string;
  style?: Style;
}

export function PageBanner({ tone = 'neutral', variant = 'weak', title, description, buttonLabel, onButtonClick, className, style }: PageBannerProps) {
  const k = `--tone_${tone}-variant_${variant}`;
  return (
    <div className={cx(`seed-page-banner__root seed-page-banner__root${k}`, className)} style={style}>
      <div className="seed-page-banner__content">
        <div className="seed-page-banner__body">
          {title && <span className={`seed-page-banner__title seed-page-banner__title${k}`}>{title}</span>}
          <span className={`seed-page-banner__description seed-page-banner__description${k}`}>{description}</span>
        </div>
        {buttonLabel && (
          <button type="button" className={`seed-page-banner__button seed-page-banner__button${k}`} onClick={onButtonClick}>
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export interface SnackbarProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  open?: boolean;
  className?: string;
  style?: Style;
}

export function Snackbar({ message, actionLabel, onAction, open = true, className, style }: SnackbarProps) {
  return (
    <div role="status" className={cx('seed-snackbar__root', className)} data-open={da(open)} style={style}>
      <div className="seed-snackbar__content">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="seed-snackbar__message">{message}</span>
        </span>
        {actionLabel && (
          <button type="button" className="seed-snackbar__actionButton" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
