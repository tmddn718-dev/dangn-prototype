import { AppBar, Badge, FloatingActionButton } from '../../seed';
import { BottomNav } from '../BottomNav';
import { COLOR, catalog } from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

const plusIcon = (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="currentColor">
    <path d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1Z" />
  </svg>
);

export function HomeScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const items = catalog(s.listing);
  return (
    <div data-screen-label="홈" className="screen">
      <AppBar title="역삼동" titleAlign="left" right={[{ icon: 'search', label: '검색', onClick: a.openSearch }, { icon: 'notification', label: '알림' }]} />
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, bottom: 64, overflowY: 'auto' }}>
        {items.map((it) => (
          <div
            key={it.title}
            onClick={() => a.openItem(it)}
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
              <div style={{ fontSize: 12, lineHeight: '18px', color: COLOR.sub }}>{it.meta}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {it.id === 'table' && s.sold && <Badge tone="neutral" variant="solid">거래완료</Badge>}
                {it.id === 'table' && s.reserved && !s.sold && <Badge tone="positive" variant="solid">예약중</Badge>}
                <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 600 }}>{it.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', right: 16, bottom: 80 }}>
        <FloatingActionButton extended label="글쓰기" icon={plusIcon} onClick={a.startWrite} />
      </div>
      <BottomNav active="home" onTab={a.tab} chatBadge={s.msgs.length > 0} />
    </div>
  );
}
