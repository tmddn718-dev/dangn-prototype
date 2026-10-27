import type { Scenario } from '../karrot/useKarrotApp';

export interface Frame {
  id: string;
  sc: Scenario;
  title: string;
  /** Functional requirement(s) from PRD v2.1 the screen covers. */
  fr: string;
  note: string;
}

export interface Flow {
  title: string;
  sub: string;
  frames: Frame[];
}

export const FLOWS: Flow[] = [
  {
    title: '판매자 · 판매글 작성',
    sub: '판매글 작성 → 가구 정보 선택 입력 → 입력 정보 확인 → 등록',
    frames: [
      { id: 'S1', sc: 'home', title: '홈', fr: '진입', note: '기존 홈 그대로. 글쓰기로 판매를 시작해요.' },
      { id: 'S2', sc: 'write-empty', title: '판매글 작성', fr: 'FR-01', note: '기존 입력 아래에 선택형 "가구 정보"를 2개 그룹으로 접어서 추가해요. 입력하지 않아도 등록할 수 있어요.' },
      { id: 'S3', sc: 'write-filled', title: '가구 정보 입력', fr: 'FR-01 · 03', note: '"분해 가능"을 골랐을 때만 전달 상태를 물어요. 같은 칩을 다시 누르면 선택이 풀려 빈 상태로 돌아가요.' },
      { id: 'S4', sc: 'write-error', title: '크기 입력 오류', fr: 'FR-02', note: '0 이하는 유효한 크기로 받지 않아요. 등록을 막고 해당 칸을 표시해요.' },
      { id: 'S5', sc: 'write-warn', title: '큰 값 재확인', fr: 'FR-02', note: '300cm를 넘으면 막지 않고 다시 확인해 달라고 해요. "이 크기가 맞아요"로 넘어갈 수 있어요.' },
      { id: 'S6', sc: 'write-dialog', title: '등록 전 재확인', fr: 'FR-02', note: '확인하지 않고 작성을 마치면 한 번 더 물어요.' },
      { id: 'S7', sc: 'review', title: '입력 정보 확인', fr: 'FR-01 · 04', note: '구매자 화면과 같은 형태로 미리 보여줘서 입력한 내용이 그대로 반영되는지 확인해요.' },
      { id: 'S8', sc: 'review-empty', title: '가구 정보 없이 등록', fr: 'FR-01', note: '아무것도 입력하지 않아도 등록할 수 있다고 알려줘요.' },
      { id: 'S9', sc: 'seller-detail', title: '등록 완료 · 내 판매글', fr: 'FR-05', note: '판매자에게는 구매자가 궁금해할 수 있는 빈 항목을 보여주고, 바로 추가할 수 있게 해요.' },
    ],
  },
  {
    title: '구매자 · 거래 조건 확인',
    sub: '상품 상세 → 거래 조건 확인 → 미확인 정보 파악 → 필요할 때 채팅 질문',
    frames: [
      { id: 'B1', sc: 'detail-full', title: '상세 · 모두 입력', fr: 'FR-04', note: '기본 정보 → 크기 및 분해 → 가져가는 조건 순서. 엘리베이터가 있어도 운반 가능하다고 단정하지 않아요.' },
      { id: 'B2', sc: 'detail-partial', title: '상세 · 일부 입력', fr: 'FR-04 · 05', note: '입력된 값만 확정적으로 보여주고, 미입력과 판매자도 모르는 정보를 구분해 한곳에 묶어요.' },
      { id: 'B3', sc: 'ask-sheet', title: '질문 고르기', fr: 'FR-06', note: '확인되지 않은 항목 중 궁금한 것만 골라요.' },
      { id: 'B4', sc: 'chat-draft', title: '채팅 질문 초안', fr: 'FR-06', note: '기존에 쓰던 내용 뒤에 질문을 붙여요. 자동으로 보내지 않고, 직접 고친 뒤 보내요.' },
    ],
  },
  {
    title: '정보 변경',
    sub: '판매자 수정 → 구매자에게 변경 안내 → 최신 정보 확인',
    frames: [
      { id: 'C1', sc: 'edit', title: '판매자 · 게시글 수정', fr: 'FR-07', note: '등록 후에도 같은 화면에서 가구 정보를 고칠 수 있어요. 예시: 가격 120,000→100,000원, 전달 상태 변경.' },
      { id: 'C2', sc: 'chat-changed', title: '채팅 · 변경 알림', fr: 'FR-07', note: '채팅 중이던 구매자에게 무엇이 바뀌었는지 알려요.' },
      { id: 'C3', sc: 'detail-changed', title: '상세 · 변경 안내', fr: 'FR-07', note: '상단 배너와 "변경" 표시. 실제 변경 이력이 있을 때만 이전 값을 함께 보여줘요.' },
      { id: 'C4', sc: 'changes-sheet', title: '변경 내용 비교', fr: 'FR-07', note: '이전 값과 현재 값을 나란히 보여주고 최신 정보 확인으로 마무리해요.' },
    ],
  },
  {
    title: '예외 상태',
    sub: '필수 Edge Case',
    frames: [
      { id: 'E1', sc: 'detail-error', title: '정보 조회 실패', fr: 'FR-05', note: '조회 실패를 미입력처럼 보이지 않게 따로 안내하고 다시 시도할 수 있어요.' },
      { id: 'E2', sc: 'detail-loading', title: '다시 불러오는 중', fr: 'FR-05', note: '다시 시도하는 동안 스켈레톤을 보여줘요.' },
      { id: 'E3', sc: 'detail-sold', title: '거래완료', fr: '기존 유지', note: '완료 상태를 상단과 제목에서 분명히 보여주고 채팅 버튼을 비활성화해요.' },
    ],
  },
];
