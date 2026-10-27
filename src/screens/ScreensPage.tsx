import { KarrotApp } from '../karrot/KarrotApp';
import { FLOWS } from './flows';
import './screens.css';

const total = FLOWS.reduce((n, f) => n + f.frames.length, 0);

/** Canvas of every screen, grouped by flow. Each phone is live and resets on reload. */
export function ScreensPage() {
  return (
    <div className="screens-page">
      <header className="screens-header">
        <span className="screens-eyebrow">PRD v2.1 · 당근 대형 가구 거래 정보 UX 개선</span>
        <h1>질문하기 전에 알 수 있는 상품 정보 · 전체 화면</h1>
        <p>판매자 입력 → 구매자 확인 → 정보 변경, 그리고 예외 상태까지 {total}개 화면이에요. 모든 화면은 실제로 눌러볼 수 있어요.</p>
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
                <div className="screens-phone">
                  <KarrotApp scenario={fr.sc} />
                </div>
                <span className="screens-frame-note">{fr.note}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
