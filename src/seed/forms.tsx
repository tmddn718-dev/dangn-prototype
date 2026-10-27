import { useState, type ChangeEvent, type HTMLAttributes, type ReactNode } from 'react';
import { cx, da, rc, type Style } from './recipe';
import { Glyph } from './Icon';

export interface ChipProps {
  variant?: 'solid' | 'outlineStrong' | 'outlineWeak';
  size?: 'small' | 'medium' | 'large';
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: Style;
  children: ReactNode;
}

export function Chip({ variant = 'solid', size = 'medium', checked, onCheckedChange, disabled, className, style, children }: ChipProps) {
  const v = { variant, size };
  const st = { 'data-checked': da(checked), 'data-disabled': da(disabled) };
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      className={cx(rc('seed-chip__root', v), `seed-chip__root--size_${size}-layout_withText`, className)}
      {...st}
      onClick={() => onCheckedChange(!checked)}
      style={{ '--seed-feedback-scale': 0.95, ...style } as Style}
    >
      <span className={rc('seed-chip__label', v)} {...st}>{children}</span>
    </button>
  );
}

type CheckSize = 'medium' | 'large';

function Checkmark({ checked, disabled, size }: { checked: boolean; disabled?: boolean; size: CheckSize }) {
  const v = { variant: 'square', tone: 'brand', size };
  const st = { 'data-checked': da(checked), 'data-disabled': da(disabled) };
  return (
    <div className={rc('seed-checkmark__root', v, [['variant', 'tone']])} {...st} style={{ '--seed-feedback-scale': 0.92 } as Style}>
      {checked && <Glyph name="check" className={rc('seed-checkmark__icon', v, [['variant', 'tone'], ['size', 'variant']])} {...st} />}
    </div>
  );
}

export interface CheckboxProps {
  label?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: CheckSize;
  weight?: 'regular' | 'bold';
  className?: string;
  style?: Style;
}

export function Checkbox({ label, checked, onCheckedChange, disabled, size = 'medium', weight = 'regular', className, style }: CheckboxProps) {
  return (
    <label className={cx(rc('seed-checkbox__root', { size }), className)} data-disabled={da(disabled)} style={{ position: 'relative', ...style }}>
      <Checkmark checked={checked} disabled={disabled} size={size} />
      {label != null && (
        <span className={rc('seed-checkbox__label', { weight, size })} data-disabled={da(disabled)}>
          {label}
        </span>
      )}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, margin: 0, pointerEvents: 'none' }}
      />
    </label>
  );
}

export interface TextFieldProps {
  label?: string;
  invalid?: boolean;
  disabled?: boolean;
  size?: 'medium' | 'large';
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  multiline?: boolean;
  rows?: number;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  className?: string;
  style?: Style;
}

export function TextField({
  label, invalid, disabled, size = 'large', placeholder, value, onValueChange, prefix, suffix,
  multiline = false, rows = 3, inputMode, className, style,
}: TextFieldProps) {
  const [focus, setFocus] = useState(false);
  const variant = 'outline';
  const k = { variant, size };
  const vs = `--variant_${variant}-size_${size}`;
  const st = { 'data-invalid': da(invalid), 'data-disabled': da(disabled), 'data-focus': da(focus) };
  const inputProps = {
    className: rc('seed-text-input__value', k, [['variant', 'size']]),
    ...st,
    placeholder,
    value,
    disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onValueChange(e.target.value),
  };
  return (
    <div className={cx('seed-field__root', className)} data-invalid={da(invalid)} style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {label && (
        <div className="seed-field__header">
          <label className={rc('seed-field-label__root', { weight: 'medium' })}>{label}</label>
        </div>
      )}
      <div
        className={rc('seed-text-input__root', k, [['variant', 'size']])}
        {...st}
        style={multiline ? { height: 'auto', alignItems: 'flex-start' } : undefined}
      >
        {prefix && <span className={`seed-text-input__prefixText seed-text-input__prefixText${vs}`}>{prefix}</span>}
        {multiline ? (
          <textarea {...inputProps} rows={rows} style={{ resize: 'none', paddingBlock: 13 }} />
        ) : (
          <input {...inputProps} inputMode={inputMode} />
        )}
        {suffix && <span className={`seed-text-input__suffixText seed-text-input__suffixText${vs}`}>{suffix}</span>}
      </div>
    </div>
  );
}
