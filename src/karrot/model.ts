// Listing data, copy and derived view-models for the 대형 가구 거래 정보 flows (PRD v2.1).

export type Disassembly = 'yes' | 'no' | 'unknown';
export type Delivery = 'assembled' | 'disassembled' | 'negotiate';
export type Elevator = 'yes' | 'no' | 'unknown';
export type CarryHelp = 'yes' | 'no' | 'negotiate';

export interface Listing {
  title: string;
  price: string;
  desc: string;
  w: string;
  d: string;
  h: string;
  disas: Disassembly | null;
  deliver: Delivery | null;
  floor: string;
  elevator: Elevator | null;
  help: CarryHelp | null;
}

export type DimKey = 'w' | 'd' | 'h';
export type ChoiceKey = 'disas' | 'deliver' | 'elevator' | 'help';
/** Furniture-info items a buyer can see as missing and ask about. */
export type InfoKey = 'size' | DimKey | ChoiceKey | 'floor';
/** Items compared when a seller edits a listing. */
export type ChangeKey = 'price' | 'dims' | 'disas' | 'floor' | 'elevator' | 'help';

export const BASE: Listing = {
  title: '원목 4인용 식탁',
  price: '120000',
  desc: '이사 가게 되어 내놓아요. 2년 정도 사용했고 상판에 작은 생활 기스가 있어요. 의자는 포함되지 않아요.',
  w: '', d: '', h: '', disas: null, deliver: null, floor: '', elevator: null, help: null,
};
export const FULL: Listing = { ...BASE, w: '140', d: '80', h: '75', disas: 'yes', deliver: 'assembled', floor: '4', elevator: 'yes', help: 'no' };
export const PARTIAL: Listing = { ...BASE, w: '140', d: '80', disas: 'yes', deliver: 'assembled', floor: '3', elevator: 'unknown' };
export const CHANGED: Listing = { ...FULL, price: '100000', deliver: 'disassembled' };

export const DISAS_OPTS: Record<Disassembly, string> = { yes: '분해 가능', no: '분해 불가', unknown: '잘 모르겠어요' };
export const DELIVER_OPTS: Record<Delivery, string> = { assembled: '조립된 상태', disassembled: '분해된 상태', negotiate: '구매자와 협의' };
export const ELEVATOR_OPTS: Record<Elevator, string> = { yes: '있어요', no: '없어요', unknown: '잘 모르겠어요' };
export const HELP_OPTS: Record<CarryHelp, string> = { yes: '도와줄 수 있어요', no: '어려워요', negotiate: '협의할게요' };

const DELIVER_TEXT: Record<Delivery, string> = { assembled: '조립된 상태로 전달', disassembled: '분해된 상태로 전달', negotiate: '전달 상태 협의' };
const ELEVATOR_TEXT = { yes: '있음', no: '없음' } as const;
const HELP_TEXT: Record<CarryHelp, string> = { yes: '판매자가 함께 옮겨줄 수 있어요', no: '구매자가 직접 옮겨야 해요', negotiate: '구매자와 협의해요' };

export const QUESTIONS: Record<InfoKey, string> = {
  size: '가구 크기(가로·세로·높이)를 알려주실 수 있나요?',
  w: '가로 길이가 몇 cm인가요?',
  d: '세로(깊이) 길이가 몇 cm인가요?',
  h: '높이가 몇 cm인가요?',
  disas: '분해할 수 있는 가구인가요?',
  deliver: '분해된 상태로 받을 수 있나요, 조립된 상태로 받아야 하나요?',
  floor: '몇 층에서 가져가야 하나요?',
  elevator: '건물에 엘리베이터가 있나요?',
  help: '옮길 때 도와주실 수 있나요?',
};

export const LABELS: Record<InfoKey | ChangeKey, string> = {
  size: '크기', w: '가로', d: '세로', h: '높이', disas: '분해 여부', deliver: '전달 상태',
  floor: '층수', elevator: '엘리베이터', help: '운반 도움', price: '가격', dims: '크기',
};

export const COLOR = {
  fg: 'var(--seed-color-fg-neutral)',
  sub: 'var(--seed-color-fg-neutral-subtle)',
  muted: 'var(--seed-color-fg-neutral-muted)',
  ph: 'var(--seed-color-fg-placeholder)',
  brand: 'var(--seed-color-fg-brand)',
};

export const DIMS: DimKey[] = ['w', 'd', 'h'];

/** Sizes above this many cm get a "please check" prompt; the PRD sets no number. */
export const SIZE_WARN_CM = 300;

export const won = (p: string) => (p ? `${Number(p).toLocaleString('ko-KR')}원` : '가격 미정');

export function dimIssue(v: string): 'error' | 'warn' | null {
  if (v === '') return null;
  const n = Number(v);
  if (Number.isNaN(n) || n <= 0) return 'error';
  return n > SIZE_WARN_CM ? 'warn' : null;
}

const dimsText = (l: Listing) =>
  DIMS.some((k) => l[k]) ? DIMS.map((k) => `${LABELS[k]} ${l[k] ? `${l[k]}cm` : '미입력'}`).join(' · ') : '미입력';

export function disasText(l: Listing) {
  if (!l.disas) return '미입력';
  if (l.disas === 'yes') return l.deliver ? `분해 가능 · ${DELIVER_TEXT[l.deliver]}` : '분해 가능';
  return l.disas === 'no' ? '분해 불가' : '판매자도 확인하지 못했어요';
}

const SUMMARY: Record<ChangeKey, (l: Listing) => string> = {
  price: (l) => won(l.price),
  dims: dimsText,
  disas: disasText,
  floor: (l) => (l.floor ? `${l.floor}층` : '미입력'),
  elevator: (l) => (!l.elevator ? '미입력' : l.elevator === 'unknown' ? '판매자도 확인하지 못했어요' : ELEVATOR_TEXT[l.elevator]),
  help: (l) => (l.help ? HELP_TEXT[l.help] : '미입력'),
};

export interface Change {
  key: ChangeKey;
  label: string;
  prev: string;
  cur: string;
}

export const diff = (a: Listing, b: Listing): Change[] =>
  (Object.keys(SUMMARY) as ChangeKey[])
    .filter((k) => SUMMARY[k](a) !== SUMMARY[k](b))
    .map((k) => ({ key: k, label: LABELS[k], prev: SUMMARY[k](a), cur: SUMMARY[k](b) }));

// ---- 거래 정보 card view-model (shared by buyer detail, seller detail and the review screen)

export interface InfoRow {
  label: string;
  value: string;
  color: string;
  weight: 400 | 700;
  isUnknown: boolean;
  changed: boolean;
  prev?: string;
}

export interface InfoGroup {
  title: string;
  allEmpty: boolean;
  dims: { label: string; value: string; color: string }[] | null;
  rows: InfoRow[];
  hasNote: boolean;
}

export interface ListingInfo {
  groups: InfoGroup[];
  empties: InfoKey[];
  unknowns: InfoKey[];
  furnitureEmpty: boolean;
}

type FieldState = 'filled' | 'empty' | 'unknown';

export function listingInfo(l: Listing, changes: Change[] = []): ListingInfo {
  const ch: Partial<Record<ChangeKey, Change>> = {};
  changes.forEach((c) => (ch[c.key] = c));
  const row = (key: ChangeKey, label: string, state: FieldState, value = ''): InfoRow => ({
    label,
    value: state === 'empty' ? '아직 입력되지 않았어요' : state === 'unknown' ? '판매자도 확인하지 못했어요' : value,
    color: state === 'filled' ? COLOR.fg : state === 'unknown' ? COLOR.muted : COLOR.ph,
    weight: state === 'filled' ? 700 : 400,
    isUnknown: state === 'unknown',
    changed: !!ch[key],
    prev: ch[key]?.prev,
  });
  const anyDim = DIMS.some((k) => l[k]);

  const sizeRows: InfoRow[] = [];
  if (l.disas) sizeRows.push(row('disas', '분해', l.disas === 'unknown' ? 'unknown' : 'filled', disasText(l)));
  else if (anyDim) sizeRows.push(row('disas', '분해', 'empty'));
  if (ch.dims) sizeRows.unshift({ label: '크기', value: '변경됨', color: COLOR.fg, weight: 400, isUnknown: false, changed: true, prev: ch.dims.prev });
  const sizeEmpty = !anyDim && !l.disas;

  const st = (v: string | null): FieldState => (!v ? 'empty' : v === 'unknown' ? 'unknown' : 'filled');
  const pickupEmpty = !l.floor && !l.elevator && !l.help;
  const pickupRows = pickupEmpty
    ? []
    : [
        row('floor', '층수', st(l.floor), `${l.floor}층`),
        row('elevator', '엘리베이터', st(l.elevator), l.elevator && l.elevator !== 'unknown' ? ELEVATOR_TEXT[l.elevator] : ''),
        row('help', '운반 도움', st(l.help), l.help ? HELP_TEXT[l.help] : ''),
      ];

  const groups: InfoGroup[] = [
    {
      title: '크기 및 분해',
      allEmpty: sizeEmpty,
      dims: sizeEmpty ? null : DIMS.map((k) => ({ label: LABELS[k], value: l[k] ? `${l[k]}cm` : '미입력', color: l[k] ? COLOR.fg : COLOR.ph })),
      rows: sizeEmpty ? [] : sizeRows,
      hasNote: false,
    },
    { title: '가져가는 조건', allEmpty: pickupEmpty, dims: null, rows: pickupRows, hasNote: !pickupEmpty },
  ];

  const empties: InfoKey[] = [];
  if (!anyDim) empties.push('size');
  else DIMS.forEach((k) => !l[k] && empties.push(k));
  if (!l.disas) empties.push('disas');
  else if (l.disas === 'yes' && !l.deliver) empties.push('deliver');
  (['floor', 'elevator', 'help'] as const).forEach((k) => !l[k] && empties.push(k));

  const unknowns: InfoKey[] = [];
  if (l.disas === 'unknown') unknowns.push('disas');
  if (l.elevator === 'unknown') unknowns.push('elevator');

  return { groups, empties, unknowns, furnitureEmpty: sizeEmpty && pickupEmpty };
}

// ---- Buyer exploration: listings shown in search results and the home feed

export interface CatalogItem {
  id: 'table' | 'sofa' | 'bookshelf' | 'bed';
  title: string;
  img: string;
  meta: string;
  price: string;
  /** Short furniture-info line for list rows; null when the seller entered none. */
  info: string | null;
  keywords: string[];
}

const img = (n: string) => `${import.meta.env.BASE_URL}images/${n}.png`;

/** One-line size summary for list rows, e.g. "140×80cm · 분해 가능". */
export function listingSummary(l: Listing): string | null {
  const dims = DIMS.filter((k) => l[k]).map((k) => l[k]);
  const parts = [dims.length ? `${dims.join('×')}cm` : '', l.disas === 'yes' ? '분해 가능' : l.disas === 'no' ? '분해 불가' : ''].filter(Boolean);
  return parts.length ? parts.join(' · ') : null;
}

export function catalog(l: Listing): CatalogItem[] {
  return [
    { id: 'table', title: l.title, img: img('table'), meta: '역삼동 · 10분 전', price: won(l.price), info: listingSummary(l), keywords: ['식탁', '테이블', '원목', '대형가구', '가구'] },
    { id: 'sofa', title: '패브릭 3인용 소파', img: img('sofa'), meta: '논현동 · 32분 전', price: '80,000원', info: '210×90×85cm · 분해 불가', keywords: ['소파', '쇼파', '대형가구', '가구'] },
    { id: 'bookshelf', title: '이케아 5단 책장', img: img('bookshelf'), meta: '도곡동 · 1시간 전', price: '25,000원', info: null, keywords: ['책장', '이케아', '수납', '대형가구', '가구'] },
    { id: 'bed', title: '퀸 사이즈 침대 프레임', img: img('bed'), meta: '역삼동 · 어제', price: '나눔', info: '160×210cm · 분해 가능', keywords: ['침대', '프레임', '대형가구', '가구'] },
  ];
}

export const SEARCH_SUGGESTIONS = ['대형가구', '식탁', '소파', '침대'];

export function searchCatalog(items: CatalogItem[], query: string, sizeOnly: boolean) {
  const q = query.trim().replace(/\s+/g, '');
  if (!q) return [];
  return items.filter((it) => (it.title.replace(/\s+/g, '').includes(q) || it.keywords.some((k) => k.includes(q) || q.includes(k))) && (!sizeOnly || it.info));
}

// ---- Trade chat: the seller's scripted answers, appointment and review options

const ANSWERS: Record<InfoKey, string> = {
  size: '가로 140, 세로 80, 높이 75cm예요.',
  w: '가로는 140cm예요.',
  d: '세로는 80cm예요.',
  h: '높이는 75cm예요.',
  disas: '다리를 풀면 분해할 수 있어요.',
  deliver: '조립된 상태로 드릴게요.',
  floor: '3층이에요.',
  elevator: '엘리베이터 있어요.',
  help: '옮길 때 같이 들어드릴 수 있어요.',
};

/** What the seller replies to a buyer's message, answering any furniture questions it contains. */
export function sellerAnswer(text: string): string {
  const answered = (Object.keys(QUESTIONS) as InfoKey[]).filter((k) => text.includes(QUESTIONS[k])).map((k) => ANSWERS[k]);
  return answered.length ? `네 아직 판매 중이에요! ${answered.join(' ')}` : '네 아직 판매 중이에요. 주말 오후에 거래 가능해요.';
}

export const APPOINT_DAYS = ['내일', '토요일', '일요일'];
export const APPOINT_TIMES = ['오전 11시', '오후 2시', '오후 6시'];
export const APPOINT_PLACE = '역삼동 · 판매자 집 앞';

/** What the buyer should check on pickup day, from the listing's furniture info. */
export function pickupChecklist(l: Listing): string {
  return [l.floor ? `${l.floor}층` : '', l.elevator === 'yes' ? '엘리베이터 있음' : l.elevator === 'no' ? '엘리베이터 없음' : '', disasText(l) !== '미입력' ? disasText(l) : '']
    .filter(Boolean)
    .join(' · ');
}

export const REVIEW_RATES = ['별로예요', '좋아요', '최고예요'] as const;
export const REVIEW_TAGS = ['상품 설명과 실제 상품이 같아요', '크기·운반 정보가 정확했어요', '시간 약속을 잘 지켜요', '친절하고 매너가 좋아요'];
