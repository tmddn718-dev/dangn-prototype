# dangn-prototype
당근의 디자인 시안 프로토타입을 확인하기 위한 저장소 입니다.

## 당근 대형 가구 거래 정보 UX 개선 · 전체 화면

PRD v2.1 「질문하기 전에 알 수 있는 상품 정보」를 Claude Design에서 설계한 시안(`Screens.dc.html`)을
React + Vite + TypeScript로 구현한 프로젝트예요.

- 판매자 입력 → 구매자 확인 → 정보 변경 → 예외 상태까지 **20개 화면(S1–E3)** 을 흐름별로 한 페이지에 보여줘요.
- 각 휴대폰 화면(390×844)은 실제로 눌러볼 수 있는 독립된 앱이에요. 칩 선택, 크기 검증, 재확인 다이얼로그,
  질문 고르기 바텀시트, 채팅 초안, 변경 내용 비교, 조회 실패 후 다시 시도까지 동작해요.
- UI는 당근 SEED Design의 공식 토큰·레시피 CSS를 그대로 사용하고, 컴포넌트를 TypeScript로 옮겼어요.

| 흐름 | 화면 |
| --- | --- |
| 판매자 · 판매글 작성 | S1 홈 · S2 판매글 작성 · S3 가구 정보 입력 · S4 크기 입력 오류 · S5 큰 값 재확인 · S6 등록 전 재확인 · S7 입력 정보 확인 · S8 가구 정보 없이 등록 · S9 등록 완료 |
| 구매자 · 거래 조건 확인 | B1 상세(모두 입력) · B2 상세(일부 입력) · B3 질문 고르기 · B4 채팅 질문 초안 |
| 정보 변경 | C1 게시글 수정 · C2 채팅 변경 알림 · C3 상세 변경 안내 · C4 변경 내용 비교 |
| 예외 상태 | E1 정보 조회 실패 · E2 다시 불러오는 중 · E3 거래완료 |

## 실행 방법

Node.js 18 이상이 필요해요.

```sh
npm install        # 의존성 설치
npm run dev        # 개발 서버 실행 → http://localhost:5173
npm run build      # 타입 검사 + 프로덕션 빌드 (dist/)
npm run preview    # 빌드 결과 미리보기 → http://localhost:4173
```

특정 화면으로 바로 이동하려면 주소 뒤에 화면 ID를 붙이세요. 예: `http://localhost:5173/#B2`

## 폴더 구조

```
.
├── index.html                  # 진입 HTML
├── public/images/              # 상품 사진 (식탁 · 소파 · 책장 · 침대)
├── src/
│   ├── main.tsx                # 앱 시작점
│   ├── screens/                # 전체 화면 갤러리 페이지
│   │   ├── ScreensPage.tsx     #   흐름별 화면 배치
│   │   ├── flows.ts            #   S1–E3 화면 목록 · 요구사항(FR) · 설명
│   │   └── screens.css
│   ├── karrot/                 # 당근 앱 (휴대폰 한 대)
│   │   ├── KarrotApp.tsx       #   scenario로 시작 화면 지정, resetKey로 초기화
│   │   ├── useKarrotApp.ts     #   화면 전환 · 상태 · 사용자 동작, 시나리오 프리셋
│   │   ├── model.ts            #   상품 데이터 · 문구 · 크기 검증(300cm 기준) · 거래 정보 가공
│   │   ├── InfoGroupCard.tsx   #   거래 정보 카드 (크기 및 분해 / 가져가는 조건)
│   │   ├── Overlays.tsx        #   질문 고르기 · 변경 내용 바텀시트, 크기 재확인 다이얼로그, 스낵바
│   │   ├── screens/            #   홈 · 작성/수정 · 입력 정보 확인 · 상품 상세 · 채팅
│   │   └── karrot.css
│   ├── seed/                   # SEED Design 컴포넌트 (TypeScript 포팅)
│   │   ├── actions.tsx         #   ActionButton, FloatingActionButton
│   │   ├── display.tsx         #   Badge, MannerTempBadge, ProgressCircle, Skeleton
│   │   ├── feedback.tsx        #   Callout, PageBanner, Snackbar
│   │   ├── forms.tsx           #   Chip, Checkbox, TextField
│   │   ├── navigation.tsx      #   AppBar, BottomSheet
│   │   ├── Icon.tsx            #   아이콘 · 글리프
│   │   └── styles/             #   SEED 공식 토큰 · 레시피 CSS (수정 없이 복사)
│   └── assets/icons/           # SVG 아이콘 (currentColor로 색 상속)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 참고

- 크기 재확인 기준(300cm)은 PRD에 정해진 값이 없어 임시로 정했어요. `src/karrot/model.ts`의 `SIZE_WARN_CM`에서 바꿀 수 있어요.
- 폰트는 기기 시스템 폰트를 먼저 쓰고, 없으면 Pretendard를 CDN에서 불러와요.
