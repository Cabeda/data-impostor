import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import remarkToc from 'remark-toc';

// https://astro.build/config
export default defineConfig({
	site: 'https://cabeda.dev',
	build: {
		// Inline every stylesheet: a 2 KB component stylesheet in a separate
		// request is a render-blocking round trip on every page.
		inlineStylesheets: 'always',
	},
	session: false,
	experimental: {
		incrementalBuild: true,
	},
	integrations: [mdx(
		{
			syntaxHighlight: 'shiki',
			shikiConfig: {
				theme: 'github-dark-default', themes: {
					light: 'github-light',
					dark: 'github-dark',
				},
			},
			remarkPlugins: [[remarkToc, { heading: "contents" }]],
			remarkRehype: { footnoteLabel: 'Footnotes' },
		}
	), sitemap()],
	image: {
		responsiveStyles: false,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.amazonaws.com",
			},
		],
	},
});
