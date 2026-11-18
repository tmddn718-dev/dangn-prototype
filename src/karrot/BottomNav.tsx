import { Icon, type IconName } from '../seed';
import { COLOR } from './model';

const NAV: { label: string; icon: IconName; tab?: 'home' | 'chats' }[] = [
  { label: '홈', icon: 'home_fill', tab: 'home' },
  { label: '동네생활', icon: 'community' },
  { label: '동네지도', icon: 'map' },
  { label: '채팅', icon: 'chatting', tab: 'chats' },
  { label: '나의 당근', icon: 'profile' },
];

/** The app's bottom tab bar. Only 홈 and 채팅 are part of the prototype. */
export function BottomNav({ active, onTab, chatBadge }: { active: 'home' | 'chats'; onTab: (t: 'home' | 'chats') => void; chatBadge?: boolean }) {
  return (
    <nav
      aria-label="하단 메뉴"
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
        borderTop: '1px solid var(--seed-color-stroke-neutral-muted)', background: 'var(--seed-color-bg-layer-default)',
      }}
    >
      {NAV.map((n) => {
        const on = n.tab === active;
        return (
          <button
            key={n.label}
            type="button"
            disabled={!n.tab}
            aria-current={on ? 'page' : undefined}
            onClick={n.tab ? () => onTab(n.tab!) : undefined}
            style={{
              position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              border: 0, background: 'none', font: 'inherit', padding: 0, cursor: n.tab ? 'pointer' : 'default',
              color: on ? COLOR.fg : COLOR.sub,
            }}
          >
            <Icon name={n.icon} size={24} />
            <span style={{ fontSize: 11, lineHeight: '14px' }}>{n.label}</span>
            {chatBadge && n.tab === 'chats' && (
              <span aria-label="새 메시지" style={{ position: 'absolute', top: 10, left: 'calc(50% + 8px)', width: 6, height: 6, borderRadius: 999, background: 'var(--seed-color-bg-brand-solid)' }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
