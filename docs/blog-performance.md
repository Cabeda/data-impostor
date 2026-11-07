# Notebook navigation and search

The selected inline discovery layout is live on the normal `/blog/` route. Five compact topics appear below search, with More topics and collapsed Advanced search. All notes remain readable without JavaScript or when the index request fails.

## Navigation

Home prefetches the nine Recent links and the two archive entry points using Astro's load strategy. Previous/next article links use viewport prefetch. Internal article-body links use delegated pointer/focus prefetch, which survives ClientRouter swaps. External links and same-article anchors are excluded. Astro handles duplicate requests and data-saving/slow connections.

The archive warms nine articles by default. Filtering schedules matching articles after a 200 ms pause, in idle batches of three with 100 ms between batches. A new filter or page swap cancels pending work; already-issued requests may complete. Prefetch warms HTML and is a best-effort browser hint, not a navigation-time guarantee.

## Return to results

Query, exact selected topic, search scope, disclosure state and scroll position live in the browser history entry, alongside Astro's own state. Back restores that entry; a fresh archive navigation starts unfiltered. No local-storage persistence is needed. Handlers are removed on swaps and detached roots cannot update the active page.

## Article first screen

Covers have a responsive image preload using the same transform, srcset and sizes as PostCover. Covers remain eager/high-priority and ordinary Markdown images retain Astro's lazy/async defaults. Article text is static HTML. Reader audio remains loaded on demand.

## Search artifact

`/search/posts.json` is a static build artifact. Each field is normalized once at build time; body text is stored once, without a duplicated combined “all” field or raw body. The browser loads/parses it once per ClientRouter session, then normalizes only the query. All-scope matching requires every word to occur in any field. Case/accent-insensitive substring semantics and newest-first order are retained. Markdown source, including URLs, remains searchable.

Search controls are temporarily disabled while the initial index loads. A failed load leaves the complete article list and a reload message. The HTTP artifact can use normal deployment/browser caching; this change does not introduce a service worker or guarantee offline behavior.

## Evidence — 2026-11-06

- 65 unit tests passed, including three search tests for cross-field words, accents, scope isolation, topic filtering, empty/no-match and compact index structure.
- Targeted TypeScript checks passed for post-search, post-discovery and prefetch-results. Full Astro check remains blocked by the local dependency installation (`@emnapi/core` missing when invoking the installed checker directly).
- Final production build: 199 pages; existing MDX and CSS warnings remain.
- Generated covers: preload href/srcset/sizes matched all 115 cover images. 48 ordinary generated images were lazy-loaded.
- Index: 146 entries, 389,049 bytes, approximately 134 KB with compression (local measurement, not deployed transfer size). Archive HTML contains no article-body search payload.
- Live browser: four title matches for DuckDB, 43 matches in all scope, 16 when combined with newsletter. Query, scope, topic, advanced/topic disclosure and exact scroll position restored after article/back navigation (measured root offset -551.5 px before/after). A fresh archive visit from home reset the filters.
- Home produced an archive prefetch hint alongside its nine Recent targets.
- Final live search measurement: 18 samples, six queries over three rounds; synchronous handler 0.9–4.7 ms; maximum two-animation-frame rendering proxy 52.2 ms. These diagnostics exclude initial loading and event-queue delay, are not exact presentation timestamps, and do not establish mobile performance.
- Independent review found an Astro prefetch scan/listener ordering issue in inline links; delegated pointer/focus handling replaced late attribute marking.

The throwaway discovery prototype and decision record are preserved on local branch `codex/prototype-post-discovery-20261106` (commit `a00be83553e5902a2e5a92dea2f586c4fe6b7148`). Option A was selected for progressive disclosure; prototype variants and switcher are removed from the implementation checkout.
