import type { CSSProperties } from 'react';

// Class-name helpers matching the SEED recipe CSS naming
// (`seed-<comp>__<slot>--<variant>_<value>` plus `data-*` state attributes).

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');

type Vars = Record<string, string | number | boolean | null | undefined>;

export function rc(base: string, vars?: Vars, pairs?: [string, string][]) {
  const out = [base];
  for (const k in vars || {}) {
    const v = vars![k];
    if (v != null && v !== false) out.push(`${base}--${k}_${v}`);
  }
  for (const [a, b] of pairs || []) {
    if (vars?.[a] != null && vars?.[b] != null) out.push(`${base}--${a}_${vars[a]}-${b}_${vars[b]}`);
  }
  return out.join(' ');
}

/** Boolean data attribute: present (`""`) when on, omitted otherwise. */
export const da = (on: unknown) => (on ? '' : undefined);

/** CSSProperties that also accepts custom properties. */
export type Style = CSSProperties & Record<`--${string}`, string | number | undefined>;
