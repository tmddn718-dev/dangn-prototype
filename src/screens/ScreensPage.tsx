import { useEffect, useState } from 'react';
import { KarrotApp } from '../karrot/KarrotApp';
import { Chip } from '../seed';
import { FLOWS } from './flows';
import { PhoneFrame } from './PhoneFrame';
import './screens.css';

/** `?view=full` opens the page with every phone at its full scroll length. */
function useFullScroll() {
  const [full, setFull] = useState(() => new URLSearchParams(location.search).get('view') === 'full');
  useEffect(() => {
    const url = new URL(location.href);
    if (full) url.searchParams.set('view', 'full');
    else url.searchParams.delete('view');
    history.replaceState(null, '', url);
  }, [full]);
  return [full, setFull] as const;
}

const total = FLOWS.reduce((n, f) => n + f.frames.length, 0);

/** Canvas of every screen, grouped by flow. Each phone is live and resets on reload. */
export function ScreensPage() {
  const [fullScroll, setFullScroll] = useFullScroll();
  return (
    <div className="screens-page">
      <header className="screens-header">
        <span className="screens-eyebrow">PRD v2.1</span>
        <h1>질문하기 전에 알 수 있는 상품 정보 · 전체 화면</h1>
        <p>판매자 입력 → 구매자 확인 → 정보 변경, 그리고 예외 상태까지 {total}개 화면이에요. 모든 화면은 실제로 눌러볼 수 있어요.</p>
        <div className="screens-view" role="group" aria-label="화면 보기 방식">
          <Chip variant="outlineStrong" size="small" checked={!fullScroll} onCheckedChange={() => setFullScroll(false)}>
            기기 화면 · 390×844
          </Chip>
          <Chip variant="outlineStrong" size="small" checked={fullScroll} onCheckedChange={() => setFullScroll(true)}>
            전체 스크롤
          </Chip>
        </div>
      </header>
      {FLOWS.map((fl) => (
        <section key={fl.title} className="screens-flow">
          <div className="screens-flow-head">
            <h2>{fl.title}</h2>
            <span>{fl.sub}</span>
          </div>
          <div className="screens-frames">
            {fl.frames.map((fr) => (
              <div key={fr.id} id={fr.id} className="screens-frame">
                <div className="screens-frame-head">
                  <span className="screens-frame-id">{fr.id}</span>
                  <span className="screens-frame-title">{fr.title}</span>
                  <span className="screens-frame-fr">{fr.fr}</span>
                </div>
                <PhoneFrame fullScroll={fullScroll}>
                  <KarrotApp scenario={fr.sc} />
                </PhoneFrame>
                <span className="screens-frame-note">{fr.note}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
