# Agents

This project uses or can interact with software agents (human-assisting tools, CI/deploy bots, or automation scripts). This document describes the expected agents, how they should be used with this repository, and safety/operational guidance for contributors.

**Purpose:**
- Explain the role of automated and assisted agents when working on this repository.
- Provide usage examples for contributors who want to interact with coding assistants or automation.

## Agents Overview

- **Coding assistants (e.g. GitHub Copilot / Chat-based coding agents)**: Helpful for editing, scaffolding, and creating small-to-medium code changes. Use them for drafts and repetitive edits, but always review and test generated code.
- **Deployment / Hosting agents (e.g. Vercel)**: This project includes a `vercel.json` configuration and may be deployed by Vercel or similar services. Deployment agents run build and deploy steps — avoid exposing secrets in the repo.
- **Local automation scripts**: Scripts under `scripts/` (for example `new_article.ts`, `readeck.ts`) automate common tasks. Run and inspect scripts locally before trusting them.

## How to Use a Coding Agent with this Repo

When interacting with a coding assistant (locally or via a web UI), follow these steps:

1. Give concise context: mention the repo name, relevant file path(s), and the goal (e.g., "Add an author field to blog metadata and update templates").
2. Ask for small, incremental changes. Prefer multiple small patches over one large patch.
3. Request tests or manual verification steps when the change impacts build or rendering (Astro pages, CSS, or scripts).
4. Before committing, run local checks: `pnpm install` and site build (see `package.json` scripts). Review code style and run tests, if available.

Example prompt templates:

```
Make a minimal change to `src/layouts/BlogPost.astro` to add the `author` field to the frontmatter rendering. Keep styles unchanged and provide a one-line description for the commit message.
```

```
Create a small script under `scripts/` named `sync-tags.ts` that scans `src/data/blog` markdown and outputs a `tags.json` file with unique tags. Keep the script TypeScript, minimal, and provide a usage instruction.
```

## Safety and Secrets

- Do not place any secrets, API keys, or private credentials in the repository. Use environment variables and secure secret storage provided by the deployment platform.
- When an agent suggests configuration changes (e.g., to `vercel.json` or CI configs), verify that the change does not expose secrets or widen access inadvertently.

## Review & Testing Guidelines

- Always review generated code manually. Agents can make syntactic or semantic mistakes.
- Run the local build and preview the site after changes that affect content or layout.
- If you modify data under `src/data/` or `public/`, verify that rendered pages look as expected.

## Contributing and Adding Agents

- If you add automation (bots or scheduled tasks), document their purpose and scope in `AGENTS.md` and add any required runbook notes.
- Add tests or verification steps for automated changes where feasible.

## Troubleshooting

- If an automated deploy fails, check build logs on the deployment provider (Vercel). Inspect `package.json` build scripts and `astro.config.mjs`.
- For content rendering issues, check the layout files in `src/layouts/` and components in `src/components/`.

---

## Project Architecture & Dependencies

This repository is a personal blog and slide site maintained by José Cabeda (data engineer, Portugal). The site is built with Astro and TypeScript and contains blog posts, reading notes, and slides.

- **Core framework:** `astro` (static site generator) builds the site from source files in `src/` into a static output. Use `pnpm install` then `pnpm run dev` (or `npm run dev`) to run the dev server and `pnpm run build` to create a production build.
- **Content layout:** Content lives under `src/data/` (blog posts, reads, slides) and pages/layouts are in `src/pages/` and `src/layouts/`. Re-usable UI lives in `src/components/`.
- **Markdown & MDX:** `@astrojs/mdx` and `remark-toc` are used to author and render Markdown/MDX content and generate table-of-contents entries where appropriate.
- **Image processing:** `sharp` is an image processing dependency used by the build for image resizing/optimization (Astro or other build scripts may leverage it).
- **Notion integration:** `notion-astro-loader` is present to optionally load content from Notion into the site; confirm configuration before running any Notion imports.
- **Slides & themes:** Slide content uses `@slidev/theme-default` and `slidev-theme-academic` for slide rendering and theming.
- **TypeScript:** `typescript` is listed as a dependency; the project uses TypeScript in scripts and site components.
- **Testing / browser automation:** `playwright-chromium` is a dev dependency useful for screenshotting or automated checks. Installing Playwright may require additional setup steps (browsers download) if you plan to run tests.
- **Runtime note — Deno:** The `new-article` script in `package.json` runs a Deno script (`scripts/new_article.ts`) with `deno run --allow-read --allow-write --allow-run`. This means that to run `npm run new-article` you must have Deno installed on your machine in addition to Node/pnpm.

Key `package.json` scripts:

- `dev` / `start`: runs the Astro dev server (`astro dev`).
- `build`: runs `astro build` to produce a production-ready site.
- `preview`: runs `astro preview` for a local preview of the built site.
- `new-article`: runs the Deno script for scaffolding a new article.

Recommended local setup:

1. Install Node.js (LTS) and `pnpm` (the project uses `pnpm` in documentation; `npm` works for scripts but `pnpm` keeps installs reproducible). Node 18+ is recommended for modern Astro versions.
2. Install Deno if you plan to use `scripts/new_article.ts`.
3. Run:

```bash
pnpm install
pnpm run dev
```

Notes about secrets and deployment:

- The site includes `vercel.json` and is compatible with Vercel deployments. Do not check secrets into the repo — use environment variables configured in your deployment platform.
- If you add integrations (Notion, external APIs), keep tokens out of source and document required env vars in a `.env.example` (do not commit real secrets).

Dependency quick reference (from `package.json`):

- astro, @astrojs/mdx, @astrojs/rss, @astrojs/sitemap — core site rendering and feeds.
- notion-astro-loader — optional Notion content loader.
- remark-toc — Markdown table-of-contents.
- sharp — image processing in build pipeline.
- @slidev/theme-default, slidev-theme-academic — slide rendering themes.
- typescript — language tooling.
- playwright-chromium (devDependency) — browser automation / screenshots.

If you'd like, I can also add example agent-run scripts, CI config templates, or a small CONTRIBUTING section describing how to request an agent change. Tell me which you'd prefer next.
