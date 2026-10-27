import { AppBar, Badge, FloatingActionButton, Icon, type IconName } from '../../seed';
import { COLOR, won } from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

const NAV: { label: string; icon: IconName; active?: boolean }[] = [
  { label: '홈', icon: 'home_fill', active: true },
  { label: '동네생활', icon: 'community' },
  { label: '동네지도', icon: 'map' },
  { label: '채팅', icon: 'chatting' },
  { label: '나의 당근', icon: 'profile' },
];

const plusIcon = (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
    <path d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1Z" />
  </svg>
);

export function HomeScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const items = [
    { title: s.listing.title, img: '/images/table.png', meta: '역삼동 · 10분 전', price: won(s.listing.price), sold: s.sold, onClick: a.openDetail },
    { title: '패브릭 3인용 소파', img: '/images/sofa.png', meta: '논현동 · 32분 전', price: '80,000원', sold: false },
    { title: '이케아 5단 책장', img: '/images/bookshelf.png', meta: '도곡동 · 1시간 전', price: '25,000원', sold: false },
    { title: '퀸 사이즈 침대 프레임', img: '/images/bed.png', meta: '역삼동 · 어제', price: '나눔', sold: false },
  ];
  return (
    <div data-screen-label="홈" className="screen">
      <AppBar title="역삼동" titleAlign="left" right={[{ icon: 'search', label: '검색' }, { icon: 'notification', label: '알림' }]} />
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, bottom: 64, overflowY: 'auto' }}>
        {items.map((it) => (
          <div
            key={it.title}
            onClick={it.onClick}
            className="pressable"
            style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid var(--seed-color-stroke-neutral-muted)' }}
          >
            <img
              src={it.img}
              alt={it.title}
              style={{ width: 108, height: 108, borderRadius: 8, objectFit: 'cover', background: 'var(--seed-color-bg-neutral-weak)', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <div style={{ fontSize: 16, lineHeight: '22px' }}>{it.title}</div>
              <div style={{ fontSize: 13, lineHeight: '18px', color: COLOR.sub }}>{it.meta}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {it.sold && <Badge tone="neutral" variant="solid">거래완료</Badge>}
                <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700 }}>{it.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', right: 16, bottom: 80 }}>
        <FloatingActionButton extended label="글쓰기" icon={plusIcon} onClick={a.startWrite} />
      </div>
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
          borderTop: '1px solid var(--seed-color-stroke-neutral-muted)', background: 'var(--seed-color-bg-layer-default)',
        }}
      >
        {NAV.map((n) => (
          <div
            key={n.label}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: n.active ? COLOR.fg : COLOR.sub }}
          >
            <Icon name={n.icon} size={24} />
            <span style={{ fontSize: 11, lineHeight: '14px' }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
