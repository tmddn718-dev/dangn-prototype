import './karrot.css';
import { AppointSheet, AskSheet, ChangesSheet, ReviewSheet, SizeDialog, SnackbarSlot } from './Overlays';
import { ChatListScreen } from './screens/ChatListScreen';
import { ChatScreen } from './screens/ChatScreen';
import { DetailScreen } from './screens/DetailScreen';
import { FormScreen } from './screens/FormScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { SearchScreen } from './screens/SearchScreen';
import { useKarrotApp, type AppEvent, type Scenario } from './useKarrotApp';

export interface KarrotAppProps {
  /** Which screen and data state the phone starts in. */
  scenario?: Scenario;
  /** Bump to reset the phone back to its scenario. */
  resetKey?: number;
  onEvent?: AppEvent;
}

/** One 390×844 phone running the 당근 furniture-listing flows. */
export function KarrotApp({ scenario = 'home', resetKey = 0, onEvent }: KarrotAppProps) {
  return <Phone key={`${scenario}:${resetKey}`} scenario={scenario} onEvent={onEvent} />;
}

function Phone({ scenario, onEvent }: { scenario: Scenario; onEvent?: AppEvent }) {
  const app = useKarrotApp(scenario, onEvent);
  const { screen, sheet, dialog } = app.state;
  return (
    <div className="karrot-app">
      {screen === 'home' && <HomeScreen app={app} />}
      {screen === 'search' && <SearchScreen app={app} />}
      {screen === 'chats' && <ChatListScreen app={app} />}
      {(screen === 'write' || screen === 'edit') && <FormScreen app={app} />}
      {screen === 'review' && <ReviewScreen app={app} />}
      {screen === 'detail' && <DetailScreen app={app} />}
      {screen === 'chat' && <ChatScreen app={app} />}
      {sheet === 'ask' && <AskSheet app={app} />}
      {sheet === 'changes' && <ChangesSheet app={app} />}
      {sheet === 'appoint' && <AppointSheet app={app} />}
      {sheet === 'review' && <ReviewSheet app={app} />}
      {dialog === 'size' && <SizeDialog app={app} />}
      <SnackbarSlot app={app} />
    </div>
  );
}
