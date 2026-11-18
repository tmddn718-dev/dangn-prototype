import { Badge, Chip, Glyph, Icon } from '../../seed';
import { COLOR, SEARCH_SUGGESTIONS, catalog, searchCatalog, type CatalogItem } from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

const stroke = '1px solid var(--seed-color-stroke-neutral-muted)';

function ResultRow({ it, badge, onClick }: { it: CatalogItem; badge?: 'sold' | 'reserved'; onClick: () => void }) {
  return (
    <div onClick={onClick} className="pressable" style={{ display: 'flex', gap: 16, padding: 16, borderBottom: stroke }}>
      <img
        src={it.img}
        alt={it.title}
        style={{ width: 108, height: 108, borderRadius: 8, objectFit: 'cover', background: 'var(--seed-color-bg-neutral-weak)', flexShrink: 0 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{ fontSize: 16, lineHeight: '22px' }}>{it.title}</div>
        <div style={{ fontSize: 12, lineHeight: '18px', color: COLOR.sub }}>{it.meta}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {badge === 'sold' && <Badge tone="neutral" variant="solid">거래완료</Badge>}
          {badge === 'reserved' && <Badge tone="positive" variant="solid">예약중</Badge>}
          <span style={{ fontSize: 16, lineHeight: '22px', fontWeight: 600 }}>{it.price}</span>
        </div>
        <span style={{ marginTop: 2, fontSize: 12, lineHeight: '18px', color: it.info ? COLOR.muted : COLOR.ph }}>
          {it.info ? `크기 ${it.info}` : '크기 정보 없음'}
        </span>
      </div>
    </div>
  );
}

/** Buyer search (F1–F3): keyword → results, with a filter for listings that have furniture info. */
export function SearchScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const items = catalog(s.listing);
  const results = s.searched ? searchCatalog(items, s.query, s.sizeOnly) : [];
  const total = s.searched ? searchCatalog(items, s.query, false).length : 0;
  const tableBadge = s.sold ? 'sold' : s.reserved ? 'reserved' : undefined;

  return (
    <div data-screen-label="검색" className="screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          a.search();
        }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, display: 'flex', alignItems: 'center', gap: 4, padding: '0 16px 0 4px', boxSizing: 'border-box' }}
      >
        <button type="button" aria-label="뒤로" onClick={a.back} style={{ display: 'flex', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', border: 0, background: 'none', color: COLOR.fg, cursor: 'pointer' }}>
          <Glyph name="chevronLeft" width={24} height={24} />
        </button>
        <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 12px', borderRadius: 8, background: 'var(--seed-color-bg-neutral-weak)' }}>
          <Icon name="search" size={18} color={COLOR.sub} />
          <input
            id="karrot-search"
            aria-label="검색어"
            value={s.query}
            onChange={(e) => a.setQuery(e.target.value)}
            placeholder="역삼동 근처에서 검색"
            enterKeyHint="search"
            style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'none', font: 'inherit', fontSize: 16, color: COLOR.fg }}
          />
        </label>
      </form>

      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, bottom: 0, overflowY: 'auto' }}>
        {!s.searched ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 16px 24px' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>추천 검색어</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SEARCH_SUGGESTIONS.map((k) => (
                <Chip key={k} variant="outlineWeak" size="medium" checked={false} onCheckedChange={() => a.search(k)}>
                  {k}
                </Chip>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px 12px', borderBottom: stroke }}>
              <Chip variant="outlineStrong" size="small" checked={s.sizeOnly} onCheckedChange={a.toggleSizeOnly}>
                크기 정보 있는 글만
              </Chip>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: COLOR.sub }}>
                {s.sizeOnly ? `${total}개 중 ${results.length}개` : `${results.length}개`}
              </span>
            </div>
            {results.map((it) => (
              <ResultRow key={it.id} it={it} badge={it.id === 'table' ? tableBadge : undefined} onClick={() => a.openItem(it)} />
            ))}
            {results.length === 0 && (
              <p style={{ margin: 0, padding: '48px 16px', textAlign: 'center', fontSize: 14, lineHeight: '20px', color: COLOR.sub }}>
                '{s.query}'에 맞는 판매글이 없어요.
                <br />
                다른 검색어로 찾아보세요.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
