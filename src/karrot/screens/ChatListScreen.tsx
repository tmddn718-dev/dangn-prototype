import { AppBar, Badge } from '../../seed';
import { BottomNav } from '../BottomNav';
import { COLOR } from '../model';
import type { KarrotAppModel } from '../useKarrotApp';

const OTHERS = [
  { name: '소파좋아', place: '논현동', last: '네 그럼 내일 저녁에 뵐게요!', time: '어제', img: 'sofa' },
  { name: '책읽는곰', place: '도곡동', last: '책장 아직 있나요?', time: '3일 전', img: 'bookshelf' },
];

/** 채팅 tab (T6): the buyer's conversations, with the 식탁 chat's trade status. */
export function ChatListScreen({ app: { state: s, actions: a } }: { app: KarrotAppModel }) {
  const lastMsg = [...s.msgs].reverse().find((m) => m.from !== 'system' || m.kind);
  const preview = !lastMsg ? '' : lastMsg.kind === 'appoint' ? '약속을 만들었어요' : lastMsg.kind === 'review' ? '거래 후기를 보냈어요' : lastMsg.text.split('\n')[0];
  const row = (key: string, name: string, place: string, last: string, time: string, img: string, onClick: () => void, badge?: 'reserved' | 'sold') => (
    <div key={key} onClick={onClick} className="pressable" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
      <div style={{ width: 48, height: 48, borderRadius: 999, flexShrink: 0, background: 'var(--seed-color-palette-gray-200)' }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COLOR.sub }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: COLOR.fg }}>{name}</span>
          <span>{place} · {time}</span>
          {badge === 'reserved' && <Badge tone="positive" variant="weak">예약중</Badge>}
          {badge === 'sold' && <Badge tone="neutral" variant="weak">거래완료</Badge>}
        </div>
        <span style={{ fontSize: 14, lineHeight: '20px', color: COLOR.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last}</span>
      </div>
      <img src={`${import.meta.env.BASE_URL}images/${img}.png`} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
    </div>
  );

  return (
    <div data-screen-label="채팅 목록" className="screen">
      <AppBar title="채팅" titleAlign="left" />
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, bottom: 64, overflowY: 'auto' }}>
        {s.msgs.length > 0 &&
          row('table', '보리네', '역삼동', preview, '방금 전', 'table', a.openChat, s.sold ? 'sold' : s.reserved ? 'reserved' : undefined)}
        {OTHERS.map((o) => row(o.name, o.name, o.place, o.last, o.time, o.img, a.otherChat))}
      </div>
      <BottomNav active="chats" onTab={a.tab} />
    </div>
  );
}
