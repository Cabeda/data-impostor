import { matchingPostIds, type SearchEntry, type SearchScope } from '../lib/post-search';
import { createResultPrefetcher } from './prefetch-results';

let indexPromise: Promise<SearchEntry[]> | undefined;
let started = false;
const scopes: SearchScope[] = ['all', 'title', 'tags', 'body'];

export function initPostDiscovery() {
  if (started) return;
  started = true;
  document.addEventListener('astro:after-swap', bind);
  document.addEventListener('astro:page-load', bind);
  bind();
}

function bind() {
  const root = document.querySelector<HTMLElement>('#post-discovery');
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const controller = new AbortController();
  const { signal } = controller;
  const input = root.querySelector<HTMLInputElement>('#discovery-query')!;
  const scope = root.querySelector<HTMLSelectElement>('#discovery-scope')!;
  const articles = [...root.querySelectorAll<HTMLElement>('article')];
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-tag]')];
  const extras = [...root.querySelectorAll<HTMLElement>('[data-extra]')];
  const more = root.querySelector<HTMLButtonElement>('#discovery-more');
  const advanced = root.querySelector<HTMLDetailsElement>('.advanced')!;
  const activeFilters = root.querySelector<HTMLElement>('.active-filters')!;
  const activeLabel = root.querySelector('#discovery-active')!;
  const count = root.querySelector('#discovery-count')!;
  const empty = root.querySelector<HTMLElement>('#discovery-empty')!;
  const prefetcher = createResultPrefetcher(root);
  const href = location.href;
  const saved = history.state?.diDiscovery;
  let tag = saved?.href === href && typeof saved.tag === 'string' ? saved.tag : '';
  let topicsExpanded = saved?.href === href && saved.topicsExpanded === true;
  let restoring = true;
  let entries: SearchEntry[] | undefined;
  let measurement = 0;
  if (saved?.href === href) {
    input.value = typeof saved.query === 'string' ? saved.query : '';
    scope.value = scopes.includes(saved.scope) ? saved.scope : 'all';
    advanced.open = saved.advanced === true;
  }

  function remember() {
    if (!root!.isConnected || restoring || location.href !== href) return;
    history.replaceState({ ...history.state, diDiscovery: {
      href, query: input.value, scope: scope.value, tag, topicsExpanded,
      advanced: advanced.open, scrollY: window.scrollY,
    } }, '');
  }

  function update() {
    const start = performance.now();
    const filtering = !!(input.value || tag || scope.value !== 'all');
    const visible = entries ? matchingPostIds(entries, input.value, scope.value as SearchScope, tag) : new Set(articles.map(a => a.dataset.id));
    articles.forEach(article => {
      const hidden = !visible.has(article.dataset.id!);
      if (article.hidden !== hidden) article.hidden = hidden;
    });
    buttons.forEach(button => {
      const pressed = String(button.dataset.tag === tag);
      if (button.getAttribute('aria-pressed') !== pressed) button.setAttribute('aria-pressed', pressed);
    });
    extras.forEach(button => button.hidden = !topicsExpanded && button.dataset.tag !== tag);
    if (more) {
      more.setAttribute('aria-expanded', String(topicsExpanded));
      more.textContent = topicsExpanded ? 'Fewer topics' : 'More topics';
    }
    activeFilters.hidden = !filtering;
    activeLabel.textContent = [tag ? `Topic: ${tag}` : '', scope.value !== 'all' ? `In: ${scope.selectedOptions[0].text}` : ''].filter(Boolean).join(' · ');
    count.textContent = `${visible.size} of ${articles.length} notes`;
    empty.hidden = visible.size > 0;
    prefetcher.schedule(articles, filtering ? articles.length : 9);
    remember();
    // Diagnostic attributes only: no performance UI in the reading flow.
    root!.dataset.filterMs = (performance.now() - start).toFixed(2);
    delete root!.dataset.paintMs;
    const version = ++measurement;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (root!.isConnected && version === measurement) root!.dataset.paintMs = (performance.now() - start).toFixed(2);
    }));
  }

  input.addEventListener('input', update, { signal });
  scope.addEventListener('change', update, { signal });
  root.addEventListener('click', event => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-tag]');
    if (!button || button.disabled) return;
    tag = button.dataset.tag === tag ? '' : button.dataset.tag!;
    update();
  }, { signal });
  more?.addEventListener('click', () => { topicsExpanded = !topicsExpanded; update(); }, { signal });
  advanced.addEventListener('toggle', remember, { signal });
  root.querySelector('#discovery-reset')!.addEventListener('click', () => { input.value = ''; scope.value = 'all'; tag = ''; update(); }, { signal });
  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; remember(); });
  }, { passive: true, signal });
  document.addEventListener('astro:before-preparation', remember, { signal });
  document.addEventListener('astro:before-swap', () => { controller.abort(); cancelAnimationFrame(scrollFrame); }, { once: true });
  window.addEventListener('pagehide', remember, { signal });

  // Load the search index lazily so 2G / save-data visitors don't pay for it
  // until they actually search (or the browser is idle).
  let indexStarted = false;
  function startIndexLoad() {
    if (indexStarted) return;
    indexStarted = true;
    indexPromise ??= fetch('/search/posts.json', { priority: 'low' }).then(response => {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json() as Promise<SearchEntry[]>;
    }).catch(error => { indexPromise = undefined; indexStarted = false; throw error; });
    indexPromise.then(index => {
      if (!root!.isConnected) return;
      entries = index;
      input.disabled = false;
      scope.disabled = false;
      buttons.forEach(button => button.disabled = false);
      update();
      requestAnimationFrame(() => {
        if (!root!.isConnected) return;
        if (saved?.href === href && Number.isFinite(saved.scrollY)) window.scrollTo({ top: saved.scrollY, behavior: 'instant' });
        restoring = false;
        remember();
      });
    }).catch(() => {
      if (!root!.isConnected) return;
      count.textContent = `${articles.length} notes · Search unavailable. Reload to try again.`;
      restoring = false;
    });
  }
  input.addEventListener('focus', startIndexLoad, { once: true, signal });
  const conn = (navigator as any).connection;
  const slow = conn && (conn.saveData || /2g/.test(conn.effectiveType || ''));
  if (!slow) {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(startIndexLoad, { timeout: 4000 });
    } else {
      setTimeout(startIndexLoad, 1500);
    }
  }
}
