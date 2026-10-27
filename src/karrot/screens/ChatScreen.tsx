import { ActionButton, AppBar, Icon } from '../../seed';
import { COLOR, won } from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

const bubble = { maxWidth: '75%', padding: '10px 14px', fontSize: 15, lineHeight: '21px', whiteSpace: 'pre-wrap' } as const;

type ChatItem = { kind: 'me' | 'them'; text: string } | { kind: 'system'; text: string };

export function ChatScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const items: ChatItem[] = s.msgs.map((m) => ({ kind: m.from, text: m.text }));
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
          src="/images/table.png"
          alt="상품 사진"
          style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', background: 'var(--seed-color-bg-neutral-weak)', flexShrink: 0 }}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: 14, lineHeight: '20px' }}>{s.listing.title}</span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{won(s.listing.price)}</span>
        </div>
        <span style={{ fontSize: 13, color: COLOR.sub }}>상품 정보</span>
        <Icon name="chevron_right" size={16} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
        <span style={{ alignSelf: 'center', fontSize: 12, color: COLOR.sub, padding: '4px 0 8px' }}>오늘</span>
        {items.map((m, i) =>
          m.kind === 'system' ? (
            <div
              key={i}
              style={{
                alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 8, padding: '14px 16px', margin: '4px 0',
                borderRadius: 12, border: '1px solid var(--seed-color-stroke-neutral-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="edit" size={16} />
                <span style={{ fontSize: 14, fontWeight: 700 }}>판매자가 상품 정보를 수정했어요</span>
              </div>
              <span style={{ fontSize: 13, lineHeight: '18px', color: COLOR.sub }}>변경된 항목 · {m.text}</span>
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
            flex: 1, resize: 'none', border: 'none', borderRadius: 20, padding: '10px 16px', background: 'var(--seed-color-bg-neutral-weak)',
            font: 'inherit', fontSize: 15, lineHeight: '20px', color: COLOR.fg,
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
