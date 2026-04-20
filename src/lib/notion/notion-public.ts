import { NotionAPI } from "notion-client";
import { cache } from "react";

import type { Author, Post, PostDetail, Tag } from "@/types/blog";
import { processDatabaseContent } from "@/utils/noiton/notion-process-data";
import { extractContentBlocks } from "@/utils/notion-detail-page/get-notion-detail-page";

export const notionClient = new NotionAPI();

const CONTENT_DB_ID = process.env.NOTION_CONTENT_DATABASE_ID;
const AUTHORS_DB_ID = process.env.NOTION_AUTHORS_DATABASE_ID;
const TAGS_DB_ID = process.env.NOTION_TAGS_DATABASE_ID;

const stripDashes = (id: string) => id.replace(/-/g, "");

const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
};

export const getAuthorsMap = cache(async (): Promise<Record<string, Author>> => {
  const dbId = requireEnv("NOTION_AUTHORS_DATABASE_ID", AUTHORS_DB_ID);
  const recordMap = await notionClient.getPage(dbId);
  const { rows } = await processDatabaseContent(recordMap);

  const map: Record<string, Author> = {};
  for (const row of rows) {
    if (!row?.pageId) continue;
    const key = stripDashes(row.pageId);
    map[key] = {
      pageId: row.pageId,
      name: row.Name ?? row.name ?? "",
      slug: row.Slug ?? row.slug ?? "",
      description: row.Description ?? row.description ?? "",
      avatar: row.Avatar ?? row.avatar ?? row.coverImage ?? null,
    };
  }
  return map;
});

export const getTagsMap = cache(async (): Promise<Record<string, Tag>> => {
  const dbId = requireEnv("NOTION_TAGS_DATABASE_ID", TAGS_DB_ID);
  const recordMap = await notionClient.getPage(dbId);
  const { rows } = await processDatabaseContent(recordMap);

  const map: Record<string, Tag> = {};
  for (const row of rows) {
    if (!row?.pageId) continue;
    const key = stripDashes(row.pageId);
    map[key] = {
      pageId: row.pageId,
      name: row.Name ?? row.name ?? "",
      slug: row.Slug ?? row.slug ?? "",
    };
  }
  return map;
});

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const dbId = requireEnv("NOTION_CONTENT_DATABASE_ID", CONTENT_DB_ID);

  const [recordMap, authorsMap, tagsMap] = await Promise.all([
    notionClient.getPage(dbId),
    getAuthorsMap(),
    getTagsMap(),
  ]);


  const { rows, collection } = await processDatabaseContent(recordMap);
  const publishedRows = rows.filter((row) => row?.["Ready to Publish"] === true);

  const posts: Post[] = publishedRows
    .map((row) => {
      const authorIds: string[] = Array.isArray(row.Authors) ? row.Authors : [];
      const tagIds: string[] = Array.isArray(row.Tags) ? row.Tags : [];
      const relatedIds: string[] = Array.isArray(row["Related Posts"])
        ? row["Related Posts"]
        : [];

      return {
        pageId: row.pageId,
        name: row.Name ?? "",
        slug: row.Slug ?? "",
        excerpt: row.Excerpt ?? "",
        featured: row.Featured === true,
        readyToPublish: row["Ready to Publish"] === true,
        coverImage: row.coverImage ?? null,
        authors: authorIds
          .map((id) => authorsMap[stripDashes(id)])
          .filter((a): a is Author => Boolean(a)),
        tags: tagIds
          .map((id) => tagsMap[stripDashes(id)])
          .filter((t): t is Tag => Boolean(t)),
        relatedPostIds: relatedIds,
        createdTime: row.createdTime ?? 0,
        lastEditedTime: row.lastEditedTime ?? 0,
      };
    })
    .sort((a, b) => b.createdTime - a.createdTime);

  return posts;
});

export const getPostBySlug = cache(
  async (slug: string): Promise<PostDetail | null> => {
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) return null;

    const recordMap = await notionClient.getPage(post.pageId);
    const content = extractContentBlocks(recordMap, post.pageId);

    const relatedPosts = post.relatedPostIds
      .map((id) => posts.find((p) => stripDashes(p.pageId) === stripDashes(id)))
      .filter((p): p is Post => Boolean(p));

    return { ...post, content, relatedPosts };
  },
);
