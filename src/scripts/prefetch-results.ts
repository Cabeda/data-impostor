import { prefetch } from 'astro:prefetch';

/** Keep speculative work out of the input handler and discard stale result queues. */
export function createResultPrefetcher(root: HTMLElement) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let idle: number | undefined;
  let generation = 0;

  function cancel() {
    generation++;
    clearTimeout(timer);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    idle = undefined;
  }

  function schedule(articles: HTMLElement[], limit = articles.length) {
    cancel();
    const current = generation;
    const queue = articles.filter(article => !article.hidden).slice(0, limit);
    let index = 0;
    function batch() {
      if (current !== generation || !root.isConnected || root.hidden) return;
      for (let count = 0; count < 3 && index < queue.length; count++, index++) {
        const article = queue[index];
        const link = article.querySelector<HTMLAnchorElement>('h2 a');
        if (!article.hidden && link) prefetch(link.href);
      }
      if (index < queue.length) timer = setTimeout(background, 100);
    }
    function background() {
      if (current !== generation || !root.isConnected) return;
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(batch, { timeout: 1000 });
      else batch();
    }
    // Wait for typing to settle; the search results themselves update immediately.
    timer = setTimeout(background, 200);
  }

  document.addEventListener('astro:before-swap', cancel, { once: true });
  return { schedule };
}
