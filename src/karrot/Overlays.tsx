import { ActionButton, BottomSheet, Checkbox, Snackbar } from '../seed';
import { COLOR, LABELS, QUESTIONS, listingInfo } from './model';
import { warnSizes } from './screens/FormScreen';
import type { KarrotAppModel } from './useKarrotApp';

const divider = '1px solid var(--seed-color-stroke-neutral-muted)';

export function AskSheet({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const info = listingInfo(s.listing);
  const missing = [...info.empties, ...info.unknowns];
  const n = s.askSel.length;
  return (
    <BottomSheet
      contained
      title="어떤 정보가 궁금하세요?"
      description="고른 질문이 채팅 입력창에 추가돼요. 보내기 전에 고치거나 지울 수 있어요."
      onClose={a.closeSheet}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 16 }}>
        {missing.map((k) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 0', borderBottom: divider }}>
            <Checkbox label={QUESTIONS[k]} checked={s.askSel.includes(k)} onCheckedChange={() => a.toggleAsk(k)} />
            <span style={{ fontSize: 12, color: COLOR.sub, paddingLeft: 32 }}>
              {info.unknowns.includes(k) ? '판매자도 모름 · ' : '미입력 · '}
              {LABELS[k]}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <ActionButton variant="brandSolid" size="large" flexGrow disabled={n === 0} onClick={a.addQuestions}>
          {n ? `질문 ${n}개 추가하기` : '질문을 골라주세요'}
        </ActionButton>
      </div>
    </BottomSheet>
  );
}

export function ChangesSheet({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  return (
    <BottomSheet contained title="변경된 정보" description="판매자가 10분 전에 수정했어요" onClose={a.closeSheet}>
      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 16 }}>
        {s.changes.map((c) => (
          <div key={c.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 0', borderBottom: divider }}>
            <span style={{ fontSize: 13, color: COLOR.sub }}>{c.label}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, color: COLOR.sub, textDecoration: 'line-through' }}>{c.prev}</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{c.cur}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <ActionButton variant="neutralSolid" size="large" flexGrow onClick={a.confirmChanges}>최신 정보 확인하기</ActionButton>
      </div>
    </BottomSheet>
  );
}

/** Centered re-check dialog shown when the seller submits with an oversized dimension (S6). */
export function SizeDialog({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', background: 'var(--seed-color-bg-overlay)',
      }}
    >
      <div
        role="alertdialog"
        aria-labelledby="size-dialog-title"
        style={{
          width: '100%', maxWidth: 326, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24,
          padding: '28px 20px 20px', borderRadius: 20, background: 'var(--seed-color-bg-layer-floating)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 4px' }}>
          <span id="size-dialog-title" className="pretty" style={{ fontSize: 20, lineHeight: '27px', fontWeight: 700, letterSpacing: -0.2 }}>
            입력한 크기를 다시 확인해 주세요
          </span>
          <span className="pretty" style={{ fontSize: 15, lineHeight: '22px', color: COLOR.muted }}>
            {warnSizes(s.form)}로 입력했어요. 일반적인 가구보다 커요. 이 크기가 맞나요?
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex' }}>
            <ActionButton variant="neutralWeak" size="large" flexGrow onClick={a.sizeEdit}>다시 입력하기</ActionButton>
          </div>
          <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex' }}>
            <ActionButton variant="neutralSolid" size="large" flexGrow onClick={a.sizeOkProceed}>맞아요</ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SnackbarSlot({ app: { state: s } }: { app: KarrotAppModel }) {
  if (!s.snack) return null;
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, bottom: 92, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
      <Snackbar message={s.snack.msg} actionLabel={s.snack.actionLabel} onAction={s.snack.onAction} />
    </div>
  );
}
