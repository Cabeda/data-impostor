import { navigate } from 'astro:transitions/client';
import { prefetch } from 'astro:prefetch';
import type { TransitionBeforePreparationEvent, TransitionBeforeSwapEvent } from 'astro:transitions/client';

let started = false;
let busy = false;
type PendingNavigation = { direction: 'previous' | 'next'; repeat: boolean };
let pending: PendingNavigation | undefined;

function takePending(): PendingNavigation | undefined {
  const queued = pending;
  pending = undefined;
  return queued;
}
let held: string | undefined;

function adjacent(direction: 'previous' | 'next') {
  return document.querySelector<HTMLAnchorElement>(direction === 'previous' ? '.pager-prev' : '.pager-next');
}

function warmNeighbors() {
  if (!document.body.classList.contains('reader-page')) return;
  for (const direction of ['previous', 'next'] as const) {
    const link = adjacent(direction);
    if (link) prefetch(link.href);
  }
}

async function move(direction: 'previous' | 'next', repeat: boolean) {
  if (busy) { pending = { direction, repeat }; return; }
  busy = true;
  try {
    do {
      pending = undefined;
      const link = adjacent(direction);
      if (!link || !document.body.classList.contains('reader-page')) break;
      const from = location.href;
      await navigate(link.href, { info: { readerKeyboard: true } });
      if (location.href === from) break;
      const queued = takePending();
      if (!queued || (queued.repeat && !held)) break;
      direction = queued.direction;
    } while (true);
  } finally {
    busy = false;
    pending = undefined;
  }
}

export function initReaderNavigation() {
  if (started) return;
  started = true;
  warmNeighbors();
  document.addEventListener('astro:page-load', warmNeighbors);
  document.addEventListener('astro:before-preparation', event => {
    const navigation = event as TransitionBeforePreparationEvent;
    if (navigation.info?.readerKeyboard) {
      // Skip the simulated animation in browsers without native view transitions.
      document.querySelector('meta[name="astro-view-transitions-fallback"]')?.setAttribute('content', 'swap');
    } else {
      held = undefined;
      pending = undefined;
    }
  });
  document.addEventListener('astro:before-swap', event => {
    const navigation = event as TransitionBeforeSwapEvent;
    if (navigation.info?.readerKeyboard) {
      navigation.viewTransition.ready.catch(() => {});
      navigation.viewTransition.skipTransition();
    }
  });
  document.addEventListener('keydown', event => {
    if (!document.body.classList.contains('reader-page') || event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const target = event.target as HTMLElement;
    if (target.isContentEditable || target.closest('input,textarea,select,button,a,summary,[role="slider"],[role="tab"],[role="textbox"]')) return;
    if (document.querySelector('dialog[open],.contents-sheet.is-open,details[open]') || window.getSelection()?.isCollapsed === false) return;
    const direction = event.key === 'ArrowLeft' ? 'previous' : 'next';
    if (!adjacent(direction)) return;
    event.preventDefault();
    held = event.key;
    void move(direction, event.repeat).catch(() => { /* Router retains normal link navigation as a fallback. */ });
  });
  document.addEventListener('keyup', event => {
    if (event.key === held) { held = undefined; if (pending?.repeat) pending = undefined; }
  });
  window.addEventListener('blur', () => { held = undefined; pending = undefined; });
}
