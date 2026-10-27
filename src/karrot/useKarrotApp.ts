import { useEffect, useRef, useState } from 'react';
import {
  BASE, CHANGED, DIMS, FULL, LABELS, PARTIAL, QUESTIONS, diff, dimIssue,
  type Change, type ChoiceKey, type InfoKey, type Listing,
} from './model';

export const SCENARIOS = [
  'home', 'write-empty', 'write-filled', 'write-error', 'write-warn', 'write-dialog', 'review', 'review-empty',
  'seller-detail', 'detail-full', 'detail-partial', 'ask-sheet', 'chat-draft', 'detail-error', 'detail-loading',
  'edit', 'detail-changed', 'changes-sheet', 'chat-changed', 'detail-sold',
] as const;
export type Scenario = (typeof SCENARIOS)[number];

export type Screen = 'home' | 'write' | 'edit' | 'review' | 'detail' | 'chat';
export type FormField = 'title' | 'price' | 'desc' | 'w' | 'd' | 'h' | 'floor';
export type AppEvent = (name: string, detail: Record<string, unknown>) => void;

export interface Message {
  from: 'me' | 'them';
  text: string;
}

export interface Snack {
  msg: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface AppState {
  screen: Screen;
  stack: Screen[];
  role: 'buyer' | 'seller';
  listing: Listing;
  form: Listing;
  mode: 'write' | 'edit';
  open: { p: boolean; t: boolean };
  sizeOk: boolean;
  sheet: 'ask' | 'changes' | null;
  dialog: 'size' | null;
  askSel: InfoKey[];
  draft: string;
  msgs: Message[];
  changes: Change[];
  /** Index in `msgs` where the "seller edited the listing" notice is inserted. */
  changesAt: number;
  changesSeen: boolean;
  loadState: 'ok' | 'error' | 'loading';
  sold: boolean;
  snack: Snack | null;
  liked: boolean;
}

function initialState(sc: Scenario): AppState {
  const s: AppState = {
    screen: 'home', stack: [], role: 'buyer', listing: { ...PARTIAL }, form: { ...BASE }, mode: 'write',
    open: { p: false, t: false }, sizeOk: false, sheet: null, dialog: null, askSel: [], draft: '', msgs: [],
    changes: [], changesAt: 0, changesSeen: false, loadState: 'ok', sold: false, snack: null, liked: false,
  };
  const seller = { role: 'seller' as const, stack: ['home' as const] };
  const changes = diff(FULL, CHANGED);
  const baseChat: Message[] = [
    { from: 'me', text: '안녕하세요! 식탁 아직 판매 중인가요?' },
    { from: 'them', text: '네 아직 있어요. 주말에 거래 가능해요.' },
  ];
  const presets: Record<Scenario, Partial<AppState>> = {
    'home': {},
    'write-empty': { ...seller, screen: 'write' },
    'write-filled': { ...seller, screen: 'write', form: { ...FULL }, open: { p: true, t: true } },
    'write-error': { ...seller, screen: 'write', form: { ...FULL, h: '0' }, open: { p: true, t: false } },
    'write-warn': { ...seller, screen: 'write', form: { ...FULL, w: '1400' }, open: { p: true, t: false } },
    'write-dialog': { ...seller, screen: 'write', form: { ...FULL, w: '1400' }, open: { p: true, t: false }, dialog: 'size' },
    'review': { ...seller, screen: 'review', form: { ...FULL }, stack: ['home', 'write'] },
    'review-empty': { ...seller, screen: 'review', form: { ...BASE }, stack: ['home', 'write'] },
    'seller-detail': { ...seller, screen: 'detail', listing: { ...PARTIAL }, snack: { msg: '판매글을 올렸어요' } },
    'detail-full': { screen: 'detail', stack: ['home'], listing: { ...FULL } },
    'detail-partial': { screen: 'detail', stack: ['home'], listing: { ...PARTIAL } },
    'ask-sheet': { screen: 'detail', stack: ['home'], listing: { ...PARTIAL }, sheet: 'ask', askSel: ['h', 'help'] },
    'chat-draft': {
      screen: 'chat', stack: ['home', 'detail'], listing: { ...PARTIAL },
      draft: `안녕하세요! 주말에 가지러 가도 될까요?\n${QUESTIONS.h}\n${QUESTIONS.help}`,
      snack: { msg: '질문을 입력창에 추가했어요. 확인한 뒤 보내주세요' },
    },
    'detail-error': { screen: 'detail', stack: ['home'], listing: { ...PARTIAL }, loadState: 'error' },
    'detail-loading': { screen: 'detail', stack: ['home'], listing: { ...PARTIAL }, loadState: 'loading' },
    'edit': { ...seller, screen: 'edit', mode: 'edit', listing: { ...FULL }, form: { ...CHANGED }, open: { p: true, t: true }, stack: ['home', 'detail'] },
    'detail-changed': { screen: 'detail', stack: ['home'], listing: { ...CHANGED }, changes },
    'changes-sheet': { screen: 'detail', stack: ['home'], listing: { ...CHANGED }, changes, sheet: 'changes' },
    'chat-changed': { screen: 'chat', stack: ['home'], listing: { ...CHANGED }, changes, msgs: baseChat, changesAt: 2 },
    'detail-sold': { screen: 'detail', stack: ['home'], listing: { ...FULL }, sold: true },
  };
  return { ...s, ...presets[sc] };
}

/** State and actions for one phone instance. Remount (change `key`) to reset to a scenario. */
export function useKarrotApp(scenario: Scenario, onEvent?: AppEvent) {
  const [state, setState] = useState(() => initialState(scenario));
  const ref = useRef(state);
  ref.current = state;
  const timers = useRef<{ snack?: number; load?: number; reply?: number }>({});
  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  const set = (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) =>
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  const emit = (name: string, detail: Record<string, unknown> = {}) => onEvent?.(name, detail);

  const go = (screen: Screen, extra?: Partial<AppState>) => {
    set((s) => ({ screen, stack: [...s.stack, s.screen], sheet: null, ...extra }));
    emit('screen', { screen });
  };

  const toast = (msg: string, actionLabel?: string, onAction?: () => void) => {
    clearTimeout(timers.current.snack);
    set({ snack: { msg, actionLabel, onAction } });
    timers.current.snack = window.setTimeout(() => set({ snack: null }), 3600);
  };

  const proceed = () => {
    const s = ref.current;
    if (s.mode === 'edit') {
      const changes = diff(s.listing, s.form);
      set((st) => ({
        listing: { ...st.form }, changes: changes.length ? changes : st.changes, changesSeen: false,
        changesAt: st.msgs.length, screen: 'detail', stack: ['home'], dialog: null,
      }));
      emit('edit_saved', { changes: changes.map((c) => c.label) });
      toast(
        changes.length ? '게시글을 수정했어요. 채팅 중인 이웃에게 알려드릴게요' : '게시글을 수정했어요',
        changes.length ? '구매자 화면 보기' : undefined,
        () => {
          set({ role: 'buyer', snack: null });
          emit('switch_buyer');
        },
      );
    } else {
      set({ dialog: null });
      go('review');
    }
  };

  const openEdit = () => go('edit', { mode: 'edit', form: { ...ref.current.listing }, open: { p: true, t: true }, sizeOk: false });

  const actions = {
    back: () =>
      set((s) => {
        const stack = [...s.stack];
        return { screen: stack.pop() || 'home', stack, sheet: null, dialog: null };
      }),
    startWrite: () => {
      go('write', { role: 'seller', mode: 'write', form: { ...BASE }, open: { p: false, t: false }, sizeOk: false });
      emit('write_start');
    },
    openDetail: () => {
      go('detail');
      emit('detail_open');
    },
    setForm: (k: FormField, v: string) => {
      if (k === 'w' || k === 'd' || k === 'h' || k === 'floor') v = v.replace(/[^0-9.\-]/g, '');
      if (k === 'price') v = v.replace(/[^0-9]/g, '');
      set((s) => ({ form: { ...s.form, [k]: v }, sizeOk: (DIMS as string[]).includes(k) ? false : s.sizeOk }));
    },
    /** Choice chips toggle: picking the selected option again clears it. */
    pick: (k: ChoiceKey, val: string) =>
      set((s) => {
        const form = { ...s.form, [k]: s.form[k] === val ? null : val } as Listing;
        if (k === 'disas' && form.disas !== 'yes') form.deliver = null;
        return { form };
      }),
    toggleGroup: (g: 'p' | 't') => set((s) => ({ open: { ...s.open, [g]: !s.open[g] } })),
    submitForm: () => {
      const s = ref.current;
      const errs = DIMS.filter((k) => dimIssue(s.form[k]) === 'error');
      const warns = DIMS.filter((k) => dimIssue(s.form[k]) === 'warn');
      if (errs.length) {
        set({ open: { ...s.open, p: true } });
        toast('크기를 다시 확인해 주세요');
        emit('size_error_blocked', { fields: errs });
        return;
      }
      if (warns.length && !s.sizeOk) {
        set({ dialog: 'size', open: { ...s.open, p: true } });
        emit('size_warn_dialog', { fields: warns });
        return;
      }
      proceed();
    },
    confirmSize: () => {
      set({ sizeOk: true });
      emit('size_confirmed');
    },
    sizeEdit: () => {
      set({ dialog: null });
      emit('size_edit');
    },
    sizeOkProceed: () => {
      set({ sizeOk: true, dialog: null });
      emit('size_confirmed');
      proceed();
    },
    register: () => {
      const f = ref.current.form;
      const filled = (['w', 'd', 'h', 'disas', 'deliver', 'floor', 'elevator', 'help'] as const).filter((k) => f[k]).length;
      set({ listing: { ...f }, role: 'seller', screen: 'detail', stack: ['home'], changes: [], loadState: 'ok', sold: false });
      emit('register', { filled });
      toast('판매글을 올렸어요');
    },
    openEdit,
    openAsk: (missing: InfoKey[]) => {
      set({ sheet: 'ask', askSel: [] });
      emit('ask_open', { items: missing.map((k) => LABELS[k]) });
    },
    toggleAsk: (k: InfoKey) => set((s) => ({ askSel: s.askSel.includes(k) ? s.askSel.filter((x) => x !== k) : [...s.askSel, k] })),
    addQuestions: () => {
      const s = ref.current;
      const qs = s.askSel.map((k) => QUESTIONS[k]).join('\n');
      const draft = s.draft.trim() ? `${s.draft.replace(/\s+$/, '')}\n${qs}` : qs;
      emit('draft_added', { items: s.askSel.map((k) => LABELS[k]), preserved: !!s.draft.trim() });
      go('chat', { draft, sheet: null, askSel: [] });
      toast('질문을 입력창에 추가했어요. 확인한 뒤 보내주세요');
    },
    closeSheet: () => set({ sheet: null }),
    openChanges: () => {
      set({ sheet: 'changes' });
      emit('changes_open');
    },
    confirmChanges: () => {
      set({ sheet: null, changesSeen: true });
      emit('changes_confirmed');
    },
    retry: () => {
      set({ loadState: 'loading' });
      emit('retry');
      clearTimeout(timers.current.load);
      timers.current.load = window.setTimeout(() => set({ loadState: 'ok' }), 900);
    },
    toggleLike: () => set((s) => ({ liked: !s.liked })),
    openChat: () => {
      go('chat');
      emit('chat_open');
    },
    chatToDetail: () => {
      go('detail');
      emit('detail_from_chat');
    },
    chatToChanges: () => {
      go('detail', { sheet: 'changes' });
      emit('changes_open', { from: 'chat' });
    },
    setDraft: (draft: string) => set({ draft }),
    send: () => {
      const text = ref.current.draft.trim();
      if (!text) return;
      set((s) => ({ msgs: [...s.msgs, { from: 'me', text }], draft: '' }));
      emit('message_sent', { text });
      clearTimeout(timers.current.reply);
      timers.current.reply = window.setTimeout(
        () => set((s) => ({ msgs: [...s.msgs, { from: 'them', text: '확인해보고 바로 알려드릴게요.' }] })),
        1400,
      );
    },
  };

  return { state, actions };
}

export type KarrotAppModel = ReturnType<typeof useKarrotApp>;
