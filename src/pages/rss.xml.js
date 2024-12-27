import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const blogposts = await getCollection("blog");
	const database = (await getCollection("database")).map((post) => {
		return {
			...post,
			data: {
				title: post.data.properties.Name,
				pubDate: post.data.properties.pubDate,
				description: "",
				heroImage: coverImage,
				tags: [],
			},
		};
	});
	const allPosts = [...blogposts, ...database];
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		stylesheet: '/rss/styles.xsl',
		xmlns: {
			media: "http://search.yahoo.com/mrss/",
		},
		items: allPosts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
