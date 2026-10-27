import { ActionButton, AppBar, Callout } from '../../seed';
import { InfoGroupCard } from '../InfoGroupCard';
import { listingInfo, won } from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

export function ReviewScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const info = listingInfo(s.form);
  return (
    <div data-screen-label="입력 정보 확인" className="screen">
      <AppBar back onBack={a.back} title="입력 정보 확인" divider />
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, bottom: 77, overflowY: 'auto', background: 'var(--seed-color-bg-layer-basement)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
          <Callout tone="informative" description="구매자에게 이렇게 보여요. 입력하지 않은 항목은 '아직 입력되지 않았어요'로 표시돼요." />
          <div style={{ background: 'var(--seed-color-bg-layer-default)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <img
              src="/images/table.png"
              alt="상품 사진"
              style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', background: 'var(--seed-color-bg-neutral-weak)', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 16, lineHeight: '22px' }}>{s.form.title}</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{won(s.form.price)}</span>
            </div>
          </div>
          {info.groups.map((g) => (
            <InfoGroupCard key={g.title} group={g} variant="review" />
          ))}
          {info.furnitureEmpty && (
            <Callout tone="neutral" description="가구 정보 없이도 등록할 수 있어요. 등록한 뒤에도 언제든 추가할 수 있어요." />
          )}
        </div>
      </div>
      <div className="bottom-bar" style={{ gap: 8 }}>
        <ActionButton variant="neutralWeak" size="large" onClick={a.back}>수정하기</ActionButton>
        <ActionButton variant="brandSolid" size="large" flexGrow onClick={a.register}>이대로 등록하기</ActionButton>
      </div>
    </div>
  );
}
