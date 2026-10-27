import type { ReactNode } from 'react';
import { ActionButton, AppBar, Badge, Callout, Chip, Icon, TextField } from '../../seed';
import {
  COLOR, DELIVER_OPTS, DIMS, DISAS_OPTS, ELEVATOR_OPTS, HELP_OPTS, LABELS, dimIssue,
  type ChoiceKey, type Listing,
} from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

const stroke = '1px solid var(--seed-color-stroke-neutral-muted)';
const fieldLabel = { fontSize: 14, fontWeight: 500 } as const;

/** "가로 1,400cm, 세로 …" for the oversized dimensions. */
export const warnSizes = (f: Listing) =>
  DIMS.filter((k) => dimIssue(f[k]) === 'warn')
    .map((k) => `${LABELS[k]} ${Number(f[k]).toLocaleString('ko-KR')}cm`)
    .join(', ');

function GroupHeader({ title, sub, filled, total, open, onToggle }: {
  title: string; sub: string; filled: number; total: number; open: boolean; onToggle: () => void;
}) {
  return (
    <div onClick={onToggle} className="pressable" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{title}</span>
        <span style={{ fontSize: 13, color: COLOR.sub }}>{sub}</span>
      </div>
      <span style={{ fontSize: 13, color: filled ? COLOR.brand : COLOR.sub }}>{filled ? `${filled}/${total} 입력` : '선택'}</span>
      <Icon name={open ? 'expand_less' : 'expand_more'} size={20} />
    </div>
  );
}

function ChoiceField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {hint ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={fieldLabel}>{label}</span>
          <span style={{ fontSize: 12, color: COLOR.sub }}>{hint}</span>
        </div>
      ) : (
        <span style={fieldLabel}>{label}</span>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
    </div>
  );
}

export function FormScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const f = s.form;
  const edit = s.mode === 'edit';
  const hasError = DIMS.some((k) => dimIssue(f[k]) === 'error');
  const hasWarn = DIMS.some((k) => dimIssue(f[k]) === 'warn');
  const productFilled = (['w', 'd', 'h', 'disas'] as const).filter((k) => f[k]).length;
  const pickupFilled = (['floor', 'elevator', 'help'] as const).filter((k) => f[k]).length;

  const chips = (k: ChoiceKey, opts: Record<string, string>) =>
    Object.entries(opts).map(([v, label]) => (
      <Chip key={v} variant="outlineStrong" checked={f[k] === v} onCheckedChange={() => a.pick(k, v)}>
        {label}
      </Chip>
    ));

  return (
    <div data-screen-label="판매글 작성" className="screen">
      <AppBar title={edit ? '게시글 수정' : '내 물건 팔기'} left={[{ glyph: 'close', label: '닫기', onClick: a.back }]} divider />
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, bottom: 77, overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 16px 40px' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div
              style={{
                width: 72, height: 72, borderRadius: 8, border: stroke, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2, color: COLOR.sub, boxSizing: 'border-box',
              }}
            >
              <Icon name="camera" size={24} />
              <span style={{ fontSize: 12 }}>1/10</span>
            </div>
            <img
              src="/images/table.png"
              alt="상품 사진"
              style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', background: 'var(--seed-color-bg-neutral-weak)' }}
            />
          </div>
          <TextField label="제목" placeholder="글 제목" value={f.title} onValueChange={(v) => a.setForm('title', v)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={fieldLabel}>카테고리</span>
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, padding: '0 16px',
                borderRadius: 8, border: stroke, fontSize: 16,
              }}
            >
              가구/인테리어
              <Icon name="chevron_right" size={18} />
            </div>
          </div>
          <TextField label="가격" prefix="₩" placeholder="가격을 입력해 주세요" inputMode="numeric" value={f.price} onValueChange={(v) => a.setForm('price', v)} />
          <TextField
            label="자세한 설명"
            multiline
            rows={4}
            placeholder="역삼동에 올릴 게시글 내용을 작성해 주세요"
            value={f.desc}
            onValueChange={(v) => a.setForm('desc', v)}
          />

          <div style={{ height: 8, margin: '0 -16px', background: 'var(--seed-color-bg-layer-basement)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}>가구 정보</span>
                <Badge tone="neutral" variant="weak">선택</Badge>
              </div>
              <span className="pretty" style={{ fontSize: 14, lineHeight: '20px', color: COLOR.sub }}>
                입력하면 이웃이 채팅 전에 거래 조건을 확인할 수 있어요. 아는 항목만 입력해도 괜찮아요.
              </span>
            </div>

            <div style={{ border: stroke, borderRadius: 12, overflow: 'hidden' }}>
              <GroupHeader title="상품 정보" sub="크기, 분해 여부" filled={productFilled} total={4} open={s.open.p} onToggle={() => a.toggleGroup('p')} />
              {s.open.p && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '4px 16px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                      <span style={fieldLabel}>크기</span>
                      <span style={{ fontSize: 12, color: COLOR.sub }}>단위 cm · 일부만 입력해도 돼요</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
                      {DIMS.map((k) => (
                        <TextField
                          key={k}
                          label={LABELS[k]}
                          suffix="cm"
                          placeholder="0"
                          size="medium"
                          inputMode="decimal"
                          invalid={dimIssue(f[k]) === 'error'}
                          value={f[k]}
                          onValueChange={(v) => a.setForm(k, v)}
                        />
                      ))}
                    </div>
                    {hasError && (
                      <span style={{ fontSize: 13, lineHeight: '18px', color: 'var(--seed-color-fg-critical)' }}>0보다 큰 숫자로 입력해 주세요</span>
                    )}
                    {hasWarn && !s.sizeOk && (
                      <Callout
                        tone="warning"
                        title="입력한 크기를 다시 확인해 주세요."
                        description={`${warnSizes(f)}로 입력했어요. 일반적인 가구보다 커요.`}
                        linkLabel="이 크기가 맞아요"
                        onLinkClick={a.confirmSize}
                      />
                    )}
                  </div>
                  <ChoiceField label="분해할 수 있나요?">{chips('disas', DISAS_OPTS)}</ChoiceField>
                  {f.disas === 'yes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderRadius: 8, background: 'var(--seed-color-bg-neutral-weak)' }}>
                      <span style={fieldLabel}>거래할 때 어떤 상태로 전달하나요?</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{chips('deliver', DELIVER_OPTS)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ border: stroke, borderRadius: 12, overflow: 'hidden' }}>
              <GroupHeader title="가져가는 조건" sub="층수, 엘리베이터, 운반 도움" filled={pickupFilled} total={3} open={s.open.t} onToggle={() => a.toggleGroup('t')} />
              {s.open.t && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '4px 16px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: '50%' }}>
                    <TextField label="층수" suffix="층" placeholder="예: 3" size="medium" inputMode="numeric" value={f.floor} onValueChange={(v) => a.setForm('floor', v)} />
                  </div>
                  <ChoiceField label="엘리베이터가 있나요?">{chips('elevator', ELEVATOR_OPTS)}</ChoiceField>
                  <ChoiceField label="옮길 때 도와줄 수 있나요?" hint="구매자가 가구를 옮길 때 함께 들어줄 수 있는지 알려주세요">
                    {chips('help', HELP_OPTS)}
                  </ChoiceField>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-bar">
        <ActionButton variant="brandSolid" size="large" flexGrow onClick={a.submitForm}>
          {edit ? '수정 완료' : '작성 완료'}
        </ActionButton>
      </div>
    </div>
  );
}
