import { useState } from 'react';
import { KarrotApp } from '../karrot/KarrotApp';
import type { Scenario } from '../karrot/useKarrotApp';
import { ActionButton } from '../seed';
import './prototype.css';

interface Start {
  sc: Scenario;
  who: string;
  title: string;
  steps: string[];
}

const STARTS: Start[] = [
  {
    sc: 'home',
    who: '구매자',
    title: '검색부터 거래완료까지',
    steps: ['홈 오른쪽 위 검색 → 대형가구', '크기 정보 있는 글만 켜고 원목 4인용 식탁', '판매자에게 물어보기 → 질문 고르기 → 보내기', '약속 잡기 → 후기 보내기'],
  },
  {
    sc: 'write-empty',
    who: '판매자',
    title: '판매글 올리기',
    steps: ['가구 정보의 상품 정보·가져가는 조건 펼치기', '크기에 0이나 1400을 넣어 보기', '작성 완료 → 입력 정보 확인 → 등록'],
  },
  {
    sc: 'detail-changed',
    who: '구매자',
    title: '판매자가 정보를 바꿨을 때',
    steps: ['상단 안내의 변경 내용 보기', '이전 값과 현재 값 비교 → 최신 정보 확인하기'],
  },
  {
    sc: 'detail-error',
    who: '구매자',
    title: '정보를 불러오지 못했을 때',
    steps: ['거래 정보 카드의 다시 시도', '불러오는 동안 스켈레톤 확인'],
  },
];

/** One live phone with guided starting points, for trying the whole flow end to end. */
export function PrototypePage() {
  const [start, setStart] = useState<Scenario>('home');
  const [key, setKey] = useState(0);
  const go = (sc: Scenario) => {
    setStart(sc);
    setKey((k) => k + 1);
  };

  return (
    <div className="proto-page">
      <header className="proto-head">
        <span className="proto-eyebrow">당근 · 대형 가구 거래 정보</span>
        <h1>질문하기 전에 알 수 있는 상품 정보</h1>
        <p>실제로 눌러볼 수 있는 프로토타입이에요. 왼쪽 휴대폰을 직접 조작하고, 오른쪽에서 원하는 흐름의 시작 화면으로 바로 갈 수 있어요.</p>
      </header>
      <div className="proto-body">
        <div className="proto-phone-col">
          <div className="screens-phone proto-phone">
            <KarrotApp scenario={start} resetKey={key} />
          </div>
          <ActionButton variant="neutralWeak" size="medium" onClick={() => go(start)}>
            이 흐름 처음부터
          </ActionButton>
        </div>
        <ol className="proto-starts">
          {STARTS.map((s) => (
            <li key={s.sc} className={s.sc === start ? 'proto-start is-on' : 'proto-start'}>
              <div className="proto-start-head">
                <span className="proto-who">{s.who}</span>
                <h2>{s.title}</h2>
              </div>
              <ol className="proto-steps">
                {s.steps.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
              <ActionButton variant={s.sc === start ? 'neutralSolid' : 'neutralWeak'} size="small" onClick={() => go(s.sc)}>
                {s.sc === start ? '이 흐름 진행 중 · 다시 시작' : '여기서 시작'}
              </ActionButton>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
