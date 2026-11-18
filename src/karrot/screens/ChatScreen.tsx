import { ActionButton, AppBar, Badge, Icon } from '../../seed';
import { COLOR, pickupChecklist, won } from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

const bubble = { maxWidth: '75%', padding: '12px 16px', fontSize: 14, lineHeight: '20px', whiteSpace: 'pre-wrap' } as const;

type ChatItem = { kind: 'me' | 'them' | 'system' | 'appoint' | 'review'; text: string };

const calendarIcon = (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
  </svg>
);

export function ChatScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const items: ChatItem[] = s.msgs.map((m) => ({ kind: m.kind ?? m.from, text: m.text }));
  const buyer = s.role !== 'seller';
  if (s.role !== 'seller' && s.changes.length) {
    items.splice(Math.min(s.changesAt, items.length), 0, { kind: 'system', text: s.changes.map((c) => c.label).join(', ') });
  }
  const rows = Math.min(4, Math.max(1, s.draft.split('\n').length));

  return (
    <div data-screen-label="채팅" className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 56, flexShrink: 0 }}>
        <AppBar back onBack={a.back} title="보리네" subtitle="매너온도 41.2°C" />
      </div>
      <div
        onClick={a.chatToDetail}
        className="pressable"
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--seed-color-stroke-neutral-muted)', flexShrink: 0 }}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/table.png`}
          alt="상품 사진"
          style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', background: 'var(--seed-color-bg-neutral-weak)', flexShrink: 0 }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {s.sold && <Badge tone="neutral" variant="solid">거래완료</Badge>}
            {s.reserved && !s.sold && <Badge tone="positive" variant="solid">예약중</Badge>}
            <span style={{ fontSize: 14, lineHeight: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.listing.title}</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{won(s.listing.price)}</span>
        </div>
        <span style={{ fontSize: 12, color: COLOR.sub }}>상품 정보</span>
        <Icon name="chevron_right" size={16} />
      </div>
      {buyer && !s.sold && s.msgs.some((m) => m.from === 'them') && (
        <div style={{ display: 'flex', gap: 8, padding: '8px 16px', borderBottom: '1px solid var(--seed-color-stroke-neutral-muted)', flexShrink: 0 }}>
          {s.appoint ? (
            <ActionButton variant="neutralWeak" size="small" onClick={a.openReview}>거래했어요 · 후기 보내기</ActionButton>
          ) : (
            <ActionButton variant="neutralWeak" size="small" onClick={a.openAppoint}>약속 잡기</ActionButton>
          )}
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
        <span style={{ alignSelf: 'center', fontSize: 12, color: COLOR.sub, padding: '4px 0 8px' }}>오늘</span>
        {items.map((m, i) =>
          m.kind === 'appoint' && s.appoint ? (
            <div
              key={i}
              style={{
                alignSelf: 'flex-end', width: '78%', display: 'flex', flexDirection: 'column', gap: 8, padding: 16,
                borderRadius: 16, border: '1px solid var(--seed-color-stroke-neutral-muted)', background: 'var(--seed-color-bg-layer-default)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLOR.brand }}>
                {calendarIcon}
                <span style={{ fontSize: 14, fontWeight: 600 }}>약속을 만들었어요</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', rowGap: 4, fontSize: 14, lineHeight: '20px' }}>
                <span style={{ color: COLOR.sub }}>일시</span>
                <span style={{ fontWeight: 600 }}>{s.appoint.day} {s.appoint.time}</span>
                <span style={{ color: COLOR.sub }}>장소</span>
                <span>{s.appoint.place}</span>
              </div>
              {pickupChecklist(s.listing) && (
                <span style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--seed-color-bg-neutral-weak)', fontSize: 12, lineHeight: '18px', color: COLOR.muted }}>
                  가져갈 때 확인 · {pickupChecklist(s.listing)}
                </span>
              )}
            </div>
          ) : m.kind === 'review' ? (
            <div
              key={i}
              style={{ alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '12px 16px', margin: '8px 0', borderRadius: 12, background: 'var(--seed-color-bg-neutral-weak)', textAlign: 'center' }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>보리네님에게 거래 후기를 보냈어요</span>
              <span className="pretty" style={{ fontSize: 12, lineHeight: '18px', color: COLOR.sub }}>{m.text}</span>
            </div>
          ) : m.kind === 'system' ? (
            <div
              key={i}
              style={{
                alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 16px', margin: '4px 0',
                borderRadius: 12, border: '1px solid var(--seed-color-stroke-neutral-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="edit" size={16} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>판매자가 상품 정보를 수정했어요</span>
              </div>
              <span style={{ fontSize: 12, lineHeight: '18px', color: COLOR.sub }}>변경된 항목 · {m.text}</span>
              <ActionButton variant="neutralWeak" size="small" onClick={a.chatToChanges}>최신 정보 확인하기</ActionButton>
            </div>
          ) : m.kind === 'me' ? (
            <div
              key={i}
              style={{
                ...bubble, alignSelf: 'flex-end', borderRadius: '18px 18px 4px 18px',
                background: 'var(--seed-color-bg-brand-solid)', color: 'var(--seed-color-fg-on-brand-solid)',
              }}
            >
              {m.text}
            </div>
          ) : (
            <div key={i} style={{ ...bubble, alignSelf: 'flex-start', borderRadius: '18px 18px 18px 4px', background: 'var(--seed-color-bg-neutral-weak)' }}>
              {m.text}
            </div>
          ),
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '8px 12px 12px', borderTop: '1px solid var(--seed-color-stroke-neutral-muted)', flexShrink: 0 }}>
        <div style={{ display: 'flex', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', color: COLOR.muted }}>
          <Icon name="add" size={24} />
        </div>
        <textarea
          value={s.draft}
          onChange={(e) => a.setDraft(e.target.value)}
          rows={rows}
          placeholder="메시지 보내기"
          style={{
            flex: 1, resize: 'none', border: 'none', borderRadius: 20, padding: '12px 16px', background: 'var(--seed-color-bg-neutral-weak)',
            font: 'inherit', fontSize: 14, lineHeight: '20px', color: COLOR.fg,
          }}
        />
        <div
          onClick={a.send}
          role="button"
          aria-label="보내기"
          style={{
            display: 'flex', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            color: s.draft.trim() ? COLOR.brand : 'var(--seed-color-fg-disabled)',
          }}
        >
          <Icon name="send" size={26} />
        </div>
      </div>
    </div>
  );
}
