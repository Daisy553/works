import fs from 'node:fs';
import path from 'node:path';

export function tagSlug(tag) {
  return String(tag)
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '');
}

export function readingMinutesFromText(text) {
  const source = String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const cjk = (source.match(/[\u3400-\u9fff]/g) || []).length;
  const latin = source
    .replace(/[\u3400-\u9fff]/g, ' ')
    .split(/[^A-Za-z0-9+#]+/)
    .filter((word) => word.length > 1);
  const minutes = cjk / 450 + latin.length / 220;

  return Math.max(1, Math.round(minutes));
}

export function readMarkdownBody(id) {
  const file = path.join(process.cwd(), 'src/content/posts', `${id}.md`);
  const raw = fs.readFileSync(file, 'utf8');

  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '');
}

export function readingMinutesFor(post) {
  const text = typeof post?.body === 'string' && post.body.trim().length > 0
    ? post.body
    : readMarkdownBody(post.id);

  return readingMinutesFromText(text);
}

export function sortPosts(posts) {
  return [...posts].sort((a, b) => {
    const sortDelta = (b.data.sort ?? 0) - (a.data.sort ?? 0);

    if (sortDelta !== 0) {
      return sortDelta;
    }

    return b.data.date.getTime() - a.data.date.getTime();
  });
}

export function publishedPosts(posts) {
  return sortPosts(posts.filter((post) => post.data.draft !== true));
}

export function formatPostDate(post) {
  if (post.data.dateLabel) {
    return post.data.dateLabel;
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(post.data.date);
}

export function postDateTime(post) {
  return post.data.date.toISOString();
}

export function adjacentPosts(posts, id) {
  const index = posts.findIndex((post) => post.id === id);

  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : null,
  };
}

export function collectTags(posts) {
  const tags = new Map();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);

      if (!tags.has(slug)) {
        tags.set(slug, { tag, slug, posts: [] });
      }

      tags.get(slug).posts.push(post);
    }
  }

  return [...tags.values()].sort((a, b) => a.tag.localeCompare(b.tag, 'zh-CN'));
}

export function archiveGroup(post) {
  if (post.data.dateLabel) {
    return post.data.dateLabel;
  }

  return String(post.data.date.getUTCFullYear());
}

export function groupByArchive(posts) {
  const groups = new Map();

  for (const post of posts) {
    const label = archiveGroup(post);

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label).push(post);
  }

  return [...groups.entries()];
}

export function groupPosts(posts) {
  const groups = new Map();

  for (const post of posts) {
    const category = post.data.category;

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    groups.get(category).push(post);
  }

  return [...groups.entries()];
}
