import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { publishedPosts } from '../lib/posts.mjs';
import { archiveDescription } from '../lib/site.mjs';

export async function GET(context) {
  const posts = publishedPosts(await getCollection('posts'));

  return rss({
    title: 'Daisy Lab',
    description: archiveDescription,
    site: context.site,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/notes/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: '<language>zh-CN</language>',
  });
}
