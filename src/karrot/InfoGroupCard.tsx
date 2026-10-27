import { Badge, Icon } from '../seed';
import type { InfoGroup } from './model';

const subtle = 'var(--seed-color-fg-neutral-subtle)';

/**
 * One 거래 정보 group ("크기 및 분해" / "가져가는 조건").
 * `detail` is the buyer/seller listing page (outlined card, change badges, pickup note);
 * `review` is the seller's pre-post preview on a basement background.
 */
export function InfoGroupCard({ group: g, variant }: { group: InfoGroup; variant: 'detail' | 'review' }) {
  const detail = variant === 'detail';
  return (
    <div
      style={{
        ...(detail
          ? { border: '1px solid var(--seed-color-stroke-neutral-muted)' }
          : { background: 'var(--seed-color-bg-layer-default)' }),
        borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 4,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{g.title}</span>
      </div>
      {g.allEmpty && <span style={{ fontSize: 14, color: 'var(--seed-color-fg-placeholder)' }}>아직 입력되지 않았어요</span>}
      {g.dims && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginBottom: 4 }}>
          {g.dims.map((c) => (
            <div
              key={c.label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '10px 4px',
                borderRadius: 8, background: 'var(--seed-color-bg-neutral-weak)',
              }}
            >
              <span style={{ fontSize: 12, color: subtle }}>{c.label}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.value}</span>
            </div>
          ))}
        </div>
      )}
      {g.rows.map((r) => {
        const value = (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, textAlign: 'right' }}>
            {r.isUnknown && <Badge tone="warning" variant="weak">모름</Badge>}
            <span style={{ fontSize: 14, lineHeight: '20px', fontWeight: r.weight, color: r.color }}>{r.value}</span>
          </div>
        );
        return (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '8px 0' }}>
            {detail ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 14, lineHeight: '20px', color: subtle }}>{r.label}</span>
                  {r.changed && <Badge tone="informative" variant="weak">변경</Badge>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, textAlign: 'right' }}>
                  {value}
                  {r.prev != null && (
                    <span style={{ fontSize: 12, lineHeight: '16px', color: subtle, textDecoration: 'line-through' }}>이전 {r.prev}</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <span style={{ fontSize: 14, lineHeight: '20px', color: subtle, flexShrink: 0 }}>{r.label}</span>
                {value}
              </>
            )}
          </div>
        );
      })}
      {detail && g.hasNote && (
        <div
          style={{
            display: 'flex', gap: 6, marginTop: 4, paddingTop: 12,
            borderTop: '1px solid var(--seed-color-stroke-neutral-muted)', color: subtle,
          }}
        >
          <Icon name="info" size={16} />
          <span className="pretty" style={{ fontSize: 13, lineHeight: '18px' }}>
            엘리베이터가 있어도 가구 크기에 따라 옮기기 어려울 수 있어요. 크기를 함께 확인해 주세요.
          </span>
        </div>
      )}
    </div>
  );
}
