import { useLayoutEffect, useRef, type ReactNode } from 'react';

const DEVICE_HEIGHT = 844;

/** How much taller the phone must be so no scroll area inside it still scrolls. */
function overflowOf(root: HTMLElement) {
  let extra = 0;
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    if (el.tagName === 'TEXTAREA') continue;
    const { overflowY } = getComputedStyle(el);
    if (overflowY === 'auto' || overflowY === 'scroll') {
      extra = Math.max(extra, el.scrollHeight - el.clientHeight);
    }
  }
  return extra;
}

/**
 * The 390×844 phone frame. With `fullScroll`, it grows to show the whole scroll length of the
 * current screen, and re-measures whenever the screen's content changes.
 */
export function PhoneFrame({ fullScroll, children }: { fullScroll: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!fullScroll) {
      el.style.height = '';
      return;
    }

    let frame = 0;
    const fit = () => {
      frame = 0;
      // Measure from the device height so content that shrank is picked up too.
      el.style.height = `${DEVICE_HEIGHT}px`;
      el.style.height = `${DEVICE_HEIGHT + overflowOf(el)}px`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(fit);
    };

    fit();
    const mutations = new MutationObserver(schedule);
    mutations.observe(el, { subtree: true, childList: true, characterData: true, attributes: true });
    // Images change height when they finish loading; `load` doesn't bubble, so listen in capture.
    el.addEventListener('load', schedule, true);
    return () => {
      mutations.disconnect();
      el.removeEventListener('load', schedule, true);
      if (frame) cancelAnimationFrame(frame);
      el.style.height = '';
    };
  }, [fullScroll]);

  return (
    <div ref={ref} className={fullScroll ? 'screens-phone is-full' : 'screens-phone'}>
      {children}
    </div>
  );
}
