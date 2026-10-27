import { cx, type Style } from './recipe';

// SVGs are inlined so `fill="currentColor"` follows the surrounding text color.
const raw = import.meta.glob<string>('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true });

const markup: Record<string, string> = {};
for (const [path, svg] of Object.entries(raw)) {
  const name = path.split('/').pop()!.replace(/\.svg$/, '');
  markup[name] = svg
    .replace(/<\?xml[^>]*>/, '')
    .replace(/\s(width|height)="[^"]*"/g, '')
    .replace('<svg', '<svg width="100%" height="100%" style="display:block"');
}

export type IconName =
  | 'add' | 'camera' | 'chatting' | 'chevron_right' | 'community' | 'edit' | 'expand_less' | 'expand_more'
  | 'heart' | 'home_fill' | 'info' | 'map' | 'more' | 'notification' | 'profile' | 'profile_fill'
  | 'search' | 'send' | 'share';

type Slot = 'icon' | 'prefix' | 'suffix' | 'none';

export interface IconProps {
  name?: IconName;
  svg?: React.ReactNode;
  size?: number | string;
  color?: string;
  slot?: Slot;
  className?: string;
  style?: Style;
}

export function Icon({ name, svg, size, color, slot = 'icon', className, style }: IconProps) {
  const base = slot === 'prefix' ? 'seed-prefix-icon' : slot === 'suffix' ? 'seed-suffix-icon' : slot === 'none' ? null : 'seed-icon';
  const st: Style = { ...style };
  if (size != null) st['--seed-icon-size'] = typeof size === 'number' ? `${size}px` : size;
  if (color) st['--seed-icon-color'] = color;
  if (slot === 'none' && size != null) {
    st.width = st['--seed-icon-size'];
    st.height = st['--seed-icon-size'];
    st.display = 'inline-block';
    st.flexShrink = 0;
  }
  if (!svg && name) {
    return <span aria-hidden="true" className={cx(base, className)} style={st} dangerouslySetInnerHTML={{ __html: markup[name] }} />;
  }
  return <span aria-hidden="true" className={cx(base, className)} style={st}>{svg}</span>;
}

export const glyphs = {
  check: 'M21.0843 4.18854C21.5325 4.51124 21.6342 5.13618 21.3115 5.58438L11.3115 19.0844C11.1361 19.3281 10.8604 19.48 10.5607 19.4982C10.2609 19.5164 9.96888 19.399 9.7652 19.1784L2.7652 11.6784C2.3906 11.2725 2.4159 10.6399 2.82172 10.2653C3.22755 9.89067 3.8602 9.91597 4.23481 10.3218L10.4041 16.9219L19.6885 4.41577C20.0112 3.96757 20.6361 3.86584 21.0843 4.18854Z',
  minus: 'M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z',
  chevronLeft: 'M16.66 3.22988C16.96 3.52988 16.96 4.01988 16.66 4.31988L8.97999 11.9999L16.66 19.6799C16.96 19.9799 16.96 20.4699 16.66 20.7699C16.36 21.0699 15.87 21.0699 15.57 20.7699L7.33999 12.5499C7.03999 12.2499 7.03999 11.7599 7.33999 11.4599L15.56 3.22988C15.86 2.92988 16.35 2.92988 16.65 3.22988H16.66Z',
  chevronRight: 'M7.34 3.23c-.3.3-.3.79 0 1.09L15.02 12l-7.68 7.68c-.3.3-.3.79 0 1.09.3.3.79.3 1.09 0l8.23-8.22c.3-.3.3-.79 0-1.09L8.44 3.23c-.3-.3-.79-.3-1.09 0Z',
  close: 'M3.73 3.73c.3-.3.79-.3 1.09 0L12 10.91l7.18-7.18c.3-.3.79-.3 1.09 0 .3.3.3.79 0 1.09L13.09 12l7.18 7.18c.3.3.3.79 0 1.09-.3.3-.79.3-1.09 0L12 13.09l-7.18 7.18c-.3.3-.79.3-1.09 0-.3-.3-.3-.79 0-1.09L10.91 12 3.73 4.82c-.3-.3-.3-.79 0-1.09Z',
};

export type GlyphName = keyof typeof glyphs;

export function Glyph({ name, ...rest }: { name: GlyphName } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d={glyphs[name]} />
    </svg>
  );
}
