import { ActionButton, AppBar, Badge, Icon, MannerTempBadge, PageBanner, ProgressCircle, Skeleton } from '../../seed';
import { InfoGroupCard } from '../InfoGroupCard';
import { COLOR, LABELS, listingInfo, won, type InfoKey } from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

const stroke = '1px solid var(--seed-color-stroke-neutral-muted)';
const rowLabel = { fontSize: 14, lineHeight: '20px', color: COLOR.sub } as const;
const card = { border: stroke, borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 4 } as const;
const labels = (ks: InfoKey[]) => ks.map((k) => LABELS[k]).join(', ');

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 20px 24px', borderRadius: 12, border: stroke, textAlign: 'center' }}>
      <div
        style={{
          display: 'flex', width: 48, height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
          background: 'var(--seed-color-bg-neutral-weak)', color: COLOR.sub,
        }}
      >
        <Icon name="info" size={24} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 17, lineHeight: '24px', fontWeight: 700 }}>거래 정보를 불러오지 못했어요</span>
        <span className="pretty" style={{ fontSize: 14, lineHeight: '20px', color: COLOR.sub }}>
          일시적인 문제로 정보를 보여드리지 못했어요.
          <br />
          잠시 후 다시 시도해 주세요.
        </span>
      </div>
      <ActionButton variant="neutralWeak" size="medium" onClick={onRetry}>다시 시도</ActionButton>
    </div>
  );
}

// SEED has no 4px skeleton radius step; the design asks for 4px on these value placeholders.
const bar = (width: number) => <Skeleton width={width} height={18} style={{ borderRadius: 4 }} />;

function LoadingCards() {
  const skRow = (label: string, width: number) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
      <span style={rowLabel}>{label}</span>
      {bar(width)}
    </div>
  );
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'var(--seed-color-bg-neutral-weak)' }}>
        <ProgressCircle size="24" />
        <span style={{ fontSize: 14, color: COLOR.muted }}>거래 정보를 다시 불러오고 있어요</span>
      </div>
      <div style={card}>
        <span style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>크기 및 분해</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginBottom: 4 }}>
          {['가로', '세로', '높이'].map((l) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '9px 4px', borderRadius: 8, border: stroke }}>
              <span style={{ fontSize: 12, color: COLOR.sub }}>{l}</span>
              {bar(48)}
            </div>
          ))}
        </div>
        {skRow('분해', 140)}
      </div>
      <div style={card}>
        <span style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>가져가는 조건</span>
        {skRow('층수', 40)}
        {skRow('엘리베이터', 56)}
        {skRow('운반 도움', 160)}
      </div>
    </>
  );
}

export function DetailScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const l = s.listing;
  const isSeller = s.role === 'seller';
  const visibleChanges = isSeller ? [] : s.changes;
  const info = listingInfo(l, visibleChanges);
  const missing = [...info.empties, ...info.unknowns];
  const priceChange = visibleChanges.find((c) => c.key === 'price');

  const cta = s.sold
    ? { label: '거래완료', variant: 'neutralSolid' as const, disabled: true, onClick: undefined }
    : isSeller
      ? { label: '게시글 수정', variant: 'neutralSolid' as const, disabled: false, onClick: a.openEdit }
      : { label: '채팅하기', variant: 'brandSolid' as const, disabled: false, onClick: a.openChat };

  return (
    <div data-screen-label="상품 상세" className="screen">
      <AppBar
        back
        onBack={a.back}
        right={
          isSeller
            ? [{ icon: 'more', label: '더보기', onClick: a.openEdit }]
            : [{ icon: 'share', label: '공유' }, { icon: 'more', label: '더보기' }]
        }
      />
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, bottom: 77, overflowY: 'auto' }}>
        {!isSeller && s.changes.length > 0 && !s.changesSeen && (
          <PageBanner
            tone="informative"
            title="판매자가 상품 정보를 수정했어요"
            description={`변경된 항목 · ${s.changes.map((c) => c.label).join(', ')}`}
            buttonLabel="변경 내용 보기"
            onButtonClick={a.openChanges}
          />
        )}
        {s.sold && <PageBanner tone="neutral" description="거래가 완료된 상품이에요" />}
        <div style={{ height: 340, background: 'var(--seed-color-bg-neutral-weak)', position: 'relative' }}>
          <img src="/images/table.png" alt="원목 4인용 식탁 사진" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <span
            style={{
              position: 'absolute', right: 12, bottom: 12, padding: '2px 8px', borderRadius: 999,
              background: 'var(--seed-color-palette-static-black-alpha-500)', color: '#fff', fontSize: 12,
            }}
          >
            1/3
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderBottom: stroke }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 999, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'flex-end',
              justifyContent: 'center', background: 'var(--seed-color-palette-gray-200)', color: 'var(--seed-color-palette-gray-500)',
              boxShadow: 'inset 0 0 0 1px var(--seed-color-stroke-neutral-muted)',
            }}
          >
            <Icon name="profile_fill" size={34} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>{isSeller ? '나 (보리네)' : '보리네'}</span>
            <span style={{ fontSize: 13, color: COLOR.sub }}>역삼동</span>
          </div>
          <MannerTempBadge temperature={41.2} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {s.sold && <Badge tone="neutral" variant="solid">거래완료</Badge>}
            <span style={{ fontSize: 20, lineHeight: '27px', fontWeight: 700 }}>{l.title}</span>
          </div>
          <span style={{ fontSize: 13, color: COLOR.sub }}>가구/인테리어 · 10분 전</span>
          <p className="pretty" style={{ margin: '8px 0 0', fontSize: 16, lineHeight: '24px' }}>{l.desc}</p>
        </div>

        <div style={{ height: 8, background: 'var(--seed-color-bg-layer-basement)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 16px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}>거래 정보</span>
            <span style={{ fontSize: 13, color: COLOR.sub }}>판매자가 직접 입력한 정보예요</span>
          </div>

          {s.loadState === 'error' && <ErrorCard onRetry={a.retry} />}
          {s.loadState === 'loading' && <LoadingCards />}
          {s.loadState === 'ok' && (
            <>
              {info.groups.map((g) => (
                <InfoGroupCard key={g.title} group={g} variant="detail" />
              ))}
              {missing.length > 0 && !s.sold && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 12, background: 'var(--seed-color-bg-neutral-weak)' }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>
                    {isSeller ? `구매자가 궁금해할 수 있는 정보 ${missing.length}개` : `확인되지 않은 정보 ${missing.length}개`}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {info.empties.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 14, lineHeight: '20px' }}>
                        <span style={{ color: COLOR.sub, flexShrink: 0, width: 92 }}>아직 미입력</span>
                        <span>{labels(info.empties)}</span>
                      </div>
                    )}
                    {info.unknowns.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, fontSize: 14, lineHeight: '20px' }}>
                        <span style={{ color: COLOR.sub, flexShrink: 0, width: 92 }}>판매자도 모름</span>
                        <span>{labels(info.unknowns)}</span>
                      </div>
                    )}
                  </div>
                  <ActionButton variant="neutralSolid" size="medium" onClick={isSeller ? a.openEdit : () => a.openAsk(missing)}>
                    {isSeller ? '정보 추가하기' : '판매자에게 물어보기'}
                  </ActionButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="bottom-bar" style={{ alignItems: 'center', gap: 16 }}>
        <div onClick={a.toggleLike} style={{ display: 'flex', color: s.liked ? COLOR.brand : COLOR.sub, cursor: 'pointer' }}>
          <Icon name="heart" size={26} />
        </div>
        <div style={{ width: 1, height: 36, background: 'var(--seed-color-stroke-neutral-muted)' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{won(l.price)}</span>
            {priceChange && <Badge tone="informative" variant="weak">변경</Badge>}
          </div>
          <span style={{ fontSize: 13, color: COLOR.sub, textDecoration: priceChange ? 'line-through' : 'none' }}>
            {priceChange ? priceChange.prev : '가격 제안 불가'}
          </span>
        </div>
        <ActionButton variant={cta.variant} size="large" disabled={cta.disabled} onClick={cta.onClick}>
          {cta.label}
        </ActionButton>
      </div>
    </div>
  );
}
