import type { BlockContent } from "@/utils/notion-detail-page/types";

export interface Author {
  pageId: string;
  name: string;
  slug: string;
  description: string;
  avatar: string | null;
}

export interface Tag {
  pageId: string;
  name: string;
  slug: string;
}

export interface Post {
  pageId: string;
  name: string;
  slug: string;
  excerpt: string;
  featured: boolean;
  readyToPublish: boolean;
  coverImage: string | null;
  authors: Author[];
  tags: Tag[];
  relatedPostIds: string[];
  createdTime: number;
  lastEditedTime: number;
}

export interface PostDetail extends Post {
  content: BlockContent[];
  relatedPosts: Post[];
}
