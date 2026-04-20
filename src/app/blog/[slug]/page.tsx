import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { defaultSiteConfig } from "@/constants/default-site-config";
import { getAllPosts, getPostBySlug } from "@/lib/notion/notion-public";
import { renderContent } from "@/utils/notion-detail-page/render-content";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — Lufra" };

  const url = `/blog/${post.slug}`;
  const description =
    post.excerpt || `Read "${post.name}" on the ${defaultSiteConfig.name} blog.`;
  const ogImages = post.coverImage ? [{ url: post.coverImage }] : undefined;
  const publishedTime = post.createdTime
    ? new Date(post.createdTime).toISOString()
    : undefined;
  const modifiedTime = post.lastEditedTime
    ? new Date(post.lastEditedTime).toISOString()
    : undefined;

  return {
    title: `${post.name} — ${defaultSiteConfig.name}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.name,
      description,
      url,
      type: "article",
      siteName: defaultSiteConfig.name,
      locale: "en_US",
      publishedTime,
      modifiedTime,
      authors: post.authors.map((a) => a.name),
      tags: post.tags.map((t) => t.name),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.name,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const canonicalUrl = `${defaultSiteConfig.siteUrl}/blog/${post.slug}`;
  const publishedIso = post.createdTime
    ? new Date(post.createdTime).toISOString()
    : undefined;
  const modifiedIso = post.lastEditedTime
    ? new Date(post.lastEditedTime).toISOString()
    : publishedIso;

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.name,
    description: post.excerpt || undefined,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: publishedIso,
    dateModified: modifiedIso,
    author:
      post.authors.length > 0
        ? post.authors.map((a) => ({ "@type": "Person", name: a.name }))
        : [{ "@type": "Organization", name: defaultSiteConfig.name }],
    publisher: {
      "@type": "Organization",
      name: defaultSiteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${defaultSiteConfig.siteUrl}${defaultSiteConfig.logo}`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: post.tags.map((t) => t.name).join(", ") || undefined,
    url: canonicalUrl,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${defaultSiteConfig.siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${defaultSiteConfig.siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav className="mb-8" aria-label="Breadcrumb">
        <Link
          href="/blog"
          className="text-sm text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline"
        >
          ← Back to Blog
        </Link>
      </nav>

      <article>
        <header className="mb-10">
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.pageId} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            {post.name}
          </h1>
          {post.excerpt && (
            <p className="mb-6 text-lg text-neutral-600">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 border-t border-b border-neutral-200 py-4 text-sm text-neutral-600">
            {post.authors.length > 0 && (
              <div className="flex items-center gap-2">
                {post.authors[0].avatar && (
                  <Image
                    src={post.authors[0].avatar}
                    alt={post.authors[0].name}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <span className="font-medium text-neutral-900">
                  {post.authors.map((a) => a.name).join(", ")}
                </span>
              </div>
            )}
            {post.createdTime > 0 && (
              <>
                <span className="text-neutral-300">•</span>
                <time dateTime={publishedIso}>{formatDate(post.createdTime)}</time>
              </>
            )}
          </div>
        </header>

        {post.coverImage && (
          <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-100">
            <Image
              src={post.coverImage}
              alt={post.name}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose-neutral">
          {renderContent(post.content, post.name)}
        </div>
      </article>

      {post.relatedPosts.length > 0 && (
        <section className="mt-20 border-t border-neutral-200 pt-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">
            Related Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {post.relatedPosts.map((related) => (
              <Link
                key={related.pageId}
                href={`/blog/${related.slug}`}
                className="group block"
              >
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                  {related.coverImage && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      <Image
                        src={related.coverImage}
                        alt={related.name}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="px-6 py-5">
                    <h3 className="line-clamp-2 font-semibold text-neutral-900 group-hover:text-neutral-700">
                      {related.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
