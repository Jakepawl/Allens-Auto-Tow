/**
 * Publishes a blog post to Google Business Profile as a local post.
 *
 * Usage:
 *   npx tsx scripts/publish-google-post.ts <blog-slug>
 *   npx tsx scripts/publish-google-post.ts brake-warning-signs
 *   npx tsx scripts/publish-google-post.ts --all
 *
 * Prerequisites:
 *   1. Run `npx tsx scripts/gbp-auth.ts` once to authenticate
 *   2. Ensure credentials/gbp-tokens.json exists
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createGooglePost } from './gbp-client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, '..', 'src', 'content', 'blog');
const SITE_URL = 'https://www.allensautotow.com';

interface BlogFrontmatter {
  title: string;
  description: string;
  publishDate: string;
  image?: string;
  draft?: boolean;
}

function parseFrontmatter(raw: string): { frontmatter: BlogFrontmatter } {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error('No frontmatter found');

  const fm: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: string | boolean = line.slice(colonIdx + 1).trim();
    // Strip quotes
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    fm[key] = value;
  }

  return { frontmatter: fm as unknown as BlogFrontmatter };
}

function loadBlogPost(slug: string): { frontmatter: BlogFrontmatter; slug: string } | null {
  const extensions = ['.md', '.mdx'];
  for (const ext of extensions) {
    const filePath = join(BLOG_DIR, `${slug}${ext}`);
    try {
      const raw = readFileSync(filePath, 'utf-8');
      const { frontmatter } = parseFrontmatter(raw);
      return { frontmatter, slug };
    } catch {
      continue;
    }
  }
  return null;
}

function getAllBlogSlugs(): string[] {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.(md|mdx)$/, ''));
}

async function publishPost(slug: string) {
  const post = loadBlogPost(slug);
  if (!post) {
    console.error(`Blog post not found: ${slug}`);
    return;
  }

  if (post.frontmatter.draft) {
    console.log(`Skipping draft: ${slug}`);
    return;
  }

  // Google Posts have a 1500-character limit for summary
  const summary = post.frontmatter.description.slice(0, 1400);
  const postUrl = `${SITE_URL}/blog/${slug}`;

  console.log(`Publishing: "${post.frontmatter.title}" → Google Business Profile`);

  const result = await createGooglePost({
    summary: `${post.frontmatter.title}\n\n${summary}\n\nRead more on our blog →`,
    callToAction: {
      actionType: 'LEARN_MORE',
      url: postUrl,
    },
    media: post.frontmatter.image
      ? [{ mediaFormat: 'PHOTO', sourceUrl: `${SITE_URL}${post.frontmatter.image}` }]
      : undefined,
    topicType: 'STANDARD',
  });

  console.log(`  ✓ Published! Post ID: ${(result as { name?: string }).name ?? 'unknown'}`);
}

// --- Main ---
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage:');
  console.log('  npx tsx scripts/publish-google-post.ts <slug>');
  console.log('  npx tsx scripts/publish-google-post.ts --all');
  console.log('');
  console.log('Available posts:');
  getAllBlogSlugs().forEach((s) => console.log(`  - ${s}`));
  process.exit(0);
}

if (args[0] === '--all') {
  const slugs = getAllBlogSlugs();
  console.log(`Publishing ${slugs.length} blog posts to Google Business Profile...\n`);
  for (const slug of slugs) {
    await publishPost(slug);
  }
} else {
  await publishPost(args[0]);
}
