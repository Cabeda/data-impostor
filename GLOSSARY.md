# Glossary

The words this site uses for the things it is made of. When a name in the code
disagrees with a term here, the code is the thing to fix.

## Entry

One file in a collection: a post under `src/data/blog/`, a reading note under
`src/data/reads/`, a talk, or a synced Mastodon post. An entry has an id, a
`pubDate`, and a path.

## Collection

A named set of entries that Astro loads together — `blog`, `reads`, `talks`,
`mastodon`. Declared in `src/content.config.ts`, which is a thin adapter: the
loading rules live behind the content intake module.

## Content intake

The module at `src/lib/content-intake.ts`. It answers, for an entry the site
generates, where it lives and when it was published.

- **Interface:** `postIdentity`, `parseEntryId`, `checkEntryDate`,
  `renderReadsEntry`, `slugFromTitle`, and the date readers.
- **Implementation:** date formatting, slug derivation, id parsing, and the
  markup a reads entry renders to.
- **Adapters at its seam:** `src/lib/identity-loader.ts` (validation during
  `astro dev`, `astro check` and `astro build`) and the writers under
  `scripts/` (`readeck.ts`, `new_article.ts`).

It imports nothing, so the Astro build and the Deno scripts use the same
module. That is where its leverage comes from: one interface, both runtimes.

## Post identity

The fact that an entry's path and its `pubDate` name the same calendar day.
`20241105-pyscript-demo/index.md` is published on 2024-11-05, and
`src/data/reads/2024/20240918.md` on 2024-09-18; frontmatter that disagrees
fails the build.

## Path is identity

The rule behind post identity: for a blog post the folder name is the URL, so
the path decides, and the frontmatter follows. Renaming the folder would break
links, so it never is the value that yields.

## Entry id

What Astro derives from an entry's path and uses as its key: the folder name for
a blog post (`20241105-pyscript-demo`), the nested path for a reads entry
(`2024/20240918`). Validation reads this id rather than re-parsing the
filesystem, so the check cannot drift from the rule it checks.

## Undated page

A blog entry that is a page rather than a post — `uses`, `workflow` — and so has
no publication date to anchor in its path. The exception is a named set in
content intake, not a pattern: a new undated file fails the build until someone
decides whether it is a page or a post.

## Reads entry

A reading note's body: `## [title by author](url)`, then one `- highlight`
bullet per highlight. The reads page styles exactly this shape, so the renderer
lives in content intake, next to the entry's identity, rather than in the script
that fetches the bookmark.
